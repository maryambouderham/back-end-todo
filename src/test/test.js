const { db } = require("../config/mysql");

//def
let QR = (sql) => new Promise((resolve, reject) => {

    db.query(sql, (err, res) => {
        if (err) reject(err)
        else { resolve(res) }
    })
})
//Use then / catch 
QR(`SELECT * FROM USERS 
    WHERE username='maryam.bouderham@gmail.com'`).then(s => console.log(s))
QR(`SELECT * FROM USERS 
WHERE username='maryam.bouderham@gmail.com'`).catch(e => console.log(e))

//Use Async Await
let test = async function () {
    try {
        let res = await QR(`
                SELECT * FROM USERS 
                WHERE username='maryam.bouderham@gmail.com'`
        )
        console.log(res[0].FLAG);
    } catch (error) {
        console.log(error);
    }
}

test()