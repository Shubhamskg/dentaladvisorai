import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId, Timestamp } from "mongodb";


export default {
    newResponse: (feedback) => {
        return new Promise(async (resolve, reject) => {
            let fb_id = new ObjectId().toHexString()
            let res = null
            try {
                res = await db.collection(collections.HANDLE_FEEDBACK).insertOne({
                    fb_id: fb_id.toString(),
                    // sessionId:sessionId,
                    feedback,
                    // u_email,
                    // p_email,
                    insertTime:new Date(),
                    Timestamp
                })
            } catch (err) {
                if (err?.code === 11000) {
                    res = await db.collection(collections.HANDLE_FEEDBACK).updateOne({
                        fb_id: fb_id.toString(),
                    }, {
                        $push: {
                            sessionId,sessionId,
                            data: fdata
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    reject(err)
                }
            } finally {
                if (res) {
                    res.fb_id = fb_id
                    resolve(res)
                } else {
                    reject({ text: "DB gets something wrong" })
                }
            }
        })
    },
}