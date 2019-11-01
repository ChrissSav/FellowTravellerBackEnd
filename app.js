const express = require('express');
const mysql = require('mysql');
let error_handling = require('./error_handling');

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
    res.send("ΡΕ Η εφαρμογη θα γινει ρεεεεεε");
});

app.post('api/adduser', (req,res) => {
    let post = 'ggrg';
    let sql = 'Insert into users set ?';
    let queri = db.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post ok');
    })
});




app.get('/api/getuser/:id', (req, res) => {
	db.query('SELECT * FROM fellowtraveller.users where id = ?',[req.params.id],(err, result) => {

		if (err || result == 0)
			res.send(error_handling("Could not retrieve prices for the given product or store"));
		else
			res.send(result);

	});
});

app.get('/delete/:id',(req,res) => {
    db.query('DELETE FROM fellowtraveller.users where id = ?',[req.params.id],(err,rows, fields) => {
        if (err)
			res.send('error');
		else
			res.send('Delete succesfully');
    })
});


app.get('/getusers', (req,res) => {
    db.query('SELECT * FROM fellowtraveller.users ',(err,rows,fields) => {
        if(!err){
            res.send(rows);
            console.log("/getusers");
           
        }
        else{
            console.log(err);
        }
    })
 }); 
 

 app.get('/getuser/:id',(req,res) => {
    db.query('Select * from fellowtraveller.users where email = ?',[req.params.id],(error, result) => {
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



app.get('/adduser/:name/:email/:password', (req, res) => { 
	db.query("INSERT INTO fellowtraveller.users (name, email, password) VALUES (?,?,?)", [req.params.name, req.params.email,req.params.password],
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
});
