const { db } = require("../config/mysql");
const { credentials } = require("../models/credentials");
const { UserModel } = require("../models/user");
const randomstring = require("randomstring");
const { transport } = require("../mail/mailer");
const { PasswordModel } = require("../models/password");
const { verifyDate } = require("../helpers.js/verifyDate");
const { ErrorHandler } = require("../helpers.js/error");
let QR = (sql) => new Promise((resolve, reject) => {

  db.query(sql, (err, res) => {
      if (err) reject(err)
      else { resolve(res) }
  })
})


//register
exports.addUser = async (req, resp, next) => {

  console.log(req.body)
  //new object
  const firstname = req.body.FirstName
  const lastname = req.body.LastName
  const avatar = req.body.avatar
  const UserName = req.body.UserName
  const password = req.body.password
  // validate data

  console.log(password);
  // const patternPassword =
  //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/;

  // if (!patternPassword.test(password)) {
  //   return resp.status(402).json({ message: 'Missing required email and password fields' })
    
  // }

  //   resp.send(
  //     "Password Should be at least 8 characters & maximum 12 and contains at least one number one uppercase and lowercase😅 !!"
  //   );
  //   return;
  // }

  // //validate username
  // let patternUsername = /^.{4,30}$/;
  // if (!patternUsername.test(UserName)) {
  //   resp.send("username should be at least 4 characters maximum 12");
  //   return;
  // }
  // //validate firstname
  // let patternFirstname = /^.{4,12}$/;
  // if (!patternFirstname.test(firstname)) {
  //   resp.send("firstname should be at least 4 characters maximum 12");
  //   return;
  // }
  // //validate lastname
  // let patternLastname = /^.{4,12}$/;
  // if (!patternLastname.test(lastname)) {
  //   resp.send("lastname should be at least 4 characters maximum 12");
  //   return;
  // }
  console.log("hdjhsdh")
  //verifier si username deja existe
  //Use then / catch 
QR(`SELECT * FROM USERS 
WHERE username='${UserName}'`).then(s => console.log(s))
QR(`SELECT * FROM USERS 
WHERE username='${UserName}'`).catch(e => console.log(e))
  
  try{
  let re= await QR(
    `SELECT * FROM USERS 
              WHERE 
              username='${UserName}'`)
     
      
        if (re.length > 0 && re[0].FLAG == 1)
          //resp.send("username already exist ");
           resp.status(402).json({ message: "username already exist "})
        else if (re.length > 0)
           resp.status(403).json({ message: "Please Verify your account "})
        else {
          
            //INSERT sql query
            //INSERT INTO USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,AVATAR_URL)
            //VALUES('${newUser.username}',SHA1('${newUser.password}'),'${newUser.firstname}','${newUser.lastname}','${newUser.avatar_url}')
            //let query= INSERT INTO USERS SET ?
            
            // work with db
            try{
              let newUser=await QR(`INSERT INTO USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,AVATAR_URL)
            VALUES ('${UserName}',SHA1('${password}'),'${firstname}','${lastname}','${avatar}' )`)
                console.log(newUser);
                //resp.send("Please Verify your email Account ...");
            }catch(error) {
              resp.status(500).json({ message: error.message})
          }
              
            
          
          //generate token
          const secretToken = randomstring.generate();
          // INSERT TOKEN sql query
          let queryToken = ` UPDATE USERS set TOKEN='${secretToken}',FLAG='false'
            where username='${UserName}' `;
          // work with db
          try{
          let updateQuery=await QR(queryToken);
        }catch(error) {
          resp.status(500).json({ message: error.message})
      }
          //send mail to newUser's email account
          //mail options
          const mailOptions = {
            from: "fosen38858@videour.com",
            to: UserName,
            subject: "Please Verify your email Account",
            html: `<a href="http://localhost:9000/api/auth/${UserName}/code/${secretToken}">Verify My Email</a>`,
          };
          let info = await transport.sendMail(mailOptions);
          console.log(info)
          resp.status(201).json({ message: "please verify your mail "})

        }
        }catch(error) {
          resp.status(500).json({ message: error.message})
      }};
exports.login = async (req, resp) => {
  //let credential = new credentials("maryam.bouderham@gmail.com", "aaddEE6789");
  const User = req.body.UserName
  const pass = req.body.password
  console.log(req.body)
  //search user by username and password
  let query = `select * from users where username='${User}' and password=SHA1('${pass}')`;
  //apply query
  try{
  
  let res= await QR(query)
  console.log(res)
  if (res.length == 0)
  resp.status(402).json({ message: "username not found "})
  else if (res[0]["FLAG"] == 1)
    resp.status(402).json({ message:"hello " + res[0]["FIRSTNAME"]});
  else
    resp.status(402).json({ message:"please verify your account "});
        
    }catch(error) {
      resp.status(500).json({ message: error.message})
  }
 
};
exports.forgetPw = (req, resp) => {
  const User = req.params.userEmail
  console.log( req.params.userEmail)
  //validate username  let patternUsername = /^.{4,30}$/;
  if (!patternUsername.test(User)) {
    return resp.status(402).json({ message:"username should be at least 4 characters maximum 12"});
    
  }
  //verifier si username deja existe
  db.query(
    `SELECT * FROM USERS 
               WHERE 
               username='${User}' `,
    (errr, resQ) => {
      if (errr) throw errr;
      else {
        console.log(resQ);
        if (resQ.length == 0) return resp.status(402).json({ message:"username not found "});
        else {
          if (resQ[0].FLAG == 0) {
            return resp.status(402).json({ message:"please verify your account "});
          } else {
            //generate token
            const secretToken = randomstring.generate();
            db.query(
              `UPDATE USERS SET SENDMAILDATE=NOW(), TOKEN='${secretToken}' WHERE USERNAME='${User}'`,
              (err, resQ1) => {
                if (err) throw err;
                else {
                  console.log(resQ1);
                  
                  //send mail to newUser's email account
                  //mail options
                  const mailOptions = {
                    from: "maryam.bouderham@gmail.com",
                    to: User,
                    subject: "Please Verify your email Account",
                    html: `<a href="http://localhost:3000/resetPassword/${User}/code/${secretToken}">Click Here to reset your password</a>`,
                  };
                  transport.sendMail(mailOptions, (err1, info) => {
                    if (err1) throw err1;
                    else {
                      console.log(info);
                    }
                  });
                  return resp.status(402).json({ message:"please verify your mail"});
                }
              }
            );
          }
        }
      }
    }
  );
};
exports.reset = (req, resp) => {
  resp.send("aaaaaaa")
 // let newPassword = new PasswordModel("aaddEE6789", "aaddEE6789");
 password=req.body.Password
 newPassword=req.body.ConfirmPaswword
  // compare password
  if (password.localeCompare(newPassword) == 0) {
    // validate password
    const patternPassword =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/;

    if (!patternPassword.test(password)) {
      return resp.status(404).json(
       {message:"Password Should be at least 8 characters & maximum 12 and contains at least one number one uppercase and lowercase😅 !!"} 
      );
     
    }
  } else {
    return resp.status(404).json(
      {message:"les mots de passe ne sont pas identiques"});
  
  }
  //query by username and token
  db.query(
    `SELECT * FROM USERS WHERE username='${req.params.userEmail}' AND token='${req.params.token}'`,
    (errr, resQ) => {
      if (errr) throw errr;
      else {
        console.log(resQ);
        if (resQ.length == 0) return resp.status(404).json(
          {message:"<h1>Invalid Token !!"});
        else {
          if (!verifyDate(resQ[0].SENDMAILDATE))
          return resp.status(404).json(
            {message:"<h1>Invalid Token !!"});
          else {
            db.query(
              `UPDATE USERS SET password=SHA1('${password}'),token="" WHERE username='${req.params.userEmail}'`,
              (err, resQ1) => {
                if (err) throw err;
                else {

                  console.log(resQ1);
                  return resp.status(404).json(
                    {message:"<h1>mot de passe modifié !!"});
                }
              }
            );
          }
        }
      }
    }
  );
};
exports.resend = (req, resp) => {
  //validate username
  let patternUsername = /^.{4,30}$/;
  if (!patternUsername.test(req.params.userEmail)) {
    resp.send("username should be at least 4 characters maximum 12");
    return;
  }
  //verifier si username deja existe
  db.query(
    `SELECT * FROM USERS 
              WHERE 
              username='${req.params.userEmail}' `,
    (errr, resQ) => {
      if (errr) throw errr;
      else {
        console.log(resQ);
        if (resQ.length == 0) resp.send("username not found ");
        else {
          if (resQ.length > 0 && resQ[0].FLAG == 1) {
            resp.send("username already verify ");
          } else {
            //generate token
            const secretToken = randomstring.generate();
            db.query(
              `UPDATE USERS SET SENDMAILDATE=NOW(), TOKEN='${secretToken}' WHERE USERNAME='${req.params.userEmail}'`,
              (err, resQ1) => {
                if (err) throw err;
                else {
                  console.log(resQ1);
                  resp.send("please verify your mail");
                  //send mail to newUser's email account
                  //mail options
                  const mailOptions = {
                    from: "maryam.bouderham@gmail.com",
                    to: req.params.userEmail,
                    subject: "Please Verify your email Account",
                    html: `<a href="http://localhost:9000/api/auth/${req.params.userEmail}/code/${secretToken}">verify your mail</a>`,
                  };
                  transport.sendMail(mailOptions, (err1, info) => {
                    if (err1) throw err1;
                    else {
                      console.log(info);
                    }
                  });
                }
              }
            );
          }
        }
      }
    }
  );
};
