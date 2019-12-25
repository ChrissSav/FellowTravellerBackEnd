class Notification{
    constructor(notification){
        this.id = notification.id,
        this.user = notification.user,
        this.trip = notification.trip,
        this.type = notification.type
    }


    setType(type){
        this.trip=(type);
    }
    getType(){
        return this.type;
    }
    setTrip(trip){
        this.trip=(trip);
    }
    
    setUser(user){
        this.user=(user);
    }
}
module.exports = Notification;