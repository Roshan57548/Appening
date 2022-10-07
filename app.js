const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
var cors = require('cors')
const cookieParser = require('cookie-parser');
dotenv.config({path:'./config.env'});
app.use(cookieParser())
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const user=require('./src/Models/RegistrationSchema');
require('./src/Database/Connection');
const router = require('./src/Router/route');
app.use(router);
const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log("port:",{PORT});
})