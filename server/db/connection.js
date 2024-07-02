import { MongoClient } from "mongodb";

let db = null

const connectDB = async (done) => {
    try {
        var data = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true })
        db = data.db('llm')
        done()
    } catch (err) {
        done(err)
    }
}
let db2 = null

const connectDB2 = async (done) => {
    try {
        var data = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true })
        db2 = data.db('dental-advisor-audio-session')
        done()
    } catch (err) {
        done(err)
    }
}

export { connectDB, db, connectDB2, db2 }