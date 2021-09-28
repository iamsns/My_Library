const mongoose = require("mongoose")

const addBookSchema = mongoose.Schema({
    bookName : String,
    authorName : String,
    bookId : Number,
    quantity : Number
    // category : String
})


const Books = mongoose.model("BOOK", addBookSchema)

module.exports = Books