const { db } = require("../config/mysql");
const { credentials } = require("../models/credentials");
const { UserModel } = require("../models/user");
const randomstring = require("randomstring");
const { transport } = require("../mail/mailer");
const { PasswordModel } = require("../models/password");
const { verifyDate } = require("../helpers.js/verifyDate");

//register
exports.addUser = (req, resp) => {
  //new object
  let newUser = new UserModel(
    "maryam.bouderham@gmail.com",
    "aaddEE1234",
    "saytama",
    "yamar",
    "hdshduze"
  );
  // validate data
  let { password, username } = newUser;
  console.log(password);
  const patternPassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/;

  if (!patternPassword.test(password)) {
    resp.send(
      "Password Should be at least 8 characters & maximum 12 and contains at least one number one uppercase and lowercase😅 !!"
    );
    return;
  }

  //validate username
  let patternUsername = /^.{4,30}$/;
  if (!patternUsername.test(username)) {
    resp.send("username should be at least 4 characters maximum 12");
    return;
  }
  //validate firstname
  let patternFirstname = /^.{4,12}$/;
  if (!patternFirstname.test(newUser.firstname)) {
    resp.send("firstname should be at least 4 characters maximum 12");
    return;
  }
  //validate lastname
  let patternLastname = /^.{4,12}$/;
  if (!patternLastname.test(newUser.lastname)) {
    resp.send("lastname should be at least 4 characters maximum 12");
    return;
  }
  //verifier si username deja existe
  db.query(
    `SELECT * FROM USERS 
              WHERE 
              username='${newUser.username}' `,
    (errr, resQ) => {
      if (errr) throw errr;
      else {
        console.log(resQ);
        if (resQ.length > 0 && resQ[0].FLAG == 1)
          resp.send("username already exist ");
        else {
          if (resQ.length == 0) {
            //INSERT sql query
            //INSERT INTO USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,AVATAR_URL)
            //VALUES('${newUser.username}',SHA1('${newUser.password}'),'${newUser.firstname}','${newUser.lastname}','${newUser.avatar_url}')
            //let query= INSERT INTO USERS SET ?
            let query = ` INSERT INTO USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,AVATAR_URL)
                 VALUES ('${newUser.username}',SHA1('${newUser.password}'),'${newUser.firstname}','${newUser.lastname}','${newUser.avatar_url}')`;
            // work with db
            db.query(query, (err, resQ) => {
              if (err) throw err;
              else {
                console.log(resQ);
                resp.send("Please Verify your email Account ...");
              }
            });
          }
          //generate token
          const secretToken = randomstring.generate();
          // INSERT TOKEN sql query
          let queryToken = ` UPDATE USERS set TOKEN='${secretToken}',FLAG='false'
            where username='${newUser.username}' `;
          // work with db
          db.query(queryToken, (errr, resQT) => {
            if (errr) throw errr;
            else {
              console.log(resQT);
              //resp.send("token added ...")
            }
          });
          //send mail to newUser's email account
          //mail options
          const mailOptions = {
            from: "maryam.bouderham@gmail.com",
            to: newUser.username,
            subject: "Please Verify your email Account",
            html: `<a href="http://localhost:9000/api/auth/${newUser.username}/code/${secretToken}">Verify My Email</a>`,
          };
          transport.sendMail(mailOptions, (err1, info) => {
            if (err1) throw err1;
            else {
              console.log(info);
            }
          });
        }
      }
    }
  );
};
exports.login = (req, resp) => {
  let credential = new credentials("maryam.bouderham@gmail.com", "aaddEE6789");

  //search user by username and password
  let query = `select * from users where username='${credential.username}' and password=SHA1('${credential.password}')`;
  //apply query
  db.query(query, (err, resQ) => {
    if (err) throw err;
    else {
      console.log(resQ);
      //result
      if (resQ.length === 0) resp.send("<br/> user not found...");
      else {
        if (resQ[0]["FLAG"] == 1) resp.send("hello " + resQ[0]["FIRSTNAME"]);
      }
    }
  });
};
exports.forgetPw = (req, resp) => {
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
          if (resQ[0].FLAG == 0) {
            resp.send("please verify your account ");
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
                    html: `<a href="http://localhost:9000/api/resetPassword/${req.params.userEmail}/code/${secretToken}">Click Here to reset your password</a>`,
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
exports.reset = (req, resp) => {
  let newPassword = new PasswordModel("aaddEE6789", "aaddEE6789");
  // compare password
  if (newPassword.Pw.localeCompare(newPassword.confirmPw) == 0) {
    // validate password
    const patternPassword =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/;

    if (!patternPassword.test(newPassword.Pw)) {
      resp.send(
        "Password Should be at least 8 characters & maximum 12 and contains at least one number one uppercase and lowercase😅 !!"
      );
      return;
    }
  } else {
    resp.send("les mots de passe ne sont pas identiques");
    return;
  }
  //query by username and token
  db.query(
    `SELECT * FROM USERS WHERE username='${req.params.userEmail}' AND token='${req.params.token}'`,
    (errr, resQ) => {
      if (errr) throw errr;
      else {
        console.log(resQ);
        if (resQ.length == 0) resp.send("<h1>Invalid Token !!");
        else {
          if (!verifyDate(resQ[0].SENDMAILDATE))
            resp.send("<h1>Invalid Token !!");
          else {
            db.query(
              `UPDATE USERS SET password=SHA1('${newPassword.Pw}'),token="" WHERE username='${req.params.userEmail}'`,
              (err, resQ1) => {
                if (err) throw err;
                else {
           
                    console.log(resQ1);
                  resp.send("<h1>mot de passe modifié !!");
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
