class User{
    constructor(user){
        this.id= user.id,
        this.name= user.name,
        this.birthday= user.birthday,
        this.emai= user.email,
        this.password= user.password,
        this.phone= user.phone,
        this.rate= user.rate,
        this.num_of_travels_offered= user.num_of_travels_offered,
        this.num_of_travels_takespart= user.num_of_travels_takespart
    }
}

module.exports = User;