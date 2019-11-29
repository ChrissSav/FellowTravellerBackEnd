class Trip{ 
 constructor(trip){
    this.id= trip.id,
    this.ffrom = trip.from,
    this.tto = trip.to,
    this.users = [],
    this.date_departure = trip.date_departure,
    this.time_departure =trip.time_departure,
    this.time_arrivals= trip.time_arrivals,
    this.creator_id= trip.creator_id
    this.description= trip.description,
    this.max_seats= trip.max_seats,
    this.current_num= trip.current_num,
    this.num_of_bags=trip.num_of_bags,
    this.num_of_suitcase = trip.num_of_suitcase,
    this.rate= trip.rate,
    this.state= trip.state
  }

  AddUSer(user){
    this.users=(user);
  }
  getUser(){
    return this.users;
  }
}

module.exports = Trip;