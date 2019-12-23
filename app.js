const express = require('express');
const mysql = require('mysql');
let error_handling = require('./error_handling');
let success_handling = require('./success_handling');
let class_trip = require('./class_trip');
let class_notification = require('./class_notification');


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
              //  console.log(error_handling("There is no user with these elements"));
                resolve("There is no user with these elements");
            }
        })
    });
}

function getUserById(id){
    return new Promise((resolve,reject)=>{
        db.query('Select * from users where id = ?',[id],(error,result) => {
            if(result.length > 0){
                //let data = JSON.parse(result[0]);
              //  let data = JSON.parse(JSON.stringify(result[0]));
              //  console.log(data); 
                resolve(result);
            }
            else{
              //  console.log(error_handling("There is no user with these elements"));
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



app.get('/getuserauth/:email/:pass',async (req,res) => {
    try{
        res.send(await getUserAuth(req.params.email,req.params.pass))
    }catch(err){
        res.send(error_handling(error))
    }

});

function getUserAuth(email,password){
    return new Promise((resolve,reject)=>{
        db.query("select * from users where email = ? and password = ?", 
        [email,password],(err, result) => {
            if (err || result == 0){             
                resolve(error_handling('error'));
            }
		    else{
                resolve(result[0]);
            }
        })
    }); 
}




app.get('/registeruser/:name/:birthday/:email/:password/:phone', async (req, res) => { 
    let name = req.params.name;
    let birthday = req.params.birthday;
    let password = req.params.password;
    let email = req.params.email;
    let phone = req.params.phone;
    try {
        
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
        else if (await RegisterUser(name,birthday,email,password,phone)){
            res.send(success_handling(await getUserid(email)));
        }else{
            res.send(error_handling("υπαρχει ηδη λογαριασμος με αυτο το μαιλ"));
        }
    } catch (error) {
        res.send(error_handling(error+""));
    }
});

function getUserid(email){
    return new Promise((resolve,reject)=>{
        db.query("select id drom users where email= ?", 
        [email],(err, result) => {
            if (err){
                resolve(0);
            }
		    else{
                resolve(result.id);
            }
        })
    });
}
function RegisterUser(name,birthday,email,password,phone){
    return new Promise((resolve,reject)=>{
        db.query("INSERT INTO users (name,birthday, email, password,phone) VALUES (?,?,?,?,?)", 
        [name,birthday,email,password,phone],(err, result) => {
            if (err){
                resolve(false);
            }
		    else{
                resolve(true);
            }
        })
    });    
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
app.get('/trips/:from/:to/:date/:time/:creator_id/:description/:max_seats/:max_bags/:price', async(req ,res) => {
    let from = req.params.from;
    let to = req.params.to;
    let date = req.params.date;
    let time = req.params.time;
    let creator_id = req.params.creator_id;
    let description = req.params.description;
    let max_seats = req.params.max_seats;
    let max_bags = req.params.max_bags;
    let price = req.params.price;
    //console.log("to = "+to+"  legth = "+to.length);

   /* if(from===" "){
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
    else if (time==="" || time===" "){
        res.send(error_handling("keni wra anaxwrisis"));
    }
    else if (!checkTime(time_dep)){
        res.send(error_handling("lathos wra anaxwrisis HH:mm"));
    }
    else if (!checkTime(time_arriv)){
        res.send(error_handling("lathos wra afiskis HH:mm"));
    }
    else{
        if(await registerTrip(from,to,creator_id,description,max_seats,max_bags,max_suitcases)){
            res.send(success_handling("success"));
        }
        else{
            res.send(success_handling("success"));
        }
    }*/
    if(await registerTrip(from,to,date,time,creator_id,description,max_seats,max_bags,price)){
        res.send(success_handling(1,"success"));
        //console.log(success_handling(1,"success"))
    }
    else{
      //  console.log(success_handling(2,"error"))
        res.send(error_handling(2,"error"));
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

function registerTrip(from,to,date,time,creator_id,description,max_seats,max_bags,price){
    return new Promise((resolve,reject)=>{
        date = ChangeFromat(date);
        db.query("insert into trips (ffrom,tto,date,time,creator_id,description,max_seats,max_bags,price) VALUES (?,?,?,?,?,?,?,?,?)", 
            [from,to,date,time,creator_id,description,max_seats,max_bags,price],(err, result) => {
                if (err || result == 0){
                    console.log(err)
                    resolve(false);
                }
                else{
                    resolve(true);
                }
        })
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
    //console.log(l);
    res.send(success_handling(l+""));
});
function getTripCurrentNumOfPassenger(trip_id){
    let num;
    let q = "select current_num_of_seats from trips where id ="+trip_id;
    return new Promise((resolve,reject)=>{
        db.query(q,(err, result) => {
            if (err || result == 0){
                num = -1;
                resolve(num);
            }
            else{
                num = result[0].current_num_of_seats;
                resolve(num);
            } 
        })
    });
}

async function IncreaseCurrentNumPassengersOFTrip(trip_id){
    let num = await getTripCurrentNumOfPassenger(trip_id)+1;
   // console.log("num ="+num);
    return new Promise((resolve,reject)=>{
        db.query("update trips set current_num_of_seats =? where id =?",[num,trip_id],(err, result) => {
            if (err || result == 0){
                console.log(err);
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
    res.send(success_handling(l+""));
});
app.get('/tripnumdincrease/:id',async  (req ,res) => {
    let l = await DincreaseCurrentNumOFTrip(req.params.id);
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
app.get('/gettripbyfilter/:from/:to',async  (req ,res) => {
    //console.log("gettripbyfilter");
    let l = await getTripByfilter(req.params.from,req.params.to);
    if (l==0){
        res.send([]);
       // console.log("teliko : "+0);
    }
    else{
        var teliko=[];
        var trips = l;
        trips = JSON.parse(JSON.stringify(trips));
        for (var i = 0; i <trips.length; i++) {
            var currentTrip = new class_trip(trips[i]);
            var creator = await getTripCreator(trips[i].id);
            creator = JSON.parse(JSON.stringify(creator[0]));
            var users = await getPassengersOfTrip(trips[i].id);
            users = JSON.parse(JSON.stringify(users));
            currentTrip.setPassengers(users);
            currentTrip.setCreator(creator);
            teliko.push(currentTrip);
        }
      //  console.log("teliko : "+teliko);
        res.send(teliko);
    }
});
function getTripByfilter(from,to){
    return new Promise((resolve,reject)=>{
        let q = "select trips.* from trips left join users_and_trips on trips.id = users_and_trips.trip_id "+
        " where (trips.ffrom like '%"+from+"%' and trips.tto like '%"+to+"%') AND users_and_trips.trip_id is null "+
        " and trips.id NOT IN  (select trips.id from trips left join request"+
        "         on trips.id = request.trip_id where request.trip_id = request.trip_id );";
        //let q = "select * from trips where ffrom = "+from+" and tto =  "+to;
        //db.query("select * from trips where ffrom = ? and tto = ? ",[from,to],(err, result) => {
        db.query(q,(err, result) => {
            if (err || result == 0){
                resolve (0);
            }
            else{
                resolve (result);
            }
        })
    });
}



app.get('/gettrip/:id',async  (req ,res) => {
    try{
        var trip = await getTrip(req.params.id);
        trip = JSON.parse(JSON.stringify(trip[0]));
        trip = new class_trip(trip);
        var users = await getPassengersOfTrip(req.params.id);
        var creator = await getTripCreator(req.params.id);
        creator = JSON.parse(JSON.stringify(creator[0]));
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
            creator = JSON.parse(JSON.stringify(creator[0]));
            var users = await getPassengersOfTrip(trips[i].id);
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





app.get('/gettripstakespart/:user_id',async  (req ,res) => {
    try {
        var id = req.params.user_id;
        var teliko=[];
        var trips = await getTripsTakePart(id);
        trips = JSON.parse(JSON.stringify(trips));
        for (var i = 0; i < trips.length; i++) {
            var currentTrip = new class_trip(trips[i]);
            var creator = await getTripCreator(trips[i].id);
            creator = JSON.parse(JSON.stringify(creator[0]));
            var users = await getPassengersOfTrip(trips[i].id);
            users = JSON.parse(JSON.stringify(users));
            currentTrip.setPassengers(users);
            currentTrip.setCreator(creator);
            var date = currentTrip.getDate();
            date = ChangeFromat(date);
            currentTrip.setDate(date);
            teliko.push(currentTrip);
        }
        res.send(teliko);
    } catch (error) {
        res.send(error_handling(error+""));
    }
});




function getTripsTakePart(id){
    return new Promise((resolve,reject)=>{
        let q ="select trips.* from users_and_trips "+
        " join trips on users_and_trips.trip_id = trips.id "+
        " where users_and_trips.user_id= "+id;
        db.query(q,(err, result) => {
            if (err || result == 0){
               resolve ([]);
            }
            else{
                resolve(result)
            }
        })
    });
}
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
    return new Promise((resolve,reject)=>{
        let q ="select ffrom ,tto ,date,time,"+
        "description,max_seats,current_num_of_seats,current_num_of_bags,max_bags,"+
        "rate,state from trips where id ="+trip_id;
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
     return new Promise((resolve,reject)=>{
         let q ="select users.id,users.name,users.rate,users.num_of_travels_offered, users.num_of_travels_takespart  "+
         "from users join trips "+
         "on users.id = trips.creator_id"+
         " where trips.id="+trip_id;
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
    res.send(success_handling(l+""));
});
//------------------------------------------------
app.get('/getpassengersoftrip/:id/',async  (req ,res) => {
    let l = await getPassengersOfTrip(req.params.id);
   // getUsersOfTrip(req.params.id,res);
    res.send(l);
    //res.send(success_handling("dgfgfregr"));
});
async function getPassengersOfTrip(trip_id){
    if(!await checkIfExistInTable("trips","id",trip_id)){
        return error_handling("current trip does't exist")
    }else{
        return new Promise((resolve,reject) => {
            let q = "select users.id,users.name,users.rate,users.num_of_travels_offered, users.num_of_travels_takespart "+
            "from users join users_and_trips on users.id = users_and_trips.user_id"+
            " where users_and_trips.trip_id = "+trip_id;
            db.query(q,(err, result) => {
                if (err || result == 0){
                   // console.log(false);
                    resolve ([]);
                }
                else{
                  //  console.log(true);
                    resolve (result);
                }
            })
        });
    } 
}
//ProsforesFragment

app.get('/getUserTrips/:id/',async  (req ,res) => {
    var id = req.params.id;
    let trips = await getTripsOfUser(id);
    if(trips==0){
        res.send([])
    }else{
        var teliko=[];
        trips = JSON.parse(JSON.stringify(trips));
        for (var i = 0; i <trips.length; i++) {
            var requests = await GetRequestOfTrip(trips[i].id);
            requests = JSON.parse(JSON.stringify(requests));
            var currentTrip = new class_trip(trips[i]);
            var date = currentTrip.getDate();
            date = ChangeFromat(date);
            currentTrip.setDate(date);
            var creator = await getTripCreator(trips[i].id);
            creator = JSON.parse(JSON.stringify(creator[0]));
            var users = await getPassengersOfTrip(trips[i].id);
            users = JSON.parse(JSON.stringify(users));
            currentTrip.setPassengers(users);
            currentTrip.setCreator(creator);
            if(requests==0){
                requests=[];
            }
            delete currentTrip.creator_id;
            currentTrip.setRequests(requests)
            teliko.push(currentTrip);
        }
        res.send(teliko);
    }
});


async function getTripsOfUser(user_id){
   // if(!await checkIfExistInTable("trips","id",trip_id)){
   //     return error_handling("current trip does't exist")
   // }else{
        return new Promise((resolve,reject) => {
            let q = "select * from trips where creator_id ="+user_id;
            db.query(q,(err, result) => {
                if (err || result == 0){
                   // console.log(false);
                    resolve (0);
                }
                else{
                  //  console.log(true);
                    resolve (result);
                }
            })
        });
   // } 
}


app.get('/registerrequesttotrip/:user_id/:target_id/:trip_id',async  (req ,res) => {
    var user_id = req.params.user_id;
    var trip_id = req.params.trip_id;
    var target_id = req.params.target_id;

    let flag = await RegisterUserToTrip(user_id,target_id,trip_id);
    if (flag){
        res.send(success_handling("success"));
    }
    else{
        res.send(error_handling("error_handling"));
    }
});

function RegisterPassengerToTrip(user_id,trip_id){
   return new Promise((resolve,reject) => {
        let q = "insert into users_and_trips (user_id,trip_id) VALUES ("+user_id+","+trip_id+" )";
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

//Register to Trip
async function RegisterUserToTrip(user_id,target_id,trip_id){
    // register requst
    try{
        let register_status = await RegisterRequest(user_id,trip_id);
        
        if (register_status==1){
          //  console.log("register_status : "+register_status)
            //send notifcation  makis
            let notification_status = await RegisterNotification(target_id,user_id,trip_id);
            if (notification_status){
              //  console.log("notification_status true ")
                return true;
            }else{
                return false;
            }     
        }
        return false;
    }catch(err){
        console.log("error catch : "+register_status)
    }
}
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

function registerRate(user_id,target_id,num_of_stars,type,res){
    db.query("INSERT INTO ratings (user_id, target_id, num_of_stars,type) VALUES (?,?,?,?)", 
        [user_id, target_id,num_of_stars,type],(err, result) => {
            if (err || result == 0){
                res.send(error_handling("error"));
            }
		    else{
                res.send(success_handling("succes rating"));
            }
    });
}

//request


app.get('/registerrequest/:creator_id/:trip_id',async  (req ,res) => {
    let creator_id = req.params.creator_id;
    let target_id = req.params.target_id;
    let status = await RegisterRequest(creator_id,trip_id);

    if (status == 1){
        res.send(success_handling("success"));
    }else{
        res.send(error_handling("error"));
    }
});
function RegisterRequest(creator_id,target_id){
    
    console.log("RegisterRequest "+"cr: "+ creator_id+" targ : "+target_id)
    return new Promise((resolve,reject)=>{
        db.query("insert into request (creator_id,trip_id) VALUES (?,?) ",[creator_id,target_id],(err, result) => {
            if (err || result == 0){
                console.log(err)
                resolve (-1);
            }
            else{
                resolve (1);
            }
        })
    });
}

async function RegRequestTotrip(){

}

app.get('/changerequeststatus/:user_id/:trip_id/:status',async  (req ,res) => {
    let st = req.params.status;
    let trip_id = req.params.trip_id;
    let user_id = req.params.user_id;
    let status = await ChangeRequestStatus(user_id,trip_id,st);
    if (status == 1){
        if(st=="accept"){
            //takis
            if (await RegisterPassengerToTrip(user_id,trip_id)){
                 if(await IncreaseCurrentNumPassengersOFTrip(trip_id))
                    res.send(success_handling("success"));
                else
                    res.send(error_handling("error"));
            }else{
                res.send(error_handling("error"));
            }
        }
    }else{
        res.send(error_handling("error"));
    }
});
function ChangeRequestStatus(user_id,trip_id,status){
    return new Promise((resolve,reject)=>{
        db.query("update  request set status = ? where creator_id = ? and trip_id = ?",[status,user_id,trip_id],(err, result) => {
            if (err || result == 0){
                console.log(err)
                resolve (-1);
            }
            else{
                resolve (1);
            }
        })
    });
}



app.get('/getrequest/:trip_id',async  (req ,res) => {
    var id = req.params.trip_id;
    let l = await GetRequestOfTrip(id);
    if (l==0){
        res.send([]);
    }
    else{
        res.send(l);
    }
});


function GetRequestOfTrip(id){
    return new Promise((resolve,reject)=>{
        let q = "select users.id,users.name,users.rate,users.num_of_travels_offered, users.num_of_travels_takespart from users join request"+
            " on users.id = request.creator_id where  request.status = 'stand_by' and request.trip_id = "+id;
        db.query(q,(err, result) => {
            if (err || result == 0){
                resolve (0);
            }
            else{
                resolve (result);
            }
        })
    });
}




//========================Notification=================

//Register
app.get('/registernotification/:target_id/:user_id/:trip_id',async  (req ,res) => {
    let status = await RegisterNotification(req.params.target_id,req.params.user_id,req.params.trip_id);
    if (status){
        res.send(success_handling("success"));
    }else{
        res.send(error_handling("error"));
    }
});
function RegisterNotification(target_id,user_id,trip_id){
    return new Promise((resolve,reject)=>{
        db.query("insert into notification (target_id,user_id,trip_id) values (?,?,?)",
        [target_id,user_id,trip_id],(err, result) => {
            if (err || result == 0){
                resolve (false);
                console.log(err)
            }
            else{
                resolve (true);
            }
        })
    });
}

//ChangeStatus
app.get('/changestatusnotification/:id',async  (req ,res) => {
    let status = await ChangeStatusNotification(req.params.id);
    if (status){
        res.send(success_handling("success"));
    }else{
        res.send(error_handling("error"));
    }
});
function ChangeStatusNotification(id){
    return new Promise((resolve,reject)=>{
        db.query("update notification set status = 'read' where id = ?",
        [id],(err, result) => {
            if (err || result == 0){
                resolve (false);
            }
            else{
                resolve (true);
            }
        })
    });
}


//Send Notification Item

app.get('/getnotification/:target_id',async  (req ,res) => {
    var id = req.params.target_id;
    let l = await GetNotificationOfUser(id);
    if (l==0){
        res.send(error_handling(""));
    }
    else{
        var teliko=[];
        var notification = l;
        notification = JSON.parse(JSON.stringify(notification));
         for (var i = 0; i<notification.length; i++) {
            var currentNotification = new class_notification(notification[i]);
            var current_trip = await getTripN(notification[i].trip_id);
            var user = await getUserById(notification[i].user_id)
            currentNotification.setUser(user[0])
            current_trip = new class_trip(current_trip[0])
            var date = current_trip.getDate();
            date = ChangeFromat(date);
            current_trip.setDate(date);
            var creator = await getTripCreator(notification[i].trip_id);
            creator = JSON.parse(JSON.stringify(creator[0]));
            var passengers = await getPassengersOfTrip(notification[i].trip_id);
            passengers = JSON.parse(JSON.stringify(passengers));
            current_trip.setPassengers(passengers);
            current_trip.setCreator(creator);
            var requests = await GetRequestOfTrip(notification[i].trip_id);
            requests = JSON.parse(JSON.stringify(requests));
            if(requests==0){
                requests=[];
            }        
            current_trip.setRequests(requests);
            delete current_trip.creator_id;
            currentNotification.setTrip(current_trip)
            teliko.push(currentNotification);
        }
        res.send(teliko);
    }
});

function getTripN(trip_id){
    return new Promise((resolve,reject)=>{
        let q ="select id,ffrom ,tto ,date,time,"+
        "description,max_seats,current_num_of_seats,current_num_of_bags,max_bags,creator_id,"+
        "rate,state,price from trips where id ="+trip_id;
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
function GetNotificationOfUser(id){
    return new Promise((resolve,reject)=>{
        db.query("select * from notification where target_id = ? and status='true'",
        [id],(err, result) => {
            
            if (err || result == 0){
                resolve (0);
            }
            else{
                resolve (result);
            }
        })
    });
}

function getUserById(id){
    return new Promise((resolve,reject)=>{
        db.query('Select id,name,rate,num_of_travels_offered,num_of_travels_takespart from users where id = ?',[id],(error,result) => {
            if(result.length > 0){
                //let data = JSON.parse(result[0]);
              //  let data = JSON.parse(JSON.stringify(result[0]));
              //  console.log(data); 
                resolve(result);
            }
            else{
              //  console.log(error_handling("There is no user with these elements"));
                resolve("There is no user with these elements");
            }
        })
    });
}



app.get('/getTripsFilter/:from/:to/:date_from/:date_to/:time_from/:time_to/:seats_min/:seats_max/:bags_min/:bags_max/' +
':rate_min/:rate_max/:price_min/:price_max/:id',async  (req ,res) => {

        var list = [];
        let id = req.params.id;
        list.push(req.params.from);
        list.push(req.params.to);
        list.push(req.params.date_from);
        list.push(req.params.date_to); 
        list.push(req.params.time_from);
        list.push(req.params.time_to);
        list.push(req.params.seats_min);
        list.push(req.params.seats_max);
        list.push(req.params.bags_min);
        list.push(req.params.bags_max);
        list.push(req.params.rate_min);
        list.push(req.params.rate_max);
        list.push(req.params.price_min);
        list.push(req.params.price_max);
    
        var list2 = []
        for (var i=0; i<list.length; i++){
            switch(i) {
                case 0:                   
                    if(list[i]!=0){
                        list2.push("ffrom like '%"+list[i]+"%'");
                    }
                  break;
                case 1:
                    if(list[i]!=0){
                        list2.push("+tto like '%"+list[i]+"%'");
                    }
                    break;
                case 2:
                    if(list[i]!=0){
                        list2.push("+date >= '"+ChangeFromat(list[i])+"'");
                    }
                    break;
                case 3:
                    if(list[i]!=0){
                        list2.push("+date <= '"+ChangeFromat(list[i])+"'");
                    }
                    break;
                case 4:
                    if(list[i]!=0){
                        list2.push("+time >=  '"+list[i]+"'");
                    }
                    break;
                case 5:
                    if(list[i]!=0){
                        list2.push("+time <= '"+list[i]+"'");
                    }
                    break;
                case 6:
                    if(list[i]!=0){
                        list2.push("+current_num_of_seats >= "+list[i]);
                    }
                    break;
                case 7:
                    if(list[i]!=0){
                        list2.push("+current_num_of_seats <= "+list[i]);
                    }
                    break;
                case 8:
                    if(list[i]!=0){
                        list2.push("+current_num_of_bags >= "+list[i]);
                    }
                    break;
                case 9:
                    if(list[i]!=0){
                        list2.push("+current_num_of_bags <= "+list[i]);
                    }
                    break;
                case 10:
                    if(list[i]!=0){
                        list2.push("+rate >= "+list[i]);
                    }
                    break;
                case 11:
                    if(list[i]!=0){
                        list2.push("+rate <= "+list[i]);
                    }
                    break;
                case 12:
                    if(list[i]!=0 ){
                        list2.push("+price >= "+list[i]);
                    }
                    break;
                case 13:
                    if(list[i]!=0){
                        list2.push("+price <= "+list[i]);
                    }
                    break;
                default:
                    break;
              }
        }
        var  m =  list2.toString();
        console.log(m)
        m = m.split(",+").join(" and ");
        console.log(m)
        let l = await getTripByfilter(m,id);
        if(l==0){
            res.send([]);
        }else{
            var teliko=[];
            var trips = l;
            trips = JSON.parse(JSON.stringify(trips));
            for (var i = 0; i <trips.length; i++) {
                var currentTrip = new class_trip(trips[i]);
                var date = currentTrip.getDate();
                date = ChangeFromat(date);
                currentTrip.setDate(date);
                var creator = await getTripCreator(trips[i].id);
                creator = JSON.parse(JSON.stringify(creator[0]));
                var users = await getPassengersOfTrip(trips[i].id);
                users = JSON.parse(JSON.stringify(users));
                currentTrip.setPassengers(users);
                currentTrip.setCreator(creator);
                teliko.push(currentTrip);
            }


            res.send(teliko);
        }
        
    });
    
    function getTripByfilter(query,id){
        return new Promise((resolve,reject)=>{
            let q = "select trips.* from trips left join users_and_trips on trips.id = users_and_trips.trip_id "+
            " where ("+query+" and trip.sate ='available') AND users_and_trips.trip_id is null ";
            " and trips.id NOT IN  (select trips.id from trips left join request"+
            "         on trips.id = request.trip_id where request.trip_id = request.trip_id );";
            let q1 = "select trips.* from trips  join request on "+
                        "trips.id = request.trip_id "+
                        " where ("+query+" and trips.state ='available') AND request.creator_id != "+id+"";

            let q2 = "select trips.*  from trips   "+
                        "where trips.creator_id !="+id+" and (("+query+") and trips.state ='available') AND trips.id NOT IN"+
                        " (select request.trip_id "+
                             "from request "+
                                " where request.creator_id = "+id+") ";
            
            //let q = "select * from trips where ffrom = "+from+" and tto =  "+to;
            //console.log(q2)
            //db.query("select * from trips where ffrom = ? and tto = ? ",[from,to],(err, result) => {
            db.query(q2,(err, result) => {
                if (err || result == 0){
                    resolve (0);
                }
                else{
                    resolve (result);
                }
            })
        });
    }


function ChangeFromat(date){
    var d  = date.split("-");
    var new_date = d[2]+"-"+d[1]+"-"+d[0]
    return  (new_date);
}
