const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const path = require("path");
const favicon = require('serve-favicon')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.use(express.json({ limit: '1mb' }))

app.get('', (req, res) => {
    res.render('index')
})

app.listen(process.env.PORT||3000, () => {
    console.log("server is up and running in PORT 3000")
})