import { db2 } from "../db/connection.js";
import collections from "../db/collections.js";
import bcrypt from 'bcrypt'
import { ObjectId } from "mongodb";

export default {
    getAllsessionId: () => {
        return new Promise(async (resolve, reject) => {
            let res = await db2.collection(collections.TRANSCRIPT).aggregate([
                {
                    $unwind: '$sessionId'
                },
                {
                    $project: {
                        _id: 0,
                        sessionId:'$sessionId',
                    }
                }
                , {
                    $sort: {
                        insertTime: -1
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
    getAllTranscript: (sessionId) => {
        return new Promise(async (resolve, reject) => {
            let transcript_data = await db2.collection(collections.TRANSCRIPT).aggregate([
                {
                    $match: {
                        sessionId:sessionId
                    }
                },
                {
                    $unwind: '$sessionId'
                },
                {
                    $project: {
                        _id: 0,
                        data:'$data',
                        insertTime:'$insertTime'
                    }
                }
                , {
                    $sort: {
                        insertTime: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })
            if (Array.isArray(transcript_data)) {
                resolve(transcript_data)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
    getAllssdata: (sessionId) => {
        return new Promise(async (resolve, reject) => {
            let transcript_data = await db2.collection(collections.SSDATA).aggregate([
                {
                    $match: {
                        sessionId:sessionId
                    }
                },
                {
                    $unwind: '$sessionId'
                },
                {
                    $project: {
                        _id: 0,
                        data:'$data',
                        insertTime:'$insertTime'
                    }
                }
                , {
                    $sort: {
                        insertTime: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })
            if (Array.isArray(transcript_data)) {
                resolve(transcript_data)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
    getAllNotes: (sessionId) => {
        return new Promise(async (resolve, reject) => {
            let transcript_data = await db2.collection(collections.NOTES).aggregate([
                {
                    $match: {
                        sessionId:sessionId
                    }
                },
                {
                    $unwind: '$sessionId'
                },
                {
                    $project: {
                        _id: 0,
                        data:'$data',
                        insertTime:'$insertTime'
                    }
                }
                , {
                    $sort: {
                        insertTime: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })
            if (Array.isArray(transcript_data)) {
                resolve(transcript_data)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
    getAllLetter: (sessionId) => {
        return new Promise(async (resolve, reject) => {
            let transcript_data = await db2.collection(collections.LETTER).aggregate([
                {
                    $match: {
                        sessionId:sessionId
                    }
                },
                {
                    $unwind: '$sessionId'
                },
                {
                    $project: {
                        _id: 0,
                        data:'$data',
                        insertTime:'$insertTime'
                    }
                }
                , {
                    $sort: {
                        insertTime: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })
            if (Array.isArray(transcript_data)) {
                resolve(transcript_data)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
    getAllSentiment: (sessionId) => {
        return new Promise(async (resolve, reject) => {
            let transcript_data = await db2.collection(collections.SENTIMENT).aggregate([
                {
                    $match: {
                        sessionId:sessionId
                    }
                },
                {
                    $unwind: '$sessionId'
                },
                {
                    $project: {
                        _id: 0,
                        data:'$data',
                        insertTime:'$insertTime'
                    }
                }
                , {
                    $sort: {
                        insertTime: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })
            if (Array.isArray(transcript_data)) {
                resolve(transcript_data)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
    getAllInfo: (sessionId) => {
        return new Promise(async (resolve, reject) => {
            let transcript_data = await db2.collection(collections.INFO).aggregate([
                {
                    $match: {
                        sessionId:sessionId
                    }
                },
                {
                    $unwind: '$sessionId'
                },
                {
                    $project: {
                        _id: 0,
                        data:'$data',
                        insertTime:'$insertTime'
                    }
                }
                , {
                    $sort: {
                        insertTime: -1
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })
            if (Array.isArray(transcript_data)) {
                resolve(transcript_data)
            } else {
                reject({ text: "DB Getting Some Error" })
            }
        })
    },
}