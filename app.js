const express = require('express');
const mysql = require('mysql');

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


app.post('/adduser/:pr_id/:str_id', (req, res) => {
    
	db.query("INSERT INTO fellowtraveller.users (id, username) VALUES (?,?)", [req.params.pr_id, req.params.str_id],
	(err, result) => {

		if (err || result == 0)
			res.send(error_handling("Could not retrieve prices for the given product or store"));
		else
			res.send(result[0]);

	});
});


app.get('/getuser/:id', (req,res) => {
   db.query('SELECT * FROM fellowtraveller.users where id = ?',[req.params.id],(err,rows,fields) => {
       if(!err){
           res.send(rows);
       }
       else{
           console.log(err);
       }
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
        }
        else{
            console.log(err);
        }
    })
 });