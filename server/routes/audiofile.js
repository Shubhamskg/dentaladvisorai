import multer from 'multer'
import path from 'path'
import { Router } from "express";
let router = Router()

export let audioName = "";
const storage = multer.diskStorage({
  destination: path.join("./api/audiofile"),
  filename: function (req, file, cb) {
    audioName = Date.now() + path.extname(file.originalname);
    cb(null, audioName);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 300000000 },
}).single("myAudio");

router.post("/", (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(201)
        .json({ url: "/api/image/" + audioName });
      }
    });
  });
router.get("/",(req,res)=>{
  res.send("hello")
})
  export default router
  
