class User{
    constructor(user){
        this.id= user.id,
        this.name= user.name,
        this.birthday= user.birthday,
        this.emai= user.email,
        this.password= user.password,
        this.phone= user.phone,
        this.picture = Convert(user.picture),
        this.rate= user.rate,
        this.num_of_travels_offered= user.num_of_travels_offered,
        this.num_of_travels_takespart= user.num_of_travels_takespart
    }
}

function Convert(pic){
    if(pic==''){
        return "null";
    }else{
        return result;
    }
}
module.exports = User;