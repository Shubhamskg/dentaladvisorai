import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId } from "mongodb";


export default {
    newResponse: (prompt, { openai }, userId,threadId,option,type) => {
        return new Promise(async (resolve, reject) => {
            let chatId = new ObjectId().toHexString()
            let res = null
            try {
                await db.collection(collections.CHAT).createIndex({ user: 1 }, { unique: true })
                res = await db.collection(collections.CHAT).insertOne({
                    user: userId.toString(),
                    data: [{
                        chatId,
                        chats: [{
                            createdAt: new Date(),
                            prompt,
                            content: openai,
                            option:option,
                            type:type
                        }],
                        threadId,
                        lastUpdate:new Date()
                    }]
                })
            } catch (err) {
                if (err?.code === 11000) {
                    res = await db.collection(collections.CHAT).updateOne({
                        user: userId.toString(),
                    }, {
                        $push: {
                            data: {
                                chatId,
                                chats: [{
                                    createdAt: new Date(),
                                    prompt,
                                    content: openai,
                                    option:option,
                                    type:type
                                }],
                                threadId,
                                lastUpdate:new Date()
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
                    res.chatId = chatId
                    resolve(res)
                } else {
                    reject({ text: "DB gets something wrong" })
                }
            }
        })
    },
    updateChat: (chatId, prompt, { openai }, userId,threadId,option,type) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).updateOne({
                user: userId.toString(),
                'data.chatId': chatId
            }, {
                $push: {
                    'data.$.chats': {
                        createdAt: new Date(),
                        prompt,
                        content: openai,
                        option:option,
                        type:type
                    },
                    // 'data.lastUpdate':new Date()
                },
            }).catch((err) => {
                reject(err)
            })

            if (res) {
                resolve(res)
            } else {
                reject({ text: "DB gets something wrong" })
            }
        })
    },
    getChat: (userId, chatId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $match: {
                        'data.chatId': chatId
                    }
                }, {
                    $project: {
                        _id: 0,
                        chat: '$data.chats'
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
    },
    getThread: (userId, chatId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $match: {
                        'data.chatId': chatId
                    }
                }, {
                    $project: {
                        _id: 0,
                        chat: '$data.threadId'
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
    },
    getHistory: (userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $project: {
                        _id: 0,
                        chatId: '$data.chatId',
                        prompt: {
                            $arrayElemAt: ['$data.chats.prompt', 0]
                        },
                        lastUpdate:'$data.lastUpdate'
                    }
                }, {
                    $limit: 50
                }, {
                    $sort: {
                        lastUpdate: -1
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
    deleteAllChat: (userId) => {
        return new Promise((resolve, reject) => {
            db.collection(collections.CHAT).deleteOne({
                user: userId.toString()
            }).then((res) => {
                if (res?.deletedCount > 0) {
                    resolve(res)
                } else {
                    reject({ text: 'DB Getting Some Error' })
                }
            }).catch((err) => {
                reject(err)
            })
        })
    },
    deleteChat: (userId,chatId) => {
        return new Promise((resolve, reject) => {
            db.collection(collections.CHAT).findOne({ user: userId.toString() })
            .then((userDoc) => {
              if (!userDoc) {
                return reject({ text: 'User not found' });
              }
              const chatIndex = userDoc.data.findIndex(chat => chat.chatId === chatId);
              if (chatIndex === -1) {
                return reject({ text: 'Chat not found for this user' });
              }
              userDoc.data.splice(chatIndex, 1);
              return db.collection(collections.CHAT).updateOne({ _id: userDoc._id }, { $set: { data: userDoc.data } });
            }
                ).then((res) => {
                    if (res?.modifiedCount > 0) {
                      resolve(res);
                    } else {
                      reject({ text: 'Chat could not be deleted' });
                    }
                  })
                  .catch((err) => {
                    reject(err);
                  });
        })
    }
}