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


dotnet.config()

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
let assistant_id=process.env.ASSISTANT_ID_GENERAL

  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY =process.env.GEMINI_API_KEY
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.1,
    topK: 1,
    topP: 1,
    maxOutputTokens: 4098,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
const prompt_model=process.env.prompt_model
let threadId=""
router.post('/', CheckUser, async (req, res) => {
    // console.log(req.body)
    const { prompt, userId, option,type } = req.body
    console.log(prompt_model)
    let response = {}
    let parts=[]
    console.log(type)
    console.log(option)
    console.log("post",prompt)
    let system_msg=""
    if(option=="notes"){
        if(type=="Examination Note"){
            assistant_id=process.env.ASSISTANT_ID_EXAMINATION
            system_msg=examination_notes
            parts=examination
        }
        else if(type=="Treatment Note"){
            assistant_id=process.env.ASSISTANT_ID_TREATMENT
            system_msg=treatment_notes
            parts=treament
        }
        else if(type=="Review Note"){
            assistant_id=process.env.ASSISTANT_ID_REVIEW
            system_msg=review_notes
            parts=review
        }
        else {
            assistant_id=process.env.ASSISTANT_ID_GENERAL
            system_msg=general_notes
            parts=general
        }
    }else if(option=="letters"){
        if(type=="Patient Letter"){
            assistant_id=process.env.ASSISTANT_ID_PATIENT
            system_msg=patient_letters
            parts=patient
        }
        else if(type=="Dentist Letter"){
            assistant_id=process.env.ASSISTANT_ID_DENTIST
            system_msg=dentist_letters
            parts=dentist
        }
        else if(type=="notes Letter"){
            assistant_id=process.env.ASSISTANT_ID_DENTIST
            system_msg=notes_letters
            parts=dentist
        }
        else {
            assistant_id=process.env.ASSISTANT_ID_GENERAL
            system_msg=general_notes
            parts=general
        }
    }else{
        assistant_id=process.env.ASSISTANT_ID_GENERAL
        system_msg=general_notes
        parts=general
    }
    if(prompt_model=='gpt4'){
        const threadResponse = await openai.beta.threads.create();
        threadId = threadResponse.id;
    }
    
    try {
        if(prompt_model=="sonnet"){
            const model1= "claude-3-sonnet-20240229";
            const model2= "claude-3-haiku-20240229";
            const agent1 = await anthropic.messages.create({
                model: option!="letters"?model2:model1,
                max_tokens: 4000,
                temperature: 0,
                system: system_msg[0].text,
                messages: [
                    {
                        "role": "user",
                        "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                        ]
                    }
                    ],
                    stream:true
            });
            
            let res_agent1=""
            for await (const event of agent1) {
                const type=event.type
                if(type=='content_block_stop'){
                    // res.end()
                    break
                }
                else if(type=='content_block_delta'){
                const text=event.delta.text
                // console.log(text)
                if(text){
                    // res.write(`${text}`)
                    res_agent1+=text
                }
                }
              }
            console.log("agent1: ",res_agent1)
            if(option!="letters"){
            // res.write(`\n \n`)
            // res.write(`Agent-2 Review Response: \n \n`)
            const agent2 = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 4000,
                temperature: 0.1,
                system: `Consider yourself as highly trained Dental Expert who can write and analyze the Clinical notes or other dental queries in expert manner. 
                Check for the response for given clinical notes or dental query carefully for clinically accuracy, identify any clinical inconsistent or 
                missing information from a clinical standpoint. 
                Provide some ways to improve the response.`,
                messages:[
                    {
                        "role": "user",
                        "content": [
                        {
                            "type": "text",
                            "text": `Here’s the response for ${option=='notes'?"Clinical notes":"Dental Queries"} on topic ${prompt} :- ${res_agent1}`
                        }
                        ]
                    }
                ],
                stream: true,
            });
            let res_agent2=""
            for await (const event of agent2) {
                const type=event.type
                if(type=='content_block_stop'){
                    // res.end()
                    break
                }
                else if(type=='content_block_delta'){
                const text=event.delta.text
                // console.log(text)
                if(text){
                    // res.write(`${text}`)
                    res_agent2+=text
                }
                }
              }
              console.log("agent2: ",res_agent2)
            //   res.write('\n \n')
            //   res.write('Agent-3 New Response: \n \n')
            const agent3 = await anthropic.messages.create({
                model: "claude-3-sonnet-20240229",
                max_tokens: 4000,
                temperature: 0.1,
                system: `${system_msg[0].text}  Here’s the response generated by previous agent for task ${prompt}: ${res_agent1}`,
                messages:[
                    {
                        "role": "user",
                        "content": [
                        {
                            "type": "text",
                            "text": res_agent2 +` Use these ways to improve the clinical notes or dental query and rewrite the response in detailed manner. 
                            Fulfill any missing information and be clincally accurate from clinical standpoint and remove any any clinical inconsistent. Also make sure to write only answer for the query. Don't write anything other than answer.`
                        }
                        ]
                    }
                ],
                stream: true,
            });
            let res_agent3=""
            for await (const event of agent3) {
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
                    res_agent3+=text
                }
                }
              }
              response.openai=res_agent3
            }
            else response.openai=res_agent1
          console.log("final: ",response.openai)
        }
        else if(prompt_model=="gpt4"){
            await openai.beta.threads.messages.create(threadId, {
                role: "user",
                content: `Write a ${type} on ${prompt}` ,
            });
            const runResponse = await openai.beta.threads.runs.create(threadId, {
                assistant_id: assistant_id,
            });
            let run = await openai.beta.threads.runs.retrieve(threadId, runResponse.id);
            while (run.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            run = await openai.beta.threads.runs.retrieve(threadId, runResponse.id);
            }
            const messagesResponse = await openai.beta.threads.messages.list(threadId);
            const assistantResponses = messagesResponse.data.filter(msg => msg.role === 'assistant');
            response.openai = assistantResponses.map(msg => 
            msg.content
                .filter(contentItem => contentItem.type === 'text')
                .map(textContent => textContent.text.value)
                .join('\n')
            ).join('\n');
        }
        else{
            parts.push({text:`input: Write a ${type} on ${prompt} `})
            parts.push({text: prompt})
            const result = await model.generateContent({
                contents: [{ role: "user", parts}],
                    generationConfig,
                    safetySettings,
                });
            const res = result.response;
            response.openai=res.text()
        }
    // if(response?.openai){
    //     response.db = await chat.newResponse(prompt, response, userId,threadId,option,type)
    // }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response.openai) {
        //     res.status(200).json({
        //         status: 200,
        //         message: 'Success',
        //         data: {
        //             // _id: response.db['chatId'],
        //             content: response.openai
        //         }
        //     })
            response.db = await chat.newResponse(prompt, response, userId,threadId,option,type)
            res.write("[stop]")
            res.write(" ")
            res.write(response.db['chatId'])
            res.end()
        }
    }
})

router.put('/', CheckUser, async (req, res) => {
    const { prompt, userId, chatId,option ,type} = req.body
    console.log(prompt_model)
    console.log(type)
    console.log(option)
    console.log("put",prompt)
    let response = {}
    let parts=[]
    let system_msg=""
    if(option=="notes"){
        if(type=="Examination Note"){
            assistant_id=process.env.ASSISTANT_ID_EXAMINATION
            system_msg=examination_notes
            parts=examination
        }
        else if(type=="Treatment Note"){
            assistant_id=process.env.ASSISTANT_ID_TREATMENT
            system_msg=treatment_notes
            parts=treament
        }
        else if(type=="Review Note"){
            assistant_id=process.env.ASSISTANT_ID_REVIEW
            system_msg=review_notes
            parts=review
        }
        else {
            assistant_id=process.env.ASSISTANT_ID_GENERAL
            system_msg=general_notes
            parts=general
        }
    }else if(option=="letters"){
        if(type=="Patient Letter"){
            assistant_id=process.env.ASSISTANT_ID_PATIENT
            system_msg=patient_letters
            parts=patient
        }
        else if(type=="Dentist Letter"){
            assistant_id=process.env.ASSISTANT_ID_DENTIST
            system_msg=dentist_letters
            parts=dentist
        }
        else if(type=="notes Letter"){
            assistant_id=process.env.ASSISTANT_ID_DENTIST
            system_msg=notes_letters
            parts=dentist
        }
        else {
            assistant_id=process.env.ASSISTANT_ID_GENERAL
            system_msg=general_notes
            parts=general
        }
    }else{
        assistant_id=process.env.ASSISTANT_ID_GENERAL
        system_msg=general_notes
        parts=general
    }
    if(prompt_model=="gpt4"){
        threadId = await chat.getThread(userId,chatId)
    }
    try {
        if(prompt_model=="sonnet"){
            let messagess=[];
            try{
            const  responses = await chat.getChat(userId, chatId)
            // console.log("user:",userId)
            // console.log("chat:",chatId)
            // console.log("resp:",responses)
            let size=responses.length
                for(let i=0;i<size;i++){
                    messagess.push(
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": responses[i].prompt
                                }
                            ]
                        }
                    )
                    messagess.push(
                        {
                            "role": "assistant",
                            "content": [
                                {
                                    "type": "text",
                                    "text": responses[i].content
                                }
                            ]
                        }
                    )
                }
                messagess.push( {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                })
                // console.log("mess:",messagess)
            }
            catch(err){
                console.log("er:",err)
            }
            const msg = await anthropic.messages.create({
                model: "claude-3-sonnet-20240229",
                max_tokens: 4000,
                temperature: 0.1,
                system: system_msg[0].text,
                messages: messagess,
                stream:true
            });
            let answer=""
            for await (const event of msg) {
                const type=event.type
                if(type=='content_block_stop'){
                    res.end()
                    break
                }
                else if(type=='content_block_delta'){
                const text=event.delta.text
                // console.log(text)
                if(text){
                    res.write(`${text}`)
                    answer+=text
                }
                }
              }
            response.openai=answer
            console.log(response.openai)
        }else if(prompt_model=="gpt4"){
            await openai.beta.threads.messages.create(threadId, {
                role: "user",
                content: `Write a ${type} on ${prompt}`,
            });
            const runResponse = await openai.beta.threads.runs.create(threadId, {
                assistant_id: assistant_id,
            });
            let run = await openai.beta.threads.runs.retrieve(threadId, runResponse.id);
            while (run.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            run = await openai.beta.threads.runs.retrieve(threadId, runResponse.id);
            }
            const messagesResponse = await openai.beta.threads.messages.list(threadId);
            const assistantResponses = messagesResponse.data.filter(msg => msg.role === 'assistant');
            response.openai = assistantResponses[0].content
                .filter(contentItem => contentItem.type === 'text')
                .map(textContent => textContent.text.value)
                .join('\n')
        }else{
                parts.push({text:`input: Write a ${type} on ${prompt} `})
            const result = await model.generateContent({
            contents: [{ role: "user", parts}],
                generationConfig,
                safetySettings,
                });
            const res = result.response;
            response.openai=res.text()
        }
        // if(response.openai){
        //     response.db = await chat.updateChat(chatId, prompt, response, userId,threadId,option,type)
        // }
    } catch (err) {
        console.log("error",err)
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.openai) {
            // res.status(200).json({
            //     status: 200,
            //     message: 'Success',
            //     data: {
            //         content: response.openai
            //     }
            // })
            response.db = await chat.updateChat(chatId, prompt, response, userId,threadId,option,type)
        }
        
    }
})

router.get('/saved', CheckUser, async (req, res) => {
    const { userId } = req.body
    const { chatId = null } = req.query

    let response = null

    try {
        response = await chat.getChat(userId, chatId)
    } catch (err) {
        if (err?.status === 404) {
            res.status(404).json({
                status: 404,
                message: 'Not found'
            })
        } else {
            res.status(500).json({
                status: 500,
                message: err
            })
        }
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: response
            })
        }
    }
})

router.get('/history', CheckUser, async (req, res) => {
    const { userId } = req.body

    let response = null

    try {
        response = await chat.getHistory(userId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: "Success",
                data: response
            })
        }
    }
})

router.delete('/all', CheckUser, async (req, res) => {
    const { userId } = req.body

    let response = null

    try {
        response = await chat.deleteAllChat(userId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success'
            })
        }
    }
})
router.delete('/:chatId', CheckUser, async (req, res) => {
    const { userId } = req.body
    const {chatId}=req.params
    let response = null

    try {
        response = await chat.deleteChat(userId,chatId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success'
            })
        }
    }
})

export default router