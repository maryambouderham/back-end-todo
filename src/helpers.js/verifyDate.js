exports.verifyDate=(date=new Date())=>{
    const date1=new Date();
    console.log
    if(Date.parse(date1)-Date.parse(date)< 900000)
             return true
    else return false
}