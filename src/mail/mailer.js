const nodemailer= require('nodemailer')
const config=require('../config/mailer')

exports.transport=nodemailer.createTransport({
    service:'mailgun',
    auth:{
        user:config.MAILGUN_USER,
        pass:config.MAILGUN_PASS
    },
    tls:{
        rejectUnauthorized: false
    }
})
