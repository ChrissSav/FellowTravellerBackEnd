class UserInfoClass{
    constructor(){
        this.user= [],
        this.rate= []
    }


    setUser(user){
        this.user=(user);
    }
    
    getUser(){
        return this.user;
    }



    setRate(rate){
        this.rate=(rate);
    }
    
    getRate(){
        return this.rate;
    }


    
}




module.exports = UserInfoClass;