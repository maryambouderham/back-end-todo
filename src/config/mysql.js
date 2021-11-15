const mysql=require("mysql")
//create connexion
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"todos-db"
})

exports.db=db