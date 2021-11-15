const { response } = require("express")
const express=require("express")
const { addUser } = require("./api/user")
const { API_URL } = require("./config/api")
const {db}=require("./config/mysql")

//listen database query
db.connect((err,res)=>{
    if(err) throw err
    else console.log("MySql is Running...");
})

const app=express()


app.listen('9000',()=>{
    console.log('server is runing on port 9000');
})
//user API
app.get(`${API_URL.user}/add`,addUser)