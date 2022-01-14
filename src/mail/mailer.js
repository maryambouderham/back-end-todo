const nodemailer= require('nodemailer')
const config=require('../config/mailer')

//  exports.transport=nodemailer.createTransport({
//      service:'mailgun',
//      auth:{
//          user:config.MAILGUN_USER,
//          pass:config.MAILGUN_PASS
//      },
//      tls:{
//          rejectUnauthorized: false
//      }
// })
 exports.transport = nodemailer.createTransport({
     host: "smtp.mailtrap.io",
     port: 2525,
     auth: {
       user: "ebab2022e5b698",
       pass: "8dadaa9c791005"
     }
   });