import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class Main {

	private static Driver driver;
	
	public static void main(String[] args) {

		driver = new Driver();
		//CheckNotAvailableTrips();
		//GetUnAvailableTrips();
		
		Thread thread1 = new Thread(){
		    public void run(){
		    	while(true){		    			
		    			try {
		    				CheckNotAvailableTrips();
		    				System.out.println("Thread1");
							Thread.sleep(5000);
						} catch (InterruptedException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
		    	}
		    }
		  };
		  
		  Thread thread2 = new Thread(){
			    public void run(){
			    	try {
						Thread.sleep(1000);
					} catch (InterruptedException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
			    	while(true){
			    			
			    			try {
			    				GetUnAvailableTrips();
			    				System.out.println("Thread2");
								Thread.sleep(7000);
								
							} catch (InterruptedException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
			    	}
			    }
			  };
			  thread1.start();			 
			  thread2.start();


	}

	
	
	public static void CheckNotAvailableTrips(){
		ArrayList<Trip> arrayOfAvailableTrips = new ArrayList<>();
		arrayOfAvailableTrips = driver.GetAllAvalableTrips();
		//System.out.println(arrayOfAvailableTrips.size());
		for(int i=0; i<arrayOfAvailableTrips.size(); i++){
			Tripp(arrayOfAvailableTrips.get(i));
			GetCurrentDate(arrayOfAvailableTrips.get(i).getId(),arrayOfAvailableTrips.get(i).getDate(),arrayOfAvailableTrips.get(i).getTime());
		}
		
	}
	
	
	public static void GetCurrentDate(int id,String date1,String time1){	
	    
		try {
			DateFormat  sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			String today = sdf.format(new Date());
			Date secondDate = sdf.parse(date1+" "+time1);
			Date todayDate =  sdf.parse(today);	
			//System.out.println(id+"  "+date1+" "+time1);
			if(secondDate.before(todayDate) || todayDate.equals(secondDate)){
				System.out.println(id+"   set unavailable");
				driver.SetTripNotAvailable(id);
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}	   
	}
	
	public static void Tripp(Trip trip){	
		int current = trip.getCurrent_seats();
		int max = trip.getMax_seats();
		if(current>=max){
			driver.SetTripNotAvailable(trip.getId());
		}
			   
	}
	
	
	public static void GetUnAvailableTrips(){	
		
		ArrayList<Trip> arrayOfAvailableTrips = new ArrayList<>();
		arrayOfAvailableTrips = driver.GetAllUnAvailableTrips();
		//System.out.println("size :"+arrayOfAvailableTrips.size());
		for(int i=0; i<arrayOfAvailableTrips.size(); i++){
			//System.out.println(arrayOfAvailableTrips.get(i).getId()+" "+arrayOfAvailableTrips.get(i).getDate()
			//		+" "+arrayOfAvailableTrips.get(i).getTime());
			SendTotification(arrayOfAvailableTrips.get(i));
			//GetCurrentDate(arrayOfAvailableTrips.get(i).getId(),arrayOfAvailableTrips.get(i).getDate(),arrayOfAvailableTrips.get(i).getTime());
		}   
	}

	
	
	
	public static void SendTotification(Trip trip){	
	    
		try {
			//System.out.println("SendTotification");
			DateFormat  sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			String today = sdf.format(new Date());
			Date secondDate = sdf.parse(trip.GetFullDate());
			Date todayDate =  sdf.parse(today);	
			long diff = todayDate.getTime() - secondDate.getTime();
			//System.out.println(trip.GetFullDate());
			long result = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
			//System.out.println(result);
			ArrayList<Integer> passengers = new ArrayList<>();
			if(result>=1){
				System.out.println(trip.getId()+"   set notifocation");
				passengers = driver.GetAllPassengersOfTrip(trip.getId());
				if(passengers.size()!=0){
					for (int i=0; i<passengers.size(); i++){
					//	System.out.println(passengers.get(i)+" "+ trip.getCreator_id()+" "+ trip.getId());
						driver.RegisterNotificationToRate(passengers.get(i), trip.getCreator_id(), trip.getId());
					}
				}else{
					driver.RegisterNotificationToRate(0, trip.getCreator_id(), trip.getId());
				}
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}	   
	}
}