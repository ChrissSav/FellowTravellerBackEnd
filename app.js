const express = require('express');
const mysql = require('mysql');
let error_handling = require('./error_handling');
let success_handling = require('./success_handling');

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'fellowtraveller',
    insecureAuth : true
});

db.connect((error) => {
    if(error){
        console.log(error);        
    }
    else{
        console.log('Mysql connected');
    }
})

const app = express();

app.listen('5000', () => {
    console.log("on port 5000")
});


app.get('', (req,res) => {
    res.send("Καλώ ήρθατε στο FellowTraveller");
});
 



//=======================================================new===================================
//------------------------Users-------------------------------

function checkUserIsInList(email) {
    db.query('Select * from users where email = ?',[email],(err, result) => {
        if (err || result == 0){
            return false;  
        }
		else{
            return true;
        }
    });
}





app.get('/getusers', (req,res) => {
    db.query('SELECT * FROM users ',(err,rows,fields) => {
        if(!err){
            res.send(rows);
           // console.log("/getusers");        
        }
        else{
            console.log(err);
        }
    })
 }); 



 app.get('/getusers/:id',(req,res) => {
    db.query('Select * from users where email = ?',[req.params.id],(error, result) => {
        if(result.length > 0){
            console.log("ok  == "); 
            console.log(result); 
            res.send(result);
        }
        else{
            console.log(error_handling("There is no user with these elements"));
            res.send(error_handling("There is no user with these elements"));
        }
        console.log("\n\n");
    })
});



app.get('/adduser/:name/:email/:password/:phone', (req, res) => { 
    let name = req.params.name;
    let password = req.params.password;
    let email = req.params.email;
    let phone = req.params.phone;
    if(phone.length!=10){
        res.send(error_handling("to til prepei na einai 10 noymera"));
    }
    else if(phone[0]!=='6' || phone[1]!=='9'){
        res.send(error_handling("to til prepei na arxizei apo 69"));
    }
    else if(email.length==0){
        res.send(error_handling("Email einai keno"));
    }
    else if(!validateEmail(email)){
        res.send(error_handling("lahtos email"));
    }
    if(!checkUserIsInList(email)){
        res.send(error_handling("yparxei xristi me auto to email"));
    }
    else{
        db.query("INSERT INTO fellowtraveller.users (name, email, password,phone) VALUES (?,?,?,?)", 
        [name, email,password,phone],(err, result) => {
            if (err || result == 0){
                console.log(err.sqlMessage);
                res.send(error_handling("error"));
            }
		    else{
                res.send(success_handling("succes user add USER WITH NAME ="+name));
            }
        });
    }
});


app.get('/delete/:id',(req,res) => {
    db.query('DELETE FROM users where id = ?',[req.params.id],(err,rows, fields) => {
        if (err)
			res.send('error');
		else
			res.send('Delete succesfully');
    })
});