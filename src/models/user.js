class UserModel{
    constructor(username="",password="",firstname="",lastname="",avatar_url="",token="",datetoken=new Date(),flag=0,id=null){
        this.id=id
        this.username=username
        this.password=password
        this.firstname=firstname
        this.lastname=lastname
        this.avatar_url=avatar_url
        this.token=token
        this.datetoken=datetoken
        this.flag=flag
    }
}
exports.UserModel=UserModel