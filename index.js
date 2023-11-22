require('dotenv').config()
const cookieParser = require('cookie-parser');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const path = require("path");
const favicon = require('serve-favicon')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.use(express.json({ limit: '1mb' }))

app.get('', (req, res) => {
    res.render('index')
})

app.get("/login-student", (req,res) => {
    res.render('login-student')
})

app.get("/register-student", (req,res) => {
    res.render('register-student')
})

app.get("/login-instructor", (req,res) => {
    res.render('login-instructor')
})

app.get("/register-instructor", (req,res) => {
    res.render('register-instructor')
})

let studentUsers = []

let instructorUsers = []

app.post("/register-student", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const sUser = {
            "name": req.body.name,
            "university": req.body.university,
            "email": req.body.email,
            "password": hashPassword
        }
        studentUsers.push(sUser)
        const studentRegisterUsername = req.body.email
        const studentUser = {name: studentRegisterUsername} 
        const accessToken = jwt.sign(studentUser, process.env.STUDENT_ACCESS_TOKEN_SECRET)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            // change this in production to true
            secure: false, 
            sameSite: 'strict', 
            maxAge: 24 * 60 * 60 * 1000 
        });
        res.json({message: 'Registration Successful'})
        
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/login-student", async (req, res) => {
    const user = studentUsers.find(user => user.email === req.body.email);
    if (user == null){
        return res.status(400).json({ notFound: "User Not Found" });
    }
    try{
        if (await bcrypt.compare(req.body.password, user.password)){
            const username = req.body.email
            const user = {name: username}
            const accessToken = jwt.sign(user, process.env.STUDENT_ACCESS_TOKEN_SECRET)
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                // change this in production to true
                secure: false, 
                sameSite: 'strict', 
                maxAge: 24 * 60 * 60 * 1000 
            });
            res.json({message: 'Login Successful'})
        }else{
            res.status(401).json({incorrectPassword: "Incorrect password"})
        }
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post("/register-instructor", async (req, res) => {
    try{
        const iSalt = await bcrypt.genSalt();
        const iHashPassword = await bcrypt.hash(req.body.password, iSalt)
        const iUser = {
            "name": req.body.name,
            "university": req.body.university,
            "email": req.body.email,
            "subject": req.body.subject,
            "password": iHashPassword
        }
        instructorUsers.push(iUser)
        const instructorRegisterUsername = req.body.email
        const user = {name: instructorRegisterUsername} 
        const accessToken = jwt.sign(user, process.env.INSTRUCTOR_ACCESS_TOKEN_SECRET)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            // change this in production to true
            secure: false, 
            sameSite: 'strict', 
            maxAge: 24 * 60 * 60 * 1000 
        });
        res.json({message: 'Registration Successful'})
    }catch (error){
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post("/login-instructor", async(req, res) => {
    const user = instructorUsers.find(user => user.email === req.body.email);
    if (user == null){
        return res.status(400).json({ notFound: "User Not Found" });
    }
    try{
        if (await bcrypt.compare(req.body.password, user.password)){
            const username = req.body.email
            const user = {name: username}
            const accessToken = jwt.sign(user, process.env.INSTRUCTOR_ACCESS_TOKEN_SECRET)
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                // change this in production to true
                secure: false, 
                sameSite: 'strict', 
                maxAge: 24 * 60 * 60 * 1000 
            });
            res.json({message: 'Login Successful'})
        }else{
            res.status(401).json({incorrectPassword: "Incorrect password"})
        }
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }    
    
})

app.get('/dashboard-student', studentAuthenticationToken, (req,res) => {
    res.render('dashboard-student')
})

app.get('/dashboard-instructor', (req,res) => {
    res.render('dashboard-instructor')
})

function studentAuthenticationToken(req, res, next) {
    const token = req.cookies.accessToken
    if (token == null) return res.status(401).json({notAuthorized: 'Not Authorized'})
    jwt.verify(token, process.env.STUDENT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({invalidToken: 'Token is invalid'})
    req.user = user
    next()
    })
}

function instructorAuthenticationToken(req, res, next) {
    const token = req.cookies.accessToken
    if (token == null) return res.status(401).json({notAuthorized: 'Not Authorized'})
    jwt.verify(token, process.env.INSTRUCTOR_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({invalidToken: 'Token is invalid'})
    req.user = user
    next()
    })
}

app.get('/chapterwise-student', (req, res) => {
    res.render('chapterwise-student')
})

app.get('/chapterwise-instructor', (req, res) => {
    res.render('chapterwise-instructor')
})

app.get('/chatbot', (req, res) => {
 res.render('chatbot')
})

app.listen(process.env.PORT||3000, () => {
    console.log("server is up and running in PORT 3000")
})