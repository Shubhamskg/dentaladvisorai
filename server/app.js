import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotnet from 'dotenv'
import { connectDB, connectDB2 } from './db/connection.js'
import ChatRoute from './routes/chat.js';
import UserRoute from './routes/user.js';
import VisionRoute from './routes/vision.js';
import DashboardRoute from './routes/dashboard.js'
import PaymentRoute from './routes/stripe.js'
import AudioRoute from './routes/audio.js'
import Feedback from './routes/feedback.js'
import Handle_Feedback from './routes/handle_feedback.js'
import ImageRoute from './routes/image.js'
import Sessiondata from './routes/session_data.js'
import path from 'path'
import status from 'express-status-monitor'



dotnet.config()

let app = express()
let port = process.env.PORT||5000

// for production copy paste react js product build files in dist folder
app.use(status())
// app.use(express.static('dist'))

let origin=process.env.CLIENT_URL||"http://localhost:5173"
app.use(cors({  origin: origin,
methods: ['GET','HEAD','PATCH', 'POST', 'PUT', 'DELETE'],
// preflightContinue: false,
// optionsSuccessStatus: 204,
allowedHeaders: ['Content-Type', 'Authorization'], 
credentials: true}))
// app.use(cors())
app.use(cookieParser())
// app.use(express.json())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:false}));
app.use("/api/image", express.static("api/image"));
// api route
app.use('/api/chat/', ChatRoute)
app.use('/api/user/', UserRoute)
app.use('/api/vision/', VisionRoute)
app.use('/api/upload-image/',ImageRoute)
app.use('/api/dashboard/',DashboardRoute)
app.use('/api/',PaymentRoute)
app.use('/api/audio/',AudioRoute)
app.use('/api/session/',Sessiondata)
app.use('/',Feedback)
app.use('/api/handle_feedback/',Handle_Feedback)

// front end react route
// app.get('/*',(req,res)=>{
//     res.sendFile(path.join(`${path.resolve(path.dirname(''))}/dist/index.html`))
// })
app.get("/",(req,res)=>{
    return res.send("hello buddy")
})


connectDB((err) => {
    if (err) return console.log("MongoDB Connect Failed : ", err)

    console.log("MongoDB Connected")

    
})
connectDB2((err) => {
    if (err) return console.log("MongoDB Connect Failed2 : ", err)

    console.log("MongoDB Connected2")

    
})
app.listen(port, () => {
    console.log("server started at ",port)
})

