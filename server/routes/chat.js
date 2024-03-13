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
import {examination,treament,review,patient,dentist} from '../utils/prompt.js'

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

router.get('/', (req, res) => {
    res.send("Welcome to Dental Advisor api v1")
})
let assistant_id=process.env.ASSISTANT_ID_GENERAL

//   const MODEL_NAME = "gemini-1.0-pro";
//   const API_KEY =process.env.GEMINI_API_KEY
//   const genAI = new GoogleGenerativeAI(API_KEY);
//   const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//   const generationConfig = {
//     temperature: 0.9,
//     topK: 1,
//     topP: 1,
//     maxOutputTokens: 2048,
//   };

//   const safetySettings = [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//       category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//   ];
router.post('/', CheckUser, async (req, res) => {
    const { prompt, userId, option,type } = req.body
    // console.log("first")
    let response = {}
    let parts=[]
    console.log(type)
    console.log(option)
    console.log(post,prompt)
    if(option=="notes"){
        if(type=="Examination Note")
            assistant_id=process.env.ASSISTANT_ID_EXAMINATION
        else if(type=="Treatment Note")
            assistant_id=process.env.ASSISTANT_ID_TREATMENT
        else if(type=="Review Note")
            assistant_id=process.env.ASSISTANT_ID_REVIEW
        else assistant_id=process.env.ASSISTANT_ID_GENERAL
    }else if(option=="letters"){
        if(type=="Patient Letter")
            assistant_id=process.env.ASSISTANT_ID_PATIENT
        else if(type=="Dentist Letter")
            assistant_id=process.env.ASSISTANT_ID_DENTIST
        else assistant_id=process.env.ASSISTANT_ID_GENERAL
    }else{
        assistant_id=process.env.ASSISTANT_ID_GENERAL
    }
    
    // const assistant_id=process.env.ASSISTANT_ID_GENERAL
    const threadResponse = await openai.beta.threads.create();
    const threadId = threadResponse.id;
    try {
    // if(option=="notes"){
    //     if(type=='Examination Note'){
    //         parts=examination
    //     }else if(type=='Treatment Note'){
    //         parts=treament
    //     }else{
    //         parts=review
    //     }
    // }else if(option=="letters"){
    //     if(type=='Patient Letter'){
    //         parts=patient
    //     }else {
    //         parts=dentist
    //     }
    // }else{
        
        // console.log(threadId)
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
    // console.log(run.status)
    
    const messagesResponse = await openai.beta.threads.messages.list(threadId);
    // console.log(messagesResponse)
    const assistantResponses = messagesResponse.data.filter(msg => msg.role === 'assistant');
    response.openai = assistantResponses.map(msg => 
      msg.content
        .filter(contentItem => contentItem.type === 'text')
        .map(textContent => textContent.text.value)
        .join('\n')
    ).join('\n');
    // }
    // if(option!='general'){
        // console.log(parts)
        // console.log(type)
    // parts.push({text:`input: Write a ${type} on ${prompt} `})
    // parts.push({text: prompt})
    //         const result = await model.generateContent({
    //         contents: [{ role: "user", parts}],
    //             generationConfig,
    //             safetySettings,
    //             });
    //         const res = result.response;
    //         response.openai=res.text()}
    // console.log(response.openai)
    if(response?.openai){
        response.db = await chat.newResponse(prompt, response, userId,threadId,option,type)
    }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response.openai) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    _id: response.db['chatId'],
                    content: response.openai
                }
            })
        }
    }
})

router.put('/', CheckUser, async (req, res) => {
    const { prompt, userId, chatId,option ,type} = req.body
    console.log(type)
    console.log(option)
    console.log(prompt)
    if(option=="notes"){
        if(type=="Examination Note")
            assistant_id=process.env.ASSISTANT_ID_EXAMINATION
        else if(type=="Treatment Note")
            assistant_id=process.env.ASSISTANT_ID_TREATMENT
        else if(type=="Review Note")
            assistant_id=process.env.ASSISTANT_ID_REVIEW
        else assistant_id=process.env.ASSISTANT_ID_GENERAL
    }else if(option=="letters"){
        if(type=="Patient Letter")
            assistant_id=process.env.ASSISTANT_ID_PATIENT
        else if(type=="Dentist Letter")
            assistant_id=process.env.ASSISTANT_ID_DENTIST
        else assistant_id=process.env.ASSISTANT_ID_GENERAL
    }else{
        assistant_id=process.env.ASSISTANT_ID_GENERAL
    }
    // const assistant_id=process.env.ASSISTANT_ID_GENERAL
    const threadId = await chat.getThread(userId,chatId)
    let response = {}
    let parts=[]
    // console.log(option)
    // console.log(type)
    try {
    // if(option=="notes"){
    //     if(type=='Examination Note'){
    //         parts=examination
    //     }else if(type=='Treatment Note'){
    //         parts=treament
    //     }else{
    //         parts=review
    //     }
    // }else if(option=="letters"){
    //     if(type=='Patient Letter'){
    //         parts=patient
    //     }else {
    //         parts=dentist
    //     }
    // }else{
        
        
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
    // }
    
    // if(option!='general'){
    //     parts.push({text:`input: Write a ${type} on ${prompt} `})
    // // parts.push({text:prompt})
    // const result = await model.generateContent({
    // contents: [{ role: "user", parts}],
    //     generationConfig,
    //     safetySettings,
    //     });
    // const res = result.response;
    // response.openai=res.text()
    // }
    // console.log(response.openai)
        if(response.openai){
            response.db = await chat.updateChat(chatId, prompt, response, userId,threadId,option,type)
        }
    } catch (err) {
        console.log("error",err)
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response?.openai) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    content: response.openai
                }
            })
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