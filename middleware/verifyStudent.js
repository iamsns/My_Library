const jwt = require("jsonwebtoken")

const verifyStudent = (req, res, next)=>{

    const studentToken = req.cookies.jwtStudent

   if(studentToken){
    jwt.verify(studentToken, "thisissecretkey", (err, decodeToken)=>{
        if(!err){
            console.log(decodeToken);
            next()
        }else{
            res.redirect("/userlogin")
        }
    })
   }else{
       res.redirect("/userlogin")
   }
}

module.exports = {verifyStudent}