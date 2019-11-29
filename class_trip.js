class Trip{
  constructor(id,from,to,table,date_departure,time_departure,time_arrivals,creator_id,description,max_seats,current_num,num_of_bags,num_of_suitcase,rate,state){
    this.id= id,
    this.ffrom = from,
    this.tto = to,
    this.users = [],
    this.date_departure = date_departure,
    this.time_departure =time_departure,
    this.time_arrivals= time_arrivals,
    this.creator_id= creator_id
    this.description= description,
    this.max_seats= max_seats,
    this.current_num= current_num,
    this.num_of_bags=num_of_bags,
    this.num_of_suitcase = num_of_suitcase,
    this.rate= rate,
    this.state= state
  }

  AddUSer(user){
    this.users.push(user);
  }
  getUser(){
    return this.users;
  }
}