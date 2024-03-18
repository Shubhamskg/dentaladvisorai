import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotnet from 'dotenv'
import { connectDB } from './db/connection.js'
import ChatRoute from './routes/chat.js';
import UserRoute from './routes/user.js';
import VisionRoute from './routes/vision.js';
import DashboardRoute from './routes/dashboard.js'
import ImageRoute from './routes/image.js'
import path from 'path'
import status from 'express-status-monitor'

dotnet.config()

let app = express()
let port = process.env.PORT||5000

// for production copy paste react js product build files in dist folder
app.use(status())
app.use(express.static('dist'))


app.use(cors({  origin: '*',
methods: ['GET','HEAD','PATCH', 'POST', 'PUT', 'DELETE'],
preflightContinue: false,
optionsSuccessStatus: 204,
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

// front end react route
app.get('/*',(req,res)=>{
    res.sendFile(path.join(`${path.resolve(path.dirname(''))}/dist/index.html`))
})
app.get("/",(req,res)=>{
    return res.send("hello buddy")
})


connectDB((err) => {
    if (err) return console.log("MongoDB Connect Failed : ", err)

    console.log("MongoDB Connected")

    
})
app.listen(port, () => {
    console.log("server started at ",port)
})

