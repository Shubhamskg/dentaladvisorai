import { Router } from "express";
import dotnet from 'dotenv'
import feedback from '../helpers/feedback.js'
import url  from 'url'
import path from "path";
let router = Router()
router.post('/submit', async (req, res) => {
    // var pathname = url.parse(request.url).pathname;
    const feedback_data = req
    console.log("feedback",feedback_data)
    let response={}
    try {
        response.db = await feedback.newResponse(feedback_data)
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

export default router