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
    res.send("Καλώ ήρθατε στο Api του FellowTraveller");
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




app.get('/users', (req,res) => {
    db.query('SELECT * FROM users ',(err,result) => {
        if (err || result == 0){
            res.send(error_handling("Error to get users"));
        }
        else{
            res.send(result);
        }
    })
 }); 



 app.get('/users/:id',(req,res) => {
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
    })
});



app.get('/users/:name/:email/:password/:phone', (req, res) => { 
    let name = req.params.name;
    let password = req.params.password;
    let email = req.params.email;
    let phone = req.params.phone;
    AddUserr(name,email,password,phone,res);
});

async function AddUserr(name,email,password,phone,res){
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
    else if(await check("users","email",email)){
        res.send(error_handling("yparxei xristi me auto to email"));
    }
    else{
        db.query("INSERT INTO users (name, email, password,phone) VALUES (?,?,?,?)", 
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
}
app.delete('/users/:id',(req,res) => {
    db.query('DELETE FROM users where id = ?',[req.params.id],(err,rows, fields) => {
        if (err)
			res.send('error');
		else
			res.send('Delete succesfully');
    })
});

//======================trip========================
app.get('/trips/:from/:to/:date/:time_dep/:time_arriv/:creator_id/', (req ,res) => {
    let from = req.params.from;
    let to = req.params.to;
    let date = req.params.date;
    let time_dep = req.params.time_dep;
    let time_arriv = req.params.time_arriv;
    let creator_id = req.params.creator_id;
    //console.log("from = "+from+"  legth = "+from.length);
    //console.log("to = "+to+"  legth = "+to.length);

    if(from===" "){
        res.send(error_handling("keni apo"));
    }
    else if(to===" "){
        res.send(error_handling("keni pros "));
    }
    else if(date==="" || date===" "){
        res.send(error_handling("keni hmerominia"));
    }
    else if(!validDate(date)){
        res.send(error_handling("lathos imerominia prepei dd-mm-yyyy"));
    }
    else if (time_dep==="" || time_dep===" "){
        res.send(error_handling("keni wra anaxwrisis"));
    }
    else if (!checkForm(time_dep)){
        res.send(error_handling("lathos wra anaxwrisis HH:mm"));
    }
    else if (time_arriv==="" || time_arriv===" "){
        res.send(error_handling("keni wra afiskis"));
    }
    else if (!checkForm(time_arriv)){
        res.send(error_handling("lathos wra afiskis HH:mm"));
    }
    else{
        registerTrip(from,to,date,time_dep,time_arriv,creator_id,res);
        //res.send(from+"  "+to+"  "+date+"  "+time_dep+"  "+time_arriv+"  "+creator_id);
    }
    
});

function validDate(input){
    var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
    if (input.match(reg)) {
        return true;
    }
    else {
        return false;
    }
}

function checkForm(form){
   var v = form.match(/^([01]?[0-9]|2[0-4]):[0-5][0-9]/);
   if (v!==null){
       return true;
   }
    return false;
}



function registerTrip(from,to,date,time_dep,time_arriv,creator_id,res){
    db.query("INSERT INTO trips (ffrom, tto, date_departure,time_depsrture,time_arrivals,creator_id) VALUES (?,?,?,?,?,?)", 
        [from, to,date,time_dep,time_arriv,creator_id],(err, result) => {
            if (err || result == 0){
                console.log(error_handling("Error in add trip"));
                res.send(error_handling("error"));
            }
		    else{
                res.send(success_handling("succes add trip"));
            }
    });
}


function registerRate(user_id,target_id,num_of_stars,type,res){
    db.query("INSERT INTO reating (user_id, target_id, num_of_stars,type) VALUES (?,?,?,?)", 
        [user_id, target_id,num_of_stars,type],(err, result) => {
            if (err || result == 0){
                console.log(error_handling("Error in add rating"));
                res.send(error_handling("error"));
            }
		    else{
                res.send(success_handling("succes rating"));
            }
    });
}
//==================RAting=====================
app.get('/trips/:user_id/:target_id/:num_of_stars/:type', (req ,res) => {
    let user_id = req.params.user_id;
    let target_id = req.params.target_id;
    let num_of_stars = req.params.num_of_stars;
    let type = req.params.type;

    if(user_id===" " || user_id===""){
        res.send(error_handling("keno user_id"));
    }
    else if(!isNaN(user_id)){
        res.send(error_handling("to user_id den einai arithmos"));
    }
    else if(target_id===" " || target_id===""){
        res.send(error_handling("keno target_id "));
    }
    else if(!isNaN(target_id)){
        res.send(error_handling("To target_id den einai arithmos"));
    }
    else if(num_of_stars==="" || num_of_stars===" "){
        res.send(error_handling("keno pedio num_of_stars"));
    }
    else if(type==="" || type===" "){
        res.send(error_handling("keno pedio type"));
    }
    else{
        registerRate(user_id,target_id,num_of_stars,type,res);
       // res.send(user_id+"  "+target_id+"  "+num_of_stars+"  "+type);
    }
});

//=====fuction check if exist in table=============
function checkIfExistInTable(table,key,id){
    const q = "select * from "+table+" where "+key+"="+id;
   // console.log(q)
    return new Promise((resolve,reject)=>{
        db.query(q, function (err, result) {
            if (err  || result.length==0){ 
                resolve (false);
            }else{ 
                resolve(true);
            } 
        })
    })
}

//=============Trip and Passenger Relationship=======
app.get('/b/:us/:id', async (req ,res) => {
    await AddUserToTrip(req.params.us,req.params.id,res);
});

async function check(table,key,id){
    try{
        const flag = await checkIfExistInTable(table, key, id);
        return flag;
    }catch (err){
        console.log(err);
    }
    
}

async function AddUserToTrip(user_id,trip_id,res){
    
    try{
      //  console.log(user_id,trip_id);
        const res1 = await checkIfExistInTable("users", "id", user_id);
       /// console.log("res1 = "+res1);
        if (res1==false){
           // console.log(error_handling("Erro in user_id"));
            res.send(error_handling("Erro in user_id"));
        }
        else{
            const res2 = await checkIfExistInTable("trips", "id", trip_id);
           // console.log("res2 = "+res2);
            if(res2==false){
             //   console.log(error_handling("Erro in trip_id"));
                res.send(error_handling("Erro in trip_id"));
            }
            else{
             //   console.log(success_handling("Secces"));
                res.send(success_handling("Succes"));
            }
        }  
    }catch (err){
        console.log(err);
    }
    
}
function getTripCurrentNumOfPassenger(trip_id){
    let num = 0;
    db.query("select current_num from trips where id = ?",[trip_id],(err, result) => {
        if (err || result == 0){
            num = -1;
        }
        else{
            num = result[0].current_num;
        }
    });
    return num;
}

function UpdateCurrentNumOFTrip(trip_id){
    let num = getTripCurrentNumOfPassenger(trip_id);
    db.query("update trips set current_num =? where id =?",[num,trip_id],(err, result) => {
        if (err || result == 0){
            return false;
        }
        else{
            return true;
        }
    });
}


