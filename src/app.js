const { response } = require("express")
const express=require("express")
const { addTodo, editTodo, deleteTodo, listTodo, markAs } = require("./api/todos")
const { addUser, login,reset, resend, forgetPw } = require("./api/user")
const { API_URL } = require("./config/api")
const {db}=require("./config/mysql")
const {verifyDate}=require("./helpers.js/verifyDate")
const bodyParser=require('body-parser')
const cors=require('cors')
const { handleError } = require("./helpers.js/error")
//listen database query
db.connect((err,res)=>{
    if(err) throw err
    else console.log("MySql is Running...");
})

const app=express()


app.listen(9000,()=>{
    console.log('sesrver is runing on port 9000');
})
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(express.json())
app.use((err, req, res, next) => {
    handleError(err, res);
  });
//user API
app.post(`${API_URL.user}/add`,addUser)
app.post(`${API_URL.user}/login`,login)
app.get(`${API_URL.user}/reset/:userEmail`,forgetPw)
app.get(`${API_URL.user}/:userEmail/resend`,resend)
app.post(`/api/resetPassword/:userEmail/code/:token`,reset)
//todo API
app.get(`${API_URL.user}/:userID${API_URL.todo}/add`,addTodo)
app.get(`${API_URL.user}/:userID${API_URL.todo}/:taskID/edit`,editTodo)
app.get(`${API_URL.user}/:userID${API_URL.todo}/:taskID/delete`,deleteTodo)
app.get(`${API_URL.user}${API_URL.todo}/all/:userID`,listTodo)
app.get(`${API_URL.user}/:userID${API_URL.todo}/:todoID`,markAs)

//security
app.get(`/${API_URL.auth}/:userEmail/code/:token`, (req, resp) => {
    //verify if account is already verify
    db.query(`select FLAG,DATETOKEN from USERS where username='${req.params.userEmail}'`, (err, resQ1) => {
      if(err) throw err
      else{ if(resQ1[0].FLAG==0 && verifyDate(resQ1[0].SENDMAILDATE) ){
              //flag isVerified field as true 
             db.query(`UPDATE USERS SET FLAG=1 , TOKEN='' WHERE username='${req.params.userEmail}'`, (errr, resQ) => {
             if (errr) throw errr
             else {
            console.log(resQ)
            resp.send("<h1>Thank you for registering & verifying your email 😇 !!")
            } })}
            else {
                if(resQ1[0].FLAG==1)    
                    resp.send("<h1>your account is already verify  !!")
                else
                resp.send(`"<h1>expire session !!<br/><a href="http://localhost:9000/users/${req.params.userEmail}/resend">Resend Mail</a>`)
                }
      }
    })
    

})