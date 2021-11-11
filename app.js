const { response } = require("express")
const express=require("express")
const mysql=require("mysql")
const app=express()
//create connexion
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"todos-db"
})
//Create DB
app.get('/create-todo-db', (req, res) => {

    let sql = 'CREATE DATABASE If NOT EXISTS todos-db';
    db.query(sql, (err, queryRes) => {
        if (err) throw err
        console.log(queryRes);
        res.send('Database Created...')
    })
})
//create the TODOS table
app.get('/create-todo-table', (req, res) => {

    let sql = ` CREATE TABLE todos 
                    ( 
                        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                        title VARCHAR(60),
                        status enum('COMPLETED', 'INPROGRESS', 'CANCELED')
                    )`


    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.send('Todos table created...')
    })
})

//listen database query
db.connect((err,res)=>{
    if(err) throw err
    else console.log("MySql is Running...");
})
//insert new todo row
app.get("/todo-insert",(req,resp)=>{
    //new task
    let newTask = {title:'first task',status:"INPROGRESS"}
    //communiquer avec db
    let sql=`INSERT INTO todos SET ?`
    db.query(sql,newTask,(err,resQuery)=>{
        if(err) throw err
        else{
            console.log(resQuery)
            resp.send("Todo Created...")
        }
    })
})
//get all todos 
app.get('/get-all-todos',(req,res)=>{

    //sql query
    let sql = ` SELECT * FROM todos `

    db.query(sql,(err, result) => {
        if (err) throw err;
        console.log(result)
        res.send('Todos fetched...')
    })
})
//get single todo
app.get('/get-todo-details/:id',(req,res)=>{

    //sql query
    let sql = ` SELECT * FROM todos 
                WHERE id= ${req.params.id} `

    db.query(sql,(err, result) => {
        if (err) throw err;
        console.log(result)
        res.send('Todo fetched...')
    })
})
//update todo's values
app.get('/update-todo/:id',(req,res)=>{

    //sql query
    let newTitle = "'create todos table'"
    let sql = ` UPDATE todos SET title = ${newTitle} WHERE id = ${req.params.id}`

    db.query(sql,(err, result) => {
        if (err) throw err;
        console.log(result)
        res.send('Todo '+req.params.id+' title updated...')
    })
})
//delete todo's values
app.get('/delete-todo/:id',(req,res)=>{

    //sql query
    let sql = ` DELETE FROM todos WHERE id = ${req.params.id}`

    db.query(sql,(err, result) => {
        if (err) throw err;
        console.log(result)
        res.send('Todo '+req.params.id+' deleted...')
    })
})
app.listen('9000',()=>{
    console.log('server is runing on port 9000');
})

