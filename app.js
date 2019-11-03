const express = require('express');
const mysql = require('mysql');
let error_handling = require('./error_handling');
let success_handling = require('./success_handling');

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
app.get('/getusers', (req,res) => {
    db.query('SELECT * FROM users ',(err,rows,fields) => {
        if(!err){
            res.send(rows);
            console.log("/getusers");        
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
    db.query("INSERT INTO users (name, email, password,phone) VALUES (?,?,?,?)", 
    [req.params.name, req.params.email,req.params.password,req.params.phone],
	(err, result) => {
        if (err || result == 0){
            res.send(error_handling("error"));
            console.log(err);
        }
		else{
            res.send(result);
            console.log(result);
        }
    });
    //var result = req.params.name+"     "+req.params.email+"     "+req.params.password;
   // res.send(result);
});


app.get('/delete/:id',(req,res) => {
    db.query('DELETE FROM users where id = ?',[req.params.id],(err,rows, fields) => {
        if (err)
			res.send('error');
		else
			res.send('Delete succesfully');
    })
});