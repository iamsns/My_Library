const jwt = require("jsonwebtoken")

const verifyAdmin = (req, res, next)=>{

    const adminToken = req.cookies.jwtAdmin

   if(adminToken){
    jwt.verify(adminToken, "thisissecretkey", (err, decodeToken)=>{
        if(!err){
            console.log(decodeToken);
            next()
        }else{
            res.redirect("/adminlogin")
        }
    })
   }else{
       res.redirect("/adminlogin")
   }
}

module.exports = {verifyAdmin}