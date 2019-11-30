class Trip{ 
 constructor(trip){
    this.id= trip.id,
    this.ffrom = trip.ffrom,
    this.tto = trip.tto,
    this.date_departure = trip.date_departure,
    this.time_departure =trip.time_departure,
    this.time_arrivals= trip.time_arrivals,
    this.creator=[],
    this.passengers = [],
    this.description= trip.description,
    this.max_seats= trip.max_seats,
    this.current_num= trip.current_num,
    this.num_of_bags=trip.num_of_bags,
    this.num_of_suitcase = trip.num_of_suitcase,
    this.rate= trip.rate,
    this.state= trip.state
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