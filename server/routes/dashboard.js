import { Router } from "express";
import dotnet from 'dotenv'
import dashboard from '../helpers/dashboard.js'
import jwt from 'jsonwebtoken'
import chat from "../helpers/chat.js";
import OpenAI from 'openai';

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



router.get('/', async(req, res) => {
    let response = null
    try {
        response = await dashboard.getAllUsers()
    } catch (err) {
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
                data:response
            })
        }
    }
})


router.get('/chat', async (req, res) => {
    const {id}  = req.query
    let response = null
    try {
        response = await dashboard.getAllChats(id)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err,
            data: response
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
router.get('/vision', async (req, res) => {
    const { id } = req.query
    let response = null

    try {
        response = await dashboard.getAllVisions(id)
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


export default router