const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const path = require("path");
const favicon = require('serve-favicon')
const bcrypt = require('bcrypt');
const { Console } = require("console");

const app = express();

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
        res.json({ redirectUrl: '/dashboard-student' });
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
            res.json({ redirectUrl: '/dashboard-student' });
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
        res.json({ redirectUrl: '/dashboard-instructor' });
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
            res.json({ redirectUrl: '/dashboard-instructor' });
        }else{
            res.status(401).json({incorrectPassword: "Incorrect password"})
        }
    }catch{
        res.status(500).json({ error: "Internal Server Error" });
    }
    
})

app.get('/dashboard-student', (req,res) => {
    res.render('dashboard-student')
})

app.get('/dashboard-instructor', (req,res) => {
    res.render('dashboard-instructor')
})

app.listen(process.env.PORT||3000, () => {
    console.log("server is up and running in PORT 3000")
})