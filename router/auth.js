const express = require("express");
const router = express.Router();
// const md5 = require("md5")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 5;

const {verifyAdmin} = require("../middleware/verifyAdmin")
const {verifyStudent} = require("../middleware/verifyStudent")

//require modules 

const adminAuthModule = require("../controller/adminAuth")
const studentAuthModule = require("../controller/studentAuth")
const adminOptionsModule = require("../controller/adminOptions")



router.use(cookieParser())

require('../db/conn');
const Student = require('../model/userSignupSchema');
const IssuedBookModel = require("../model/issuedBooksSchema");
// const Admin = require("../model/adminSchema")
// const Books = require("../model/addBookSchema")
// const IssuedBookModel = require("../model/issuedBooksSchema")


// ------------Student Registration route-------------

router.post("/studentsignup", studentAuthModule.studentAuthSignup);


// ---------student logout 00---------------

router.get("/studentlogout", studentAuthModule.studentAuthLogout)

// -------------- your books route-----------
router.get("/yourbooks", verifyStudent, (req, res)=>{
    const {token, name, roll_no} = req.cookies.jwtStudentInfo
    // console.log(token, name, roll_no);
const arr = [1,2,3]
    IssuedBookModel.find({student_roll : roll_no}, (err, issuedBookResult)=>{
        if(!err){
            if(issuedBookResult.length !== 0){
                console.log(issuedBookResult);
                console.log(arr);
                console.log(typeof(arr));
                return res.json({
                    status : 500,
                    token : token,
                    name : name,
                    roll_no : roll_no,
                    books : issuedBookResult
                })
            }else{
                console.log("you have no book issued");
                return res.json({
                    status : 400,
                    books : "no book issued",
                    token : token,
                    name : name,
                    roll_no : roll_no
                })
            }
        }
    })
    // return res.json({
    //     status : 500,
    //     msg : "item send",
    //     token : token,
    //     name : name,
    //     roll_no : roll_no
    // })
})

//-----------------Student Login route----------------

router.post("/studentlogin", studentAuthModule.studentAuthLogin)

//-------------Admin login route-------------

router.post("/adminlogin", adminAuthModule.adminAuthLogin)

//admin logout

router.get("/adminlogout", (req, res)=>{
    console.log("inside logout get");
    res.cookie('jwtAdmin', " ", { httpOnly : true, maxAge : 1 } )
    return res.json({
        status : 500,
        msg : "cookie is clear"
    })
})

//-----------Admin loggednIn route-----------------

router.get("/adminloggedin", verifyAdmin, (req, res)=>{
    console.log("inside adminloggedin");
    const name = req.cookies.adminInfo
    console.log("admin name is " +name);
    return res.json({
        status : 500,
        name : name
    })
})
// -----------Admin Registration Route------------
router.post("/addadmin", adminAuthModule.adminAuthSignup)

router.get("/addadmin", verifyAdmin, (req, res)=>{
    console.log("inside addAdmin");
})


//-------------------Add Books route----------------------
router.get("/addbooks", verifyAdmin, (req, res)=>{
    console.log("inside add book get request");
})
router.post("/addbooks", adminOptionsModule.addBookAuth)

//-----------------View Books route---------------

router.get("/viewbooks", adminOptionsModule.viewBookAuth)
router.get("/books", verifyStudent, adminOptionsModule.viewBookAuth)

//------------------Issue book route--------------------

router.get("/issuebooks", verifyAdmin, (req, res)=>{
    console.log("inside issue book get request");
})

router.post("/issuebooks", adminOptionsModule.issueBookAuth)

//-------------------view students route-------------------

router.get("/viewstudents", verifyAdmin, adminOptionsModule.viewStudentAuth)

//-------------student nav--------------------
router.get("/studentnav", (req, res)=>{
    const {name, roll_no} = req.cookies.jwtStudentInfo
    console.log(name);
    return res.json({
        status : 500,
        name : name,
        roll_no : roll_no
    })
})

//-------student loogeed in------------
router.get("/studentloggedin", verifyStudent, (req, res)=>{
    const {name, roll_no} = req.cookies.jwtStudentInfo
    console.log(req.cookies.jwtStudentInfo);
    return res.json({
        status : 500,
        name : name,
        roll_no : roll_no
    })
})

router.use(express.json());
module.exports = router;