// const dotenv = require("dotenv");
// dotenv.config({path:"./config.env"});

// require("dotenv").config()

const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption")

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

});

// adminSchema.plugin(encrypt, {secret : process.env.SECRET_KEY, encryptedFields : ["password"]})

const Admin = mongoose.model("ADMIN", adminSchema)
module.exports = Admin