const express =require("express");
const multer=require("multer")
const path=require("path")
const sharp=require("sharp")
const app=express();
var fs = require('fs');


//uplod file path
const uploadPath=path.join(__dirname,"uploads")


//modify storage object
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log("HERE")
        cb(null,uploadPath)
    },
    filename:function(req,file,cb){
        cb(null,"main"+file.originalname)
    }
})

//setup upload
const upload=multer({storage:storage})


app.post("/upload",upload.single("profileImage"),async(req,res,next)=>{
        let compressedImageFileSavePath=path.join(__dirname,"uploads",new Date().getTime()+"")
       
        //convert single image to webp formate
        sharp(req.file.path)
       .webp({ quality: 20 })
        .toFile(compressedImageFileSavePath+'wep.webp');

        //convert single image to jpg formate
        sharp(req.file.path)
            .normalize()
            .jpeg({
                quality:80,
                chromaSubsampling:"4:4:4"
            }).toFile(compressedImageFileSavePath+"jpg.jpg",(err,info)=>{
                if(err){
                    res.json({
                        error:err
                    })
                }
                res.json({
                    message:"File UPloaded"
                })
            })


})

app.post("/multiple-upload",upload.array("postImages",10),async(req,res,next)=>{
    let compressedImageFileSavePath=path.join(__dirname,"uploads",new Date().getTime()+"")
       
  
     let done=0;
    await req.files?.map(async (file,index)=>{
        await sharp(file.path)
         .webp({ quality: 20 })
         .toFile(compressedImageFileSavePath+index+'wep.webp',(err,info)=>{
             if(err){
                res.json({
                    error:err
                })
             }else{
                 const dirName=path.join(__dirname,"uploads",file.filename)
                 fs.unlinkSync(dirName)
                done+=1;
                     if(done===req.files.length){
                        res.json({
                             message:"Hello"
                           })
                     }
             }
            
         })

     })
    
})




app.get("/",(req,res)=>{
    res.json({
        message:"Working"
    })
})

const PORT=4000;
app.listen(PORT,()=>{
    console.log(`Server Is Running On PORT ${PORT}`)
})