class Trip{ 
 constructor(trip){
    //this.id= trip.id,
    this.ffrom = trip.ffrom,
    this.tto = trip.tto,
    this.date = trip.date,
    this.time =trip.time,
    this.creator=[],
    this.passengers = [],
    this.description= trip.description,
    this.max_seats= trip.max_seats,
    this.current_num_of_seats= trip.current_num_of_seats,
    this.max_bags=trip.max_bags,
    this.current_num_of_bags= trip.current_num_of_bags,
    this.rate = trip.rate,
    this.state = trip.state
  }

  setPassengers(passengers){
    this.passengers=(passengers);
  }

  setCreator(creator){
    this.creator=(creator);
  }
  getUser(){
    return this.users;
  }
}

module.exports = Trip;