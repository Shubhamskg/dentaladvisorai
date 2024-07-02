import { Router } from "express";
import dotnet from 'dotenv'
import session from '../helpers/session.js'


dotnet.config()

let router = Router()

// router.get('/', (req, res) => {
//     res.send("Welcome to Session data stotrage api v1")
// })

router.get('/', async (req, res) => {
    let response=null
    let res2
    let res3
    let data=[]
    let info=[]
    try {
        response = await session.getAllsessionId()
        for(let i=0;i<response.length;i++){
        res2=await session.getAllssdata(response[i].sessionId).then(
        function(value){
            let z=""+value[0]?.data
            if(z.includes('```json')){
            // console.log("v",z)
            data.push(z);
            }
        }
        ) 
        res3=await session.getAllInfo(response[i].sessionId).then(
            function(value){
                let z=""+value[0]?.data
                if(z.includes('Personal')){
                console.log("v",z)
                info.push(z)
                }
            }
            ) 
    }
    } catch (err) {
        console.log("er",err)
        res.status(500).json({
            status: 500,
            message: err,
            data:response
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data:data
            })
        }
    }
})

export default router