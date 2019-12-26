class UserInfoClass{
    constructor(){
        this.user= [],
        this.friendly = 0,
        this.reliable = 0,
        this.careful = 0,
        this.consistent = 0
    }


    setUser(user){
        this.user=(user);
    }
    
    getUser(){
        return this.user;
    }


/*
    setRate(rate){
        this.rate=(rate);
    }
    
    getRate(){
        return this.rate;
    }*/

    setFriendly(friendly){
        this.friendly = friendly;
    }
    setReliable(reliable){
        this.reliable = reliable;
    }
    setCareful(careful){
        this.careful = careful;
    }
    setConsistent(consistent){
        this.consistent = consistent;
    }

    
}




module.exports = UserInfoClass;