const mongoose = require("mongoose");

// const dotenv = require("dotenv");
// dotenv.config({path:"./config.env"});

// const db = process.env.DATABASE;
const db = "mongodb+srv://iamsns:Iamsns355%40@cluster0.5ihkf.mongodb.net/mylibraryDB?retryWrites=true&w=majority"

mongoose.connect(db, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(() =>{
    console.log("databse connection successfully");
}).catch((err) =>{console.log(err);});
