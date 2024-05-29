import { Router } from "express";
import dotnet from 'dotenv'
import user from '../helpers/user.js'
import jwt from 'jsonwebtoken'
import chat from "../helpers/chat.js";
import OpenAI from 'openai';
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";
import { examination, treament, review, patient, dentist, general } from '../utils/prompt.js'
import Anthropic from "@anthropic-ai/sdk";
import { treatment_notes, examination_notes, review_notes, patient_letters, dentist_letters, general_notes, notes_letters } from '../utils/sonnet.js'
import { AssemblyAI } from 'assemblyai'
import multer from 'multer'
import fs from 'fs'
const upload = multer({ dest: 'audiofile/' }); 
dotnet.config()
const client = new AssemblyAI({
    apiKey: 'f98b4c28f45a4a3e9ac1dc87190f904d'
})
let router = Router()

const CheckUser = async (req, res, next) => {
    jwt.verify(req.cookies?.userToken, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
        if (decoded) {
            let userData = null

            try {
                userData = await user.checkUserFound(decoded)
            } catch (err) {
                if (err?.notExists) {
                    res.clearCookie('userToken')
                        .status(405).json({
                            status: 405,
                            message: err?.text
                        })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: err
                    })
                }
            } finally {
                if (userData) {
                    req.body.userId = userData._id
                    next()
                }
            }

        } else {
            res.status(405).json({
                status: 405,
                message: 'Not Logged'
            })
        }
    })
}

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
});
const anthropic = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'],
});
router.get('/', (req, res) => {
    res.send("Welcome to Dental Advisor api v1")
})
router.post('/recording', upload.single('audioBlob'), async (req, res) => {
    const recordedBlob = req.file.path;
    console.log("re",recordedBlob)
    let response = {}
    try {
const params = {
    audio: recordedBlob,
    speaker_labels: true
}
    const transcript = await client.transcripts.transcribe(params)
    console.log(transcript.text)
    response=transcript.text
    if (transcript) {
        if (transcript.utterances) {
            for (let utterance of transcript.utterances) {
                console.log(`Speaker ${utterance.speaker}: ${utterance.text}`)
            }
        } else {
            console.log("no transcript to show")
        }
    }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    content: response
                }
            })
        }
    }
})
router.post('/uploadfile', upload.single('audioBlob'), async (req, res) => {
    const recordedBlob = req.file.path;
    console.log("re",recordedBlob)
    let response = {}
    try {
const params = {
    audio: recordedBlob,
    speaker_labels: true
}
    const transcript = await client.transcripts.transcribe(params)
    console.log(transcript.text)
    response=transcript.text
    if (transcript) {
        if (transcript.utterances) {
            for (let utterance of transcript.utterances) {
                console.log(`Speaker ${utterance.speaker}: ${utterance.text}`)
            }
        } else {
            console.log("no transcript to show")
        }
    }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    content: response
                }
            })
        }
    }
})
router.post('/transcript', CheckUser, async (req, res) => {
    
    const { transcript, userId } = req.body
    console.log("tran",transcript)
    let response = {}
    try {
        const model = "claude-3-sonnet-20240229";
        const agent = await anthropic.messages.create({
            model: model,
            max_tokens: 4000,
            temperature: 0.2,
            system:
                `
                Please carefully analyze the sentiment, level of pain experienced by the patient, and risk of the patient churning (not returning for future appointments) in the following transcript of a dental appointment:

<transcript>
{{TRANSCRIPT}}
</transcript>

First write out your analysis of the sentiment, pain level and churn risk you perceive in the transcript. Explain your reasoning, referring to specific statements or exchanges that influence your assessment.

Then provide the following in a table format:
- The percentage breakdown of positive, neutral and negative sentiment in the transcript 
- The percentage of pain experienced by the patient during the appointment
- The percentage risk of the patient churning and not returning for future appointments

Make sure to show your work and reasoning in the section first before providing the final results in the table.
                `
            ,
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": transcript
                        }
                    ]
                }
            ],
            stream: true
        });
        let res_agent = ""
        for await (const event of agent) {
            const type = event.type
            if (type == 'content_block_stop') {
                // res.end()
                break
            }
            else if (type == 'content_block_delta') {
                const text = event.delta.text
                // console.log(text)
                if (text) {
                    res.write(`${text}`)
                    res_agent += text
                }
            }
        }
        response.openai = res_agent
        console.log("res", response.openai)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response.openai) {
            // res.status(200).json({
            //     status: 200,
            //     message: 'Success',
            //     data: {
            //         // _id: response.db['chatId'],
            //         content: response.openai
            //     }
            // })
            // response.db = await chat.newResponse(prompt, response, userId,threadId,option,type)
            res.write("[stop]")
            res.write(" ")
            // res.write(response.db['chatId'])
            res.end()
        }
    }
})


export default router