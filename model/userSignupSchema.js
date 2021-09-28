const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose") // using passport
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const studentSignupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll_no: {
        type: String,
        required: true
    },
    branch: {
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
    },
    book_issued : []
});

//collection creation

studentSignupSchema.plugin(passportLocalMongoose)

const Student = mongoose.model("STUDENT", studentSignupSchema);
module.exports = Student;