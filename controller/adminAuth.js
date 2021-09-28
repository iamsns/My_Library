const bcrypt = require('bcrypt');
const saltRounds = 5;
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser")

const Admin = require("../model/adminSchema")

const maxAge = 60*60*24*1000
const createToken = (id)=>{
    return jwt.sign({ id }, "thisissecretkey", {
        expiresIn : maxAge
    })
}

//--------------------Admin Login Route-----------------------

module.exports.adminAuthLogin = (req, res)=>{
    console.log("entered in server");

    const { id, password} = req.body;
//validation
    if( !id || !password ){
        console.log("please enter data");
        return res.json({
            status : 401,
            msg : "data not filled"
        });
    }
    // const hashed_password = md5(password)

    Admin.findOne({id : id}, (err, result)=>{
        // console.log(result);

        if(result){

            bcrypt.compare(password, result.password, (err, comparedResult)=>{
                if(comparedResult){
               //Generate Token
                    const token = createToken(result._id)
                    const name = result.name
                    console.log(token);
                    res.cookie('jwtAdmin', token, { httpOnly : true, expiresIn : maxAge} )
                    res.cookie("adminInfo", name)
                 
                    return res.json({
                        status : 402,
                        token : token,
                        name : result.name,
                        msg : "token generated"
                    });
                }else{
                    return res.json({
                        status : 403,
                        error : "password not  matched"
                    });
                }
            })
        }else{
            return res.json({
                status : 404,
                error : "admin not exist"
            });
        }
    })

}





//-----------------Admin Registration Route----------------------






module.exports.adminAuthSignup = (req, res)=>{
    const {name, id, dob, password, cpassword} = req.body

    if ( !name || !id || !dob || !password ) {
        return res.json({ status : 401,
            error: "fill data correctely" })
    }else if( password !== cpassword){
        return res.json({ status : 402,
            error : "enter same password" })
    }
    
    // const hashed_password = md5(password)

    Admin.findOne({ id : id }, (err, result)=>{
        if(result){
            if(id===result.id){
                return res.json({
                    status : 403,
                    msg : "admin already present"
                })
            }
        }else{

            bcrypt.hash(password, saltRounds, (err, hashedAdminPassword)=>{
                if(hashedAdminPassword){
                    const upperName = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                    const newAdmin = new Admin({
                        name : upperName,
                        id : id,
                        dob : dob,
                        password : hashedAdminPassword
                    })
                    newAdmin.save()
                   const token = createToken(newAdmin._id)
                   res.cookie('jwtAdmin', token, { httpOnly : true, maxAge : maxAge*1000 } )
                  return res.json({
                       status : 500,
                       msg : 'new admin added',
                       user : newAdmin._id
                   })
                }
            })
        }
    })
}