const mongoose = require("mongoose")

const issuedBooksSchema = mongoose.Schema({
    book_name : String,
    author_name : String,
    book_id : Number,
    student_name : String,
    student_roll : String
})

const IssuedBookModel = mongoose.model("ISSUEDBOOK", issuedBooksSchema)

module.exports = IssuedBookModel