class Notification{
    constructor(notification){
        this.id = notification.id,
        this.user = notification.user,
        this.trip = notification.trip,
        this.description = notification.description,
        this.status = notification.status
    }
}

module.exports = Notification;