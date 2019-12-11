class Notification{
    constructor(notification){
        this.id = notification.id,
        this.target = notification.target,
        this.user = notification.user,
        this.trip = notification.trip
        
    }


    setTrip(trip){
        this.trip=(trip);
    }
    
    setTarget(target){
        this.target=(target);
    }
    setUser(user){
        this.user=(user);
    }
}
module.exports = Notification;