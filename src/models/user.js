class UserModel{
    constructor(username="",password="",firstname="",lastname="",avatar_url="",id=null){
        this.id=id
        this.username=username
        this.password=password
        this.firstname=firstname
        this.lastname=lastname
        this.avatar_url=avatar_url
    }
}
exports.UserModel=UserModel