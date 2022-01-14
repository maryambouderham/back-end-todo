const { db } = require("../config/mysql");
const { TaskStatusEnum } = require("../data/enum/TaskStatus");
const { TaskTypeEnum } = require("../data/enum/TaskType");
const { Task } = require("../models/task");
exports.addTodo=(req,resp)=>{
    //task to added
    //let newTask=new Task("task2",req.params.userID )
    const title=req.body.titre
    const status=req.body.statu
    const type=req.body.typ
    const user=req.body.userId

    //query
    let query=`insert into todos (TITLE,STATUS,TYPE,userId) values (${title},${status},${type},${user})`
    //apply query
    db.query(query,(err,resQ)=>{
        if(err) throw err
        else{
            console.log(resQ)
            resp.status(402).json({ message:"task added ..."})
        }
    })
}
exports.editTodo=(req,resp)=>{
   //task to edit
   let newTask=new Task("taskedite",req.params.userID,req.params.taskID) 
   //validate data (fields)
    let titlePattern=/^.{4,12}$/
    let statusPattern=/^(TODO|COMPLETED|INPROGRESS|CANCELED)$/
    let typePattern=/^(FRONT|BACK|DESIGN|TESTING)$/
    let userIdPattern=/^.[1-9][0-9]+$/
   //validate userID
   let queryUser=`select * from users where id=${req.params.userID}`
   db.query(queryUser,(errr,respQ)=>{
    if(errr) throw errr
    else{
        console.log(respQ)
        if(respQ.lenght===0){
            resp.send("invalid user Id ...")
            return
        }
        else{
//query
let query=`update todos set ? where userId=${req.params.userID} and id=${req.params.taskID}`
//apply query
db.query(query,newTask,(err,resQ)=>{
    if(err) throw err
    else{
        console.log(resQ)
        
        resp.send("task edited ...")
    }
})
        }
    }
})
    
}
exports.deleteTodo=(req,resp)=>{
    
   //query
   let query=`delete from  todos where userId=${req.params.userID} and id=${req.params.taskID}`
   //apply query
   db.query(query,(err,resQ)=>{
       if(err) throw err
       else{
           console.log(resQ)
           
           resp.send("task deleted ...")
       }
   })
}
exports.listTodo=(req,resp)=>{
    let query=`select * from todos where userId=${req.params.userID}`
    //apply query
db.query(query,(err,resQ)=>{
    if(err) throw err
    else{
        console.log(resQ)
            resp.json(resQ)
       
        
    }
})
}
exports.markAs=(req,resp)=>{
    let statu='COMPLETED'
    let statusPattern=/^(TODO|COMPLETED|INPROGRESS|CANCELED)$/
    //validate status
    if (!statusPattern.test(statu)) {
        resp.send("error status not found");
        return;
      }
    let query=` select * from todos where userId=${req.params.userID} AND ID=${req.params.todoID}`  
    db.query(query,(err,resQ)=>{
        if(err) throw err
        else{
            if(resQ.lenght==0)
                resp.send("todo not found")
            else{
                let query1=` update todos set STATUS='${statu}' where userId=${req.params.userID} AND ID=${req.params.todoID} `
                db.query(query1,(errr,resQ1)=>{
                if(errr) throw errr
                else{
                    console.log(resQ1)
                    resp.send("update successfly")
                }
                })
            }
            
        }
    })
}