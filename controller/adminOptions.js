const Books = require("../model/addBookSchema")
const Student = require('../model/userSignupSchema');
const IssuedBookModel = require("../model/issuedBooksSchema")


//---------------  Issue Book Route  ------------------

module.exports.issueBookAuth = (req, res)=>{

    const {student_name, student_roll, book_name, author_name, book_id} = req.body;
    const upperName = student_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    const upperBookName = book_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    const upperAuthorName = author_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    const upperRoll = student_roll.toUpperCase()
    IssuedBookModel.findOne({student_roll : upperRoll, book_id : book_id}, (err, issueResult)=>{
        if(issueResult){
            return res.json({
                status : 402,
                msg : "student already issued this book"
            })
        }
    })

    Books.findOne({bookId: book_id || {quantity : {gt : 0}}}, (err, bookResult)=>{
        if(!err){
            if(bookResult){
                console.log(bookResult.bookName);
                let newQuantity = parseInt(bookResult.quantity)-1
                // bookResult = result
                Student.findOne({roll_no : upperRoll}, (err, studentResult)=>{
                    if(!err){
                        if(studentResult){
                            console.log(studentResult.upperName);
                            // bookResult.quantity = 1
                            const newIssuedBooks = bookResult;
                            Books.updateOne({bookId : book_id}, {quantity : newQuantity }, (err, bookUpdt)=>{
                                if(!err || bookUpdt){
                                    console.log("book updated and issued");
                                }
                            } )

                            Student.updateOne({roll_no : upperRoll}, {$push:{book_issued : newIssuedBooks}},
                                (err, studentBookIssued)=>{
                                    if(!err || studentBookIssued){
                                        console.log("student book issued updated");
                                        console.log(studentBookIssued.book_issued);
                                    }
                                })

                            const newIssueItem = new IssuedBookModel({
                                book_name : upperBookName,
                                author_name : upperAuthorName,
                                book_id : book_id,
                                student_name : upperName,
                                student_roll : upperRoll
                            })
                            newIssueItem.save()
                            return res.json({
                                status : 500,
                                msg : "Book succefully issued"
                            })
                        }
                        else{
                            return res.json({
                                status : 401,
                                error : "student not found"
                            })
                        }
                    }
                })
            }
           else{
            return res.json({
                status : 400,
                msg : "book is not available"
            })
           }
        }
    })
}




//--------------  Add Book To Library  ----------------





module.exports.addBookAuth =  (req, res) => {

    const { bookName,  authorName, bookId,  quantity } = req.body
    console.log(req.body);

    if ( !bookName || !authorName || !bookId || !quantity  ) {
        return res.json({ status : 401,
            error: "fill data correctely" })
    }
  
    console.log("all data filled");

    Books.findOne({bookId : bookId}, (err, result)=>{

        if(!err){
         if(!result){
             console.log("id not matched");
             const upperBookName = bookName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
             const upperAuthorName = authorName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
             
            
              const newBook = new Books({
                 bookName : upperBookName,
                 authorName : upperAuthorName,
                 bookId : bookId,
                 quantity : quantity
              })
              newBook.save();
              return res.json({
                  status : 402,
                  msg : "new Book added"
              })
         }else{
            console.log("id matched");
            const newQuantity = parseInt(result.quantity) + parseInt(quantity)
           Books.updateOne({bookId : bookId}, { quantity : newQuantity}, (err, result)=>{
               if(!err){
                   console.log("Book quantity updated");
                return res.json({
                    status : 403,
                    msg : "Book Quantity updated"
                })
               }
             })
         }
        }
    })
}




//----------------- View Book route -----------------




module.exports.viewBookAuth = (req, res)=>{

    Books.find((err, result)=>{
        if(!err){
            if(result){
                   return res.json({
                    status : 200,
                    bookList : result,
                    msg : "list send to react viewbook component"
                })
            }else{
                return res.json({
                    status : 401,
                    err : "book not found"
                })
            }
        }
    })
}



//-----------------View student-----------------

module.exports.viewStudentAuth =  (req, res)=>{

    Student.find((err, result)=>{
        // console.log(result);
        if(!err){
            if(result){
                return res.json({
                    status : 200,
                    studentList : result,
                    msg : "student list send to react"
                })
            }else{
                return res.json({
                    status : 200,
                    msg : "student not found"
                })
            }
        }
    })
}