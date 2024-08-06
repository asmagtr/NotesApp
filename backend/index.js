require("dotenv").config();

const config = require("./config.json")
const mongoose = require("mongoose");

const User=require("./models/user.model");
const Note = require("./models/note.model");






const express = require("express");
const cors = require("cors");
const app=express();

const jwt = require("jsonwebtoken");
const {authentificateToken} = require("./utilities.js");

app.use(express.json());
app.use(
    cors({
        origin:"*",
    })
);

  

app.get("/",(req,res,)=>{
    res.json({data:"hello"});
});


//Create Accout
app.post("/create-account",async(req,res)=>{

    const{fullName,email,password}=req.body;

    if(!fullName){
        return res
        .status(400)
        .json({error:true,message:"Full Name is required"});
    }

    if (!email){
        return res
        .status(400)
        .json({error:true,message:"emailis required"});

    }

    if (!password){
        return res
        .status(400)
        .json({error:true,message:"password is required"});

    }

    const isUser=await User.findOne({email:email});
    if (isUser){
        return res
        .status(400)
        .json({error:true,message:"User already exists"});
    }

    const user=new User({
        fullName,
        email,
        password,
    });
    await user.save();

    const accessToken = jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{expiresIn : "36000m"});

    return res.json({
        error:false,
        user,
        accessToken,
        message:"Registration Successful"
    });
});

//Login
app.post("/login",async(req,res)=>{

    const {email,password}=req.body;
    if(!email){
        return res.status(400).json({message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({message:"Password is required"});
    }

   // const userInfo= await User.findOne({email:email});

   const userInfo =await User.findOne({email:email});


   
      
   
    if(!userInfo){
        return res.status(400).json({message:"User not found"});
    }

    if(userInfo.email==email && userInfo.password==password){
        const user ={user:userInfo};
        const accessToken=jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"36000m",

        });

        console.log("###### token in api "+accessToken)
        return res.json({
            error:false,
            message:"Login Successful",
            email,
            accessToken,
        });

    }else{
        return res.status(400).json({
            error:true,
            message:"Invalid Credentials",
        });
    }

});


//Add Note

app.post("/add-note",authentificateToken,async(req,res)=>{

    const {title,content,tags} = req.body;
    const {user}=req.user;
   
    if(!title){
        return res.status(400).json({error:true,message:"Title is required."})
    }
    if(!content){
        return res.status(400).json({error:true,message:"Content is required."})
    }

    try{const note=new Note({
        title,
        content,
        tags: tags || [],
        userId: user._id,
    });
    await note.save();
    return res.json({
        error:false,
        note,
        message:"Note added successfully",
    });
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        });
    }
});


//Edit Note

// app.put("/edit-note/:noteId",authentificateToken,async(req,res)=>{
//     const noteId=req.params.noteId;
//     const {title,content,tags,isPinned}=req.body;
//     const{user}=req.user;

//     if(!title && !content && !tags){
//         return res.status(400).json({
//             error:true,
//             message:"no changes provided"
//         });
//     }

//     try{
//         console.log("hello1");
//         const note= await Note.findOne({
//             _id:noteId,
//             userId:user._id
//         });
//         console.log(noteId);

//         if(!note){
//             return res.status(400).json({
//                 error:true,
//                 message:"Note not found"
//             });
//         }

//         if (title) note.title=title;
//         if(content) note.content=content;
//         if (tags) note.tags=tags;
//         if (isPinned) note.isPinned= isPinned;
//         console.log(note);

//         await note.save();

//         console.log("after savinf"+note);
//         return res.json({
//             error:false,
//             note,
//             message:"Note updated successfully",

//         });

//     }catch(error){
//         return res.status(500).json({
//             error:true,
//             message:"Internal Server Error"
//         });
        
//     }

// });


app.put("/edit-note/:noteId", authentificateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags && typeof isPinned === 'undefined') {
        return res.status(400).json({
            error: true,
            message: "No changes provided"
        });
    }

    try {
        const note = await Note.findOne({
            _id: noteId,
            userId: user._id
        });

        if (!note) {
            return res.status(400).json({
                error: true,
                message: "Note not found"
            });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        // if (typeof isPinned !== 'undefined') note.isPinned = isPinned;
        if (isPinned) note.isPinned= isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

//Get All notes
app.get("/get-all-notes/",authentificateToken,async(req,res)=>{
    const {user}=req.user;

    try{
        const notes = await Note.find({ userId:user._id}).sort({isPinned : -1});
        console.log(notes);

        return res.json({
            error:false,
            notes,
            message:"All notes retrieved successfully",
        })

    }catch(error) {
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"
        })
    }
});

//Delete Note
app.delete("/delete-note/:noteId",authentificateToken,async(req,res)=>{
    const noteId=req.params.noteId;
    const {user}=req.user

    try{
        const note=await Note.find({ _id:noteId,userId:user._id});

        if(!note){
            return res.status(404).json({
                error:true,
                message:"Not not found",
            });
        }

        await Note.deleteOne({
            _id:noteId,
            userId:user._id
        });

        return res.json({
            error:false,
            message:"Note deleted successfully"
        });
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        });
    }
});

//Update isPinned Note
app.put("/update-note-pinned/:noteId",authentificateToken,async(req,res)=>{
    
    const noteId = req.params.noteId;
    const {isPinned } = req.body;
    const { user } = req.user;
    console.log(req);


    try {
        const note = await Note.findOne({
            _id: noteId,
            userId: user._id
        });

        if (!note) {
            return res.status(400).json({
                error: true,
                message: "Note not found"
            });
        }

      
        if (typeof isPinned !== 'undefined') note.isPinned = isPinned;
        // if (isPinned) note.isPinned= isPinned || false;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});


//Get User
app.get("/get-user",authentificateToken, async(req,res)=>{
    console.log(req); 

    const {user}=req.user;
    const isUser= await User.findOne({_id:user._id});

    if(!isUser){
        return res.status(401).json({
            error:true,
            message:("no user"),
        });
    }

    return res.json({error:false,
        user:{fullName:isUser.fullName
            ,email:isUser.email,
             "_id":isUser._id,
             createdOn:isUser.createdOn},
        message:"",

    });


});



app.listen(8000);

module.exports=app;





