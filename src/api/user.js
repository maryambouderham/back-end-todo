
const { db } = require("../config/mysql");
const { UserModel } = require("../models/user");

//register 
exports.addUser=(req,resp)=>{
    
    //new object
    let newUser = new UserModel(
        "aaaa",
        "bbbb1234",
        "saytama",
        "yamagi",
        "hdshduze")
    // validate data
    if(newUser.password.length<8 || newUser.password.length>=12){
    resp.send("password should be at least 8 characters & maximun 12")
    return
}
     //validate username
     if(newUser.username.length<4 || newUser.username.length>12){
         resp.send("username should be at least 4 characters maximum 12")
         return
     }
    //verifier si username deja existe
    db.query( `SELECT * FROM USERS 
              WHERE 
              username='${newUser.username}' `,(err,resQ)=>{
        if(err) throw err
        else{
            console.log(resQ)
            if(resQ.length>0) resp.send("username already exist ")
            else{
               // INSERT sql query
                let query=` INSERT INTO USERS SET ? `
                // work with db
                db.query(query,newUser,(err,resQ)=>{
                if(err) throw err
                else {
                console.log(resQ)
                resp.send("user Added ...")
                }
            })
            }
        }
    })
    
}