import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId } from "mongodb";

export default {
    newResponse: (option,prompt, imageURL, { gemini }, userId) => {
        return new Promise(async (resolve, reject) => {
            let visionId = new ObjectId().toHexString()
            let res = null
            try {
                await db.collection(collections.VISION).createIndex({ user: 1 }, { unique: true })
                res = await db.collection(collections.VISION).insertOne({
                    user: userId.toString(),
                    data: [{
                        visionId,
                        chats: [{
                            option,
                            prompt,
                            imageURL,
                            content: gemini
                        }]
                    }]
                })
            } catch (err) {
                if (err?.code === 11000) {
                    res = await db.collection(collections.VISION).updateOne({
                        user: userId.toString(),
                    }, {
                        $push: {
                            data: {
                                visionId,
                                chats: [{
                                    option,
                                    prompt,
                                    imageURL,
                                    content: gemini
                                }]
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
                    res.visionId = visionId
                    resolve(res)
                } else {
                    reject({ text: "DB gets something wrong" })
                }
            }
        })
    },
    updateChat: (option,visionId, prompt, imageURL,{ gemini }, userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.VISION).updateOne({
                user: userId.toString(),
                'data.visionId': visionId
            }, {
                $push: {
                    'data.$.chats': {
                        option,
                        prompt,
                        imageURL,
                        content: gemini
                    }
                }
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
    getChat: (userId, visionId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.VISION).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $match: {
                        'data.visionId': visionId
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
    getHistory: (userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.VISION).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $project: {
                        _id: 0,
                        visionId: '$data.visionId',
                        prompt: {
                            $arrayElemAt: ['$data.chats.prompt', 0]
                        }
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
    deleteAllChat: (userId) => {
        return new Promise((resolve, reject) => {
            db.collection(collections.VISION).deleteOne({
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
    deleteChat: (userId,visionId) => {
        return new Promise((resolve, reject) => {
            db.collection(collections.VISION).findOne({ user: userId.toString() })
            .then((userDoc) => {
              if (!userDoc) {
                return reject({ text: 'User not found' });
              }
              const chatIndex = userDoc.data.findIndex(chat => chat.visionId === visionId);
              if (chatIndex === -1) {
                return reject({ text: 'Chat not found for this user' });
              }
              userDoc.data.splice(chatIndex, 1);
              return db.collection(collections.VISION).updateOne({ _id: userDoc._id }, { $set: { data: userDoc.data } });
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