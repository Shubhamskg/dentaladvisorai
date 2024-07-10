import { Router } from "express";
import dotnet from 'dotenv'
import session from '../helpers/session.js'


dotnet.config()

let router = Router()

// router.get('/', (req, res) => {
//     res.send("Welcome to Session data stotrage api v1")
// })

router.get('/', async (req, res) => {
    let sessionIds=null
    let all_data=[]
    try {
        sessionIds = await session.getAllsessionId()
        for(let i=0;i<sessionIds.length;i++){
            let single_data={}
            let flag=true
            await session.getAllTranscript(sessionIds[i].sessionId).then(
                function(value){
                    let z=""+value[0]?.data
                    if(z.length<=1000){
                        flag=false
                    }
                    // single_data.transcript=z
                    
                }
                ) 
                if(flag==false) continue
        //         await session.getAllNotes(sessionIds[i].sessionId).then(
        //             function(value){
        //                 let z=""+value[0]?.data
        //                 // if(z.includes('Personal')){
        //                 single_data.notes=z
        //                 // }
        //             }
        //             ) 
        //             await session.getAllLetter(sessionIds[i].sessionId).then(
        //                 function(value){
        //                     let z=""+value[0]?.data
        //                     // if(z.includes('Personal')){
        //                     single_data.letter=z
        //                     // }
        //                 }
        //                 ) 
        //                 await session.getAllSentiment(sessionIds[i].sessionId).then(
        //                     function(value){
        //                         let z=""+value[0]?.data
        //                         // if(z.includes('Personal')){
        //                         single_data.sentiment=z
        //                         // }
        //                     }
        //                     ) 
        await session.getAllssdata(sessionIds[i].sessionId).then(
        function(value){
            let z=""+value[0]?.data
            if(z.includes('```json')){
            single_data.ssdata=z
            }
        }
        ) 
        await session.getAllInfo(sessionIds[i].sessionId).then(
            function(value){
                let z=""+value[0]?.data
                if(z.includes('Personal')){
                single_data.info=z
                }
            }
            ) 
            all_data.push(single_data)
    }
    } catch (err) {
        console.log("er",err)
        res.status(500).json({
            status: 500,
            message: err,
            data:sessionIds
        })
    } finally {
        if (sessionIds) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data:all_data
            })
            // res.send(all_data)
        }
    }
})

export default router