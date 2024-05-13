import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId } from "mongodb";


export default {
    newPayment: (sessionId,userId,currency,created,payment_status,customer_email,status) => {
        return new Promise(async (resolve, reject) => {
            let paymentId = new ObjectId().toHexString()
            let res = null
            res = await db.collection(collections.USER).updateOne({
                _id: new ObjectId(userId)
            }, {
                subscribe:true
            })
            try {
                await db.collection(collections.PAYMENT).createIndex({ user: 1 }, { unique: true })
                res = await db.collection(collections.PAYMENT).insertOne({
                    user: userId.toString(),
                    data: [{
                        sessionId,
                        currency,
                        created,
                        payment_status,customer_email,
                        status
                    }]
                })
            } catch (err) {
                if (err?.code === 11000) {
                    res = await db.collection(collections.PAYMENT).updateOne({
                        user: userId.toString(),
                    }, {
                        $push: {
                            data: {
                                sessionId,
                                currency,
                                created,
                                payment_status,customer_email,
                                status
                            }
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    reject(err)
                }
            } finally {
                if (res) {
                    res.sessionId = sessionId
                    resolve(res)
                } else {
                    reject({ text: "DB gets something wrong" })
                }
            }
        })
    },
    
    getPaymentDetail: (userId,sessionId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.PAYMENT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $match: {
                        'data.sessionId': sessionId
                    }
                }, {
                    $project: {
                        _id: 0,
                        payment: '$data'
                    }
                }
            ]).toArray().catch((err) => [
                reject(err)
            ])

            if (res && Array.isArray(res) && res[0]?.chat) {
                resolve(res[0].chat)
            } else {
                reject({ status: 404 })
            }
        })
    }
}