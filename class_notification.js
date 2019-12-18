class Notification{
    constructor(notification){
        this.id = notification.id,
        this.user = notification.user,
        this.trip = notification.trip
        
    }


    setTrip(trip){
        this.trip=(trip);
    }
    
    setUser(user){
        this.user=(user);
    }
}
module.exports = Notification;