import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import bcrypt from 'bcrypt'
import { ObjectId } from "mongodb";

export default {
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.USER).aggregate([
                {
                    $unwind: '$email'
                },
                {
                    $project: {
                        _id: 0,
                        userId: '$_id',
                        email:'$email',
                        fName:'$fName',
                        lName:'$lName'
                    }
                }
                , {
                    $sort: {
                        chatId: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })
            if (Array.isArray(res)) {
                resolve(res)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
    getAllChats: (userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                },
                {
                    $project: {
                        _id: 0,
                        chatId: '$data.chatId',
                        createdAt:'$data.chats.createdAt',
                        prompt: '$data.chats.prompt', 
                        content: '$data.chats.content'
                    }
                }, 
                {
                    $limit: 50
                }, {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })
            if (Array.isArray(res)) {
                resolve(res)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
    getAllVisions: (userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.VISION).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                },
                {
                    $project: {
                        _id: 0,
                        chatId: '$data.visionId',
                        option:'$data.chats.option',
                        prompt: '$data.chats.prompt',
                        imageUrl:'$data.chats.imageURL',
                        content:'$data.chats.content',
                    }
                }, {
                    $limit: 50
                }, {
                    $sort: {
                        chatId: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })
            if (Array.isArray(res)) {
                resolve(res)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
}