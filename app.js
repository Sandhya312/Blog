require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_URI);



const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// schema
const postSchema =mongoose.Schema({
    title:String,
    content:String
})

// model
const Post = mongoose.model("post",postSchema);


app.get("/",(req,res)=>{

Post.find()
.then((posts)=>{
     res.render("home",{posts:posts})
    })
})

app.get("/compose",(req,res)=>{
    res.render("compose")
})

app.get("/posts/:PostId",(req,res)=>{
    const requestedPostId =req.params.PostId;
Post.findOne({_id: requestedPostId})
.then((postt)=>{
   res.render("post",{postTitle:postt.title,postContent:postt.content})
}).catch((err)=>{
    console.log(err);
})
    
})

app.post("/compose",(req,res)=>{
    if(req.body.postTitle==="" || req.body.postBody===""){
       
        res.redirect("/compose");
    }else{

        // document
        const post = new Post ({
            title:req.body.postTitle,
            content: req.body.postBody
        })

       
    
    post.save().then(()=>{
        res.redirect("/");
    }).catch((err)=>{
        console.log(err);
    })
    }
  
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
  });