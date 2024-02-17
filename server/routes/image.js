import multer from 'multer'
import path from 'path'
import { Router } from "express";
let router = Router()

export let imageName = "";
const storage = multer.diskStorage({
  destination: path.join("./api/image"),
  filename: function (req, file, cb) {
    imageName = Date.now() + path.extname(file.originalname);
    cb(null, imageName);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 300000000 },
}).single("myImage");

router.post("/", (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(201)
        .json({ url: "/api/image/" + imageName });
      }
    });
  });
router.get("/",(req,res)=>{
  res.send("hello")
})
  export default router
  
