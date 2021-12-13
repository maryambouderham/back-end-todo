const { TaskStatusEnum } = require("../data/enum/TaskStatus")
const { TaskTypeEnum } = require("../data/enum/TaskType")

class Task{
    constructor(title="",userID=0,id=null,status=TaskStatusEnum.TODO.toString(),type=TaskTypeEnum.BACK.toString()){
        this.title=title
        this.userID=userID 
        this.id=id
        this.status=status
        this.type=type
       
       
    }
}
exports.Task=Task