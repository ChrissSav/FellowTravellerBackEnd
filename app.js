const express = require('express');
const mysql = require('mysql');
let error_handling = require('./error_handling');
let success_handling = require('./success_handling');
let class_trip = require('./class_trip');
let class_user = require('./class_user');

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
 
//---------------------Global fuctions-------------------------------------
function validDate(input){
    var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
    if (input.match(reg)) {
        return true;
    }
    else {
        return false;
    }
}

function checkTime(form){
   var v = form.match(/^([01]?[0-9]|2[0-4]):[0-5][0-9]/);
   if (v!==null){
       return true;
   }
    return false;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
async function check(table,key,id){
    try{
        const flag = await checkIfExistInTable(table, key, id);
        return flag;
    }catch (err){
        console.log(err);
    }
}


//=====fuction check if exist in table=============
function checkIfExistInTable(table,key,id){
    const q = "select * from "+table+" where "+key+"="+id;
    //console.log(q)
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
async function SetRateOfRow(table,key,id,stars){
    let str = parseFloat(stars);
    let num1 = await GetRateOfRow(table,key,id);
    let sum ;
    if(num1==0){
        sum = str;
    }
    else{
        sum = (str+num1)/2;
    }
    //console.log(table,key,id);
   // console.log("SetRateOfRow =>"+" str = "+str+ " num1 = "+num1+" sum = "+sum);
    return new Promise((resolve,reject)=>{
        let q = "update "+table+" set rate ="+sum+" where id ="+id;
       // console.log(q);
        db.query(q,(err, result) => {
            if (err || result == 0){
               // console.log(false);
                resolve (false);
            }
            else{
              //  console.log(true);
                resolve (true);
            }
        })
    });
}
async function GetRateOfRow(table,key,id){
    return new Promise((resolve,reject)=>{
        let q ="select rate from "+table+" where "+key+"="+id;
       // console.log("GetRateOfRow-> "+q)
        db.query(q,(err, result) => {
            if (err || result == 0){
                //console.log("result",result)
                resolve (-1);
            }
            else{
               // console.log("result",result)
                resolve (result[0].rate);
            }
        })
    });
}
//---------------------End Global fuctions-------------------------------------


//=======================================================new===================================
//------------------------Users-------------------------------

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

 function getUser(id){
    return new Promise((resolve,reject)=>{
        db.query('Select * from users where email = ?',[id],(error,result) => {
            if(result.length > 0){
                //let data = JSON.parse(result[0]);
              //  let data = JSON.parse(JSON.stringify(result[0]));
              //  console.log(data); 
                resolve(result);
            }
            else{
                console.log(error_handling("There is no user with these elements"));
                resolve("There is no user with these elements");
            }
        })
    });
}

 app.get('/users/:id',async (req,res) => {
    /*db.query('Select * from users where email = ?',[req.params.id],(error,result) => {
        if(result.length > 0){
            //let data = JSON.parse(result[0]);
            let data = JSON.parse(JSON.stringify(result[0]));
            console.log(data); 
            res.send(result);
        }
        else{
            console.log(error_handling("There is no user with these elements"));
            res.send(error_handling("There is no user with these elements"));
        }
    })*/
    try{
        res.send(await getUser(req.params.id))
    }catch(err){
        res.send(error_handling(error))
    }

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



/*app.get('/getUserNumOfTrispOffersFromTable/:id',async (req,res) => {
    try{
        let l = await getUserNumOfTrispOffersFromTable(req.params.id);
        res.send(success_handling(l+""));
    }catch(error){
        res.send(error_handling(error))
    }
    
});*/

/*app.get('/getUserNumOfTrispOffers/:id',async (req,res) => {
    try{
        let l = await getUserNumOfTrispOffers(req.params.id);
        res.send(success_handling(l+""));
    }catch(error){
        res.send(error_handling(error))
    }
    
});*/

function getUserNumOfTripsTakesPartFromTable(user_id){
    return new Promise((resolve,reject)=>{
        let q = "SELECT COUNT(*) count FROM users_and_trips "+
        "WHERE users_and_trips.user_id="+user_id;
            db.query(q,(err, result) => {
                if (err || result == 0){
                   // console.log(false);
                    resolve (0);
                }
                else{
                  //  console.log(true);
                    resolve (result[0].count);
                }
            })

    });
}

function getUserNumOfTrispOffersFromTable(user_id){
    return new Promise((resolve,reject)=>{
        let q = "SELECT COUNT(*) count FROM trips "+
        "WHERE trips.creator_id="+user_id;
            db.query(q,(err, result) => {
                if (err || result == 0){
                   // console.log(false);
                    resolve (0);
                }
                else{
                  //  console.log(true);
                //  console.log(result[0].count)
                    resolve (result[0].count);
                }
            })

    });
}

function getUserNumOfTrispOffers(user_id){
    return new Promise((resolve,reject)=>{
        let q = "SELECT num_of_travels_offered FROM users "+
        "WHERE id="+user_id;
            db.query(q,(err, result) => {
                if (err || result == 0){
                   // console.log(false);
                    resolve (0);
                }
                else{
                  //  console.log(true);
                //  console.log(result[0].count)
                    resolve (result[0].num_of_travels_offered);
                }
            })

    });
}


app.get('/UpdateUserNumOfTripOffer/:id/:num',async (req,res) => {
    try{
        let l = await UpdateUserNumOfTripOffer(req.params.id,req.params.num);
        res.send(success_handling(l+""));
    }catch(error){
        res.send(error_handling(error))
    }
    
});
async function UpdateUserNumOfTripOffer(user_id,num){
    let f = await getUserNumOfTrispOffers(user_id);
    let newnum = (parseInt(num));
    let sum = f + newnum;
    //console.log(parseInt(num))
   // console.log(f +" + "+newnum+" = "+sum);
    return new Promise((resolve,reject)=>{
        let q = "update users set users.num_of_travels_offered = "+sum+
        " where users.id ="+user_id;
            db.query(q,(err, result) => {
                if (err || result == 0){
                    resolve (false);
                }
                else{
                    resolve (true);
                }
            })

    });
}
//======================TripS========================
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
    else if (!checkTime(time_dep)){
        res.send(error_handling("lathos wra anaxwrisis HH:mm"));
    }
    else if (time_arriv==="" || time_arriv===" "){
        res.send(error_handling("keni wra afiskis"));
    }
    else if (!checkTime(time_arriv)){
        res.send(error_handling("lathos wra afiskis HH:mm"));
    }
    else{
        registerTrip(from,to,date,time_dep,time_arriv,creator_id,res);
        //res.send(from+"  "+to+"  "+date+"  "+time_dep+"  "+time_arriv+"  "+creator_id);
    }
    
});


function updateTrippState(state,trip_id){
    let q = "update trips set state="+state+" where id ="+trip_id;
    return new Promise((resolve,reject)=>{
        db.query(q,(err, result) => {
            if (err || result == 0){
                resolve(false);
            }
            else{
                resolve(true);
            } 
        })
    });
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



//==================Rating=====================
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



//=============Trip and Passenger Relationship=======
app.get('/b/:us/:id', async (req ,res) => {
    await AddUserToTrip(req.params.us,req.params.id,res);
});



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

app.get('/tripnum/:id',async  (req ,res) => {
   
    let l = await getTripCurrentNumOfPassenger(req.params.id);
    console.log(l);
    res.send(success_handling(l+""));
});

function getTripCurrentNumOfPassenger(trip_id){
    let num;
    let q = "select current_num from trips where id ="+trip_id;
    return new Promise((resolve,reject)=>{
        db.query(q,(err, result) => {
            if (err || result == 0){
              //  console.log("num = -1;")
                num = -1;
                resolve(num);
            }
            else{
               // console.log("num = result[0].current_num;")
                num = result[0].current_num;
                resolve(num);
            } 
        })
    });
}
app.get('/tripnumincrease/:id',async  (req ,res) => {
    let l = await IncreaseCurrentNumOFTrip(req.params.id);
    console.log("l = "+l);
    res.send(success_handling(l+""));
});
async function IncreaseCurrentNumOFTrip(trip_id){
    let num = await getTripCurrentNumOfPassenger(trip_id)+1;
   // console.log("num ="+num);
    return new Promise((resolve,reject)=>{
        db.query("update trips set current_num =? where id =?",[num,trip_id],(err, result) => {
            if (err || result == 0){
               // console.log(false);
                resolve (false);
            }
            else{
              //  console.log(true);
                resolve (true);
            }
        })
    });
}
//===============================================
app.get('/tripnumdincrease/:id',async  (req ,res) => {
    let l = await DincreaseCurrentNumOFTrip(req.params.id);
    console.log("l = "+l);
    res.send(success_handling(l+""));
});

async function DincreaseCurrentNumOFTrip(trip_id){
    let num = await getTripCurrentNumOfPassenger(trip_id)-1;
   // console.log("num ="+num);
    return new Promise((resolve,reject)=>{
        db.query("update trips set current_num =? where id =?",[num,trip_id],(err, result) => {
            if (err || result == 0){
               // console.log(false);
                resolve (false);
            }
            else{
              //  console.log(true);
                resolve (true);
            }
        })
    });
}
//===========================================f
app.get('/gettrip/:id',async  (req ,res) => {
    try{
        console.log("mpike me "+req.params.id);
        var trip = await getTrip(req.params.id);
        trip = JSON.parse(JSON.stringify(trip[0]));
        trip = new class_trip(trip);
        var users = await getUsersOfTrip(req.params.id);
        var creator = await getTripCreator(req.params.id);
        creator = JSON.parse(JSON.stringify(creator));
        users = JSON.parse(JSON.stringify(users));
        trip.setPassengers(users);
        trip.setCreator(creator);
        var v = [];
        v.push(trip);
        res.send(v);
    
    }catch (err){
        console.log(err)
        res.send(error_handling(err+""));
    }
});


app.get('/gettrips',async  (req ,res) => {
    try {
        var teliko=[];
        var trips = await getTrips();
        trips = JSON.parse(JSON.stringify(trips));
        var numOfTrips = await getNumOfTrips();
        var i =0;
        for (var i = 0; i < numOfTrips; i++) {
            var currentTrip = new class_trip(trips[i]);
            var creator = await getTripCreator(trips[i].id);
            creator = JSON.parse(JSON.stringify(creator));
            var users = await getUsersOfTrip(trips[i].id);
            users = JSON.parse(JSON.stringify(users));
            currentTrip.setPassengers(users);
            currentTrip.setCreator(creator);
            teliko.push(currentTrip);
        }
        res.send(teliko);
    } catch (error) {
        res.send(error_handling(error+""));
    }
});

function getNumOfTrips(){
     return new Promise((resolve,reject)=>{
         let q ="select count(*) count from trips ";
         db.query(q,(err, result) => {
             if (err || result == 0){
                resolve (err);
             }
             else{
                num = JSON.parse(JSON.stringify(result[0])).count;
                resolve (num);
             }
         })
     });
 }

function getTrips(){
    // console.log("num ="+num);
     return new Promise((resolve,reject)=>{
         let q ="select * from trips ";
         db.query(q,(err, result) => {
             if (err || result == 0){
                resolve (err);
             }
             else{
                resolve (result);
             }
         })
     });
 }

function getTrip(trip_id){
   // console.log("num ="+num);
    return new Promise((resolve,reject)=>{
        let q ="select ffrom ,tto ,date_departure ,time_departure ,time_arrivals,"+
        "description,max_seats,current_num,num_of_bags,num_of_suitcase,rate,state from trips where id ="+trip_id;
        db.query(q,(err, result) => {
            if (err || result == 0){
                resolve (err);
            }
            else{
                resolve (result);
            }
        })
    });
}



function getTripCreator(trip_id){
    // console.log("num ="+num);
     return new Promise((resolve,reject)=>{
         let q ="select fellowtraveller.users.* "+
         "from fellowtraveller.users join fellowtraveller.trips "+
         "on fellowtraveller.users.id = fellowtraveller.trips.creator_id"+
         " where fellowtraveller.trips.id="+trip_id;
         db.query(q,(err, result) => {
             if (err || result == 0){
                resolve (err);
             }
             else{
                resolve (result);
             }
         })
     });
 }
//===============================================
app.get('/setrateoftrip/:id/:rate', async(req ,res) => {
    let l = await  SetRateOfRow("trips","id",req.params.id,req.params.rate);
    res.send(success_handling(l+""));
});

//===============================================
app.get('/getrateoftrip/:id/',async  (req ,res) => {
    let l = await GetRateOfRow("trips","id",req.params.id);
    //console.log("l = "+l);
    res.send(success_handling(l+""));
});
//------------------------------------------------
app.get('/getusersoftrip/:id/',async  (req ,res) => {
    let l = await getUsersOfTrip(req.params.id);
   // getUsersOfTrip(req.params.id,res);
    //console.log("l = "+l);
    res.send(l);
    //res.send(success_handling("dgfgfregr"));
});
async function getUsersOfTrip(trip_id){
    if(!await checkIfExistInTable("trips","id",trip_id)){
        return error_handling("current trip does't exist")
    }else{
        return new Promise((resolve,reject) => {
            let q = "select users.* "+
            "from users join users_and_trips on users.id = users_and_trips.user_id"+
            " where users_and_trips.trip_id = "+trip_id;
            db.query(q,(err, result) => {
                if (err || result == 0){
                   // console.log(false);
                    resolve (error_handling("0"));
                }
                else{
                  //  console.log(true);
                    resolve (result);
                }
            })
        });
    } 
}
//===============================================
//==================Rating=====================
app.get('/rate/:user_id/:target_id/:num_of_stars/:type',async (req ,res) => {
    
    let user_id = req.params.user_id;
    let target_id = req.params.target_id;
    let num_of_stars = req.params.num_of_stars;
    let type = req.params.type;
    try{
        if(user_id===" " || user_id===""){
            res.send(error_handling("keno user_id"));
        }
        else if(isNaN(user_id)){
            res.send(error_handling("to user_id den einai arithmos"));
        }
        else if(target_id===" " || target_id===""){
            res.send(error_handling("keno target_id "));
        }
        else if(isNaN(target_id)){
            res.send(error_handling("To target_id den einai arithmos"));
        }
        else if(num_of_stars==="" || num_of_stars===" "){
            res.send(error_handling("keno pedio num_of_stars"));
        }
        else if(type!=1 && type!=2){
            res.send(error_handling("lathos pedio type"));
        }
        else if (!await checkIfExistInTable("users","id",user_id)){
            res.send(error_handling("den yparxei user me ayto o id"));
        }
        else{
            if(type==1){
                //console.log("type 1= "+type);
                if(user_id==target_id){
                    res.send(error_handling("user_id==target_id"));
                }
                else if(!await checkIfExistInTable("users","id",target_id)){
                    res.send(error_handling("den yparxei user_id me ayto o id"));
                }
                else{
                    res.send(success_handling("mpompes"));
                }
            }
            else if (type==2){
               // console.log("type 2= "+type);
                if(!await checkIfExistInTable("trips","id",target_id)){
                    res.send(error_handling("den yparxei target_id me ayto o id"));
                }
                else{
                    res.send(success_handling("mpompes"));
                }
            }
        }
    }catch(error){
        res.send(error_handling(error));
    }
});



//Rates

// Δοκιμαστικό Commit
function registerRate(user_id,target_id,num_of_stars,type,res){
    db.query("INSERT INTO ratings (user_id, target_id, num_of_stars,type) VALUES (?,?,?,?)", 
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