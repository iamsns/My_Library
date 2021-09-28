const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const app = express();

require("./db/conn");
app.use(express.json());
var router = require('./router/auth');
app.use(router);
dotenv.config({path:"./config.env"});

const DB = process.env.DATABASE;
const PORT = process.env.PORT || 5700;
const Student = require("./model/userSignupSchema");
const path = require('path');


//middleware

const middleware = (req,res,next) =>{
    console.log("this is middleware");
    next();
}
// app.get("/",(req,res) =>{
//     res.send("hi! this is my server");
// });

app.get("/signin",(req,res) =>{
    res.send("hi! this is signin on my server");
});

if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join("client/build")));
    app.get("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

app.listen(PORT, () =>{
    console.log(`my server is running on port ${PORT}`);
});
