const bcrypt = require('bcrypt');
const saltRounds = 5;
const jwt = require("jsonwebtoken");
const Student = require('../model/userSignupSchema');

const createToken = (id)=>{
    return jwt.sign({ id }, "thisissecretkey", {expiresIn : 60*60*24})
}
//-------- --------- student login ----------------

module.exports.studentAuthLogin = async (req, res)=>{
    try {
        const { roll_no, password } = req.body;
        
        if (!roll_no || !password) {
            return res.status(400).json({ error: "please fill the data" });
        }
        
        const upperRoll = roll_no.toUpperCase()
        // const hashed_password = md5(password)

        const studentLogin = await Student.findOne({ roll_no: upperRoll });
        console.log(studentLogin);

        if (studentLogin) {
         
            bcrypt.compare(password, studentLogin.password, function(err, result) {
                if(result){
                    const token = createToken(studentLogin._id)
                    console.log(token);
                    const userInfo = {
                        name : studentLogin.name,
                        roll_no : upperRoll
                    }

                    res.cookie("jwtStudentInfo", userInfo)
                    res.cookie("jwtStudent", token)
                    console.log(userInfo);
                   return res.status(200).json({ message: "user signin successfully" })
                }else{
                    res.status(401).json({ error: " invalid pass" })
                }
                
            });

        } else {
            res.status(402).json({ message: "invalid Roll No" });
        }
    } catch (err) {
        console.log(err);
    }
}

//------------------Student Signup Route---------------

module.exports.studentAuthSignup = (req, res)=>{
    const { name, roll_no, branch, dob, password, cpassword } = req.body;

    //validation :

    if (!name || !roll_no || !branch || !dob || !password || !cpassword ) {
        console.log("fill data");
        return res.json({
            error: "fill data correctly",
            status: 422
        });
    } else if(password !== cpassword){
        console.log("pass not matched");
        return res.json({
            status : 423
        });
    }

    // const hashed_password = md5(password);


    Student.findOne({ roll_no: roll_no }, (err, result) => {
        console.log(result);

        if (result) {
            if(result.roll_no===roll_no){
           console.log('student already present');
                return res.json({
                    error: "student exist",
                    status: 400
                });
            }
        } else {

            bcrypt.hash(password, saltRounds, function(err, hashed_password) {
              
                console.log('student registered');
                const upperName = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                const upperRoll = roll_no.toUpperCase()
                const newStudent = new Student({ name : upperName,roll_no : upperRoll, branch, dob, password : hashed_password});
                newStudent.save()

                return res.json({
                    error: "student registereed",
                    status: 500
                });
            });
        }
    })

    //By promises

    // Student.findOne({ roll_no: roll_no })

    // .then((userExist) => {
    //     if (userExist) {
    //         console.log("student already present");
    //         return res.status(400).json({ error: "Student already registered" });
    //     }
    //     console.log("student not present");
    //     const newStudent = new Student({ name, roll_no, branch, dob, password, cpassword });

    //     newStudent.save().then(() => {
    //         res.status(201).json({ message: "user registered successfully" });
    //     }).catch((err) => res.status(500).json({ error: "registration failed" }));
    // }).catch((err) => { console.log(err) })

}

module.exports.studentAuthLogout = (req, res)=>{
    res.cookie("jwtStudent", " ", {expiresIn : 1})
    console.log("logout student");
    return res.json({
        status : 200
    })
}