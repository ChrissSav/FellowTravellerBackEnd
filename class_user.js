class User{
    constructor(id,name,email,password){
        this.id= id,
        this.name= name,
        this.emai= email,
        this.password= password,
        this.phone= "0",
        this.rate= 0,
        this.num_of_travels_offered= 0,
        this.num_of_travels_takespart= 0
    }
}

module.exports = User;