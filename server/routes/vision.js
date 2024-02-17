import { Router } from "express";
import dotnet from 'dotenv'
import user from '../helpers/user.js'
import jwt from 'jsonwebtoken'
import vision from "../helpers/vision.js";
import fs from 'fs'
import { GoogleGenerativeAI } from "@google/generative-ai";
import {imageName} from "./image.js"
// import {img} from "../image/index.js"
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}
const input_prompt = `
Input:

Provide a single, high-resolution (minimum 1000x1000 pixels) bitewing radiograph in JPEG or PNG format. Indicate any specific landmarks within the image (e.g., cementoenamel junction, alveolar crest) if available.

Model information:

Specify the dental disease identification model being used, including its training data and known limitations.

Teeth identification:

Use the British Dental numbering system for all teeth, including "X" for missing teeth and indicating partial teeth with appropriate notation (e.g., 13 (half)).
Clarify how the model handles overlapping teeth or unclear landmarks.
Disease identification:

Define the specific caries severity scoring system used (e.g., ICDAS, MOD system).
Specify the desired format for reporting bone loss (e.g., percentage, millimeters, horizontal/vertical components).
Indicate if the model can differentiate between different types of periapical pathology (e.g., periapical abscess, granuloma).
Output format:

Teeth present: 18, 17, 16, 15, 14, 13 (half), 12, 11, 21, 22, 23, 24, 25, 26, 27, 28 (or any combination with "X" for missing teeth)

Occlusal Caries (Location and Score):

16: D1 - ICDAS 2 (Confidence: High)
14: D2 - ICDAS 1 (Confidence: Medium)
Interproximal Caries (Location, Tooth, Surface, and Score):

46: Mesial, 16, E1 - ICDAS 3 (Confidence: Low)
13: Distal, 14, E2 - ICDAS 1 (Confidence: High)
Fillings (Tooth and Surface):

17: Occlusal
26: Distal
Bone loss (Teeth involved, amount and direction):

16-15: 2mm horizontal (Confidence: Medium)
Periapical pathology (Tooth and type, if applicable):

18: Periapical abscess (Confidence: High)
 `
router.post('/', CheckUser, async (req, res) => {
    const { option,prompt, userId ,image} = req.body
    const final_prompt="Radiosgraph type is "+option+ "and Additional info: "+prompt
    let response = {}
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const imageParts = [
        fileToGenerativePart(`./api/image/${imageName}`, "image/jpeg"),
        ];
  const result = await model.generateContent([input_prompt,final_prompt,imageParts]);
  const response_generated = await result.response;
  const text = response_generated.text();
  response.gemini=text;
  if(response?.gemini){
    response.db = await vision.newResponse(option,prompt,`./image/${imageName}`, response, userId)
  }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response?.gemini) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    _id: response.db['visionId'],
                    content: response.gemini
                }
            })
        }
    }
})

router.put('/', CheckUser, async (req, res) => {
    const { option,prompt,image, userId, visionId } = req.body

    let response = {}

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const imageParts = [
            fileToGenerativePart(`./api/image/${imageName}`, "image/jpeg"),
        ];
  const result = await model.generateContent([prompt, ...imageParts]);
  const response_generated = await result.response;
  const text = response_generated.text();
  response.gemini=text;
  if(response?.gemini){
    response.db = await vision.updateChat(option,visionId,prompt,`./image/${imageName}`, response, userId)
  }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response?.gemini) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    content: response.gemini
                }
            })
        }
    }
})

router.get('/saved', CheckUser, async (req, res) => {
    const { userId } = req.body
    const { visionId = null } = req.query

    let response = null

    try {
        response = await vision.getChat(userId, visionId)
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
        response = await vision.getHistory(userId)
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
        response = await vision.deleteAllChat(userId)
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
router.delete('/:visionId', CheckUser, async (req, res) => {
    const { userId } = req.body
    const {visionId}=req.params
    let response = null

    try {
        response = await vision.deleteChat(userId,visionId)
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