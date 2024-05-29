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
import {examination,treament,review,patient,dentist,general} from '../utils/prompt.js'
import Anthropic from "@anthropic-ai/sdk";
import {treatment_notes,examination_notes,review_notes,patient_letters,dentist_letters,general_notes,notes_letters} from '../utils/sonnet.js'
import { AssemblyAI } from 'assemblyai'

dotnet.config()

// const client = new AssemblyAI({
//   apiKey: "f3fde506b3b44dac96d91ceef4bcf236"
// })

// const audioUrl =
//   'https://storage.googleapis.com/aai-web-samples/5_common_sports_injuries.mp3'

// const config = {
//   audio_url: audioUrl
// }

// const run = async () => {
//   const transcript = await client.transcripts.create(config)
//   console.log(transcript.text)
// }

// run()

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
router.post('/',CheckUser, async (req, res) => {
    // console.log(req.body)
    const { transcript, userId } = req.body
    let response = {}
    try {
            const model= "claude-3-sonnet-20240229";
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
                    stream:true
            });
            let res_agent=""
            for await (const event of agent) {
                const type=event.type
                if(type=='content_block_stop'){
                    // res.end()
                    break
                }
                else if(type=='content_block_delta'){
                const text=event.delta.text
                // console.log(text)
                if(text){
                    res.write(`${text}`)
                    res_agent+=text
                }
                }
              }
              response.openai=res_agent
            console.log("res",response.openai)

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