import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class Driver {
	
	private Connection myConn;
	private Statement myStm;
	private ResultSet myRes;
	
	public Driver(){
		
		try {
			myConn = DriverManager.getConnection("jdbc:mysql://localhost:3306/fellowtraveller","root","rootroot");
			myStm = myConn.createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	//--------------------------------------------------------------------------------------------

	public ArrayList<Trip> GetAllAvalableTrips(){
		ArrayList<Trip> array = new ArrayList<>();
		Trip trip ;
		String q = "select * from trips where state = 'available' ";
		try {
			myRes = myStm.executeQuery(q);
			while(myRes.next()){
				trip = new Trip( Integer.parseInt(myRes.getString("id")),myRes.getString("date"),myRes.getString("time"));
				array.add(trip);
			}
			return array;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return array;
	}
	
	public ArrayList<Trip> GetAllUnAvailableTrips(){
		ArrayList<Trip> array = new ArrayList<>();
		Trip trip;
		String q = "select * from trips where state = 'unavailable' and id not in"+ 
		"(select trip_id from notification)";
		//System.out.println(q);
		try {
			myRes = myStm.executeQuery(q);
			while(myRes.next()){
				trip = new Trip( Integer.parseInt(myRes.getString("id")),myRes.getString("date"),
						myRes.getString("time"),Integer.parseInt(myRes.getString("creator_id")));
				array.add(trip);
			}
			return array;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return array;
	}
	
	public boolean SetTripNotAvailable(int id){
		String sql = "update trips set state = 'unavailable' where id = ? ";
		try {
			PreparedStatement pst = myConn.prepareStatement(sql);
			pst.setString(1, id+"");
			if(pst.executeUpdate()<1){
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}	
		return true;
	}
	
	
	public void RegisterNotificationToRate(int target_id,int user_id,int trip_id){
		
		String sql = "insert into notification (target_id,user_id,trip_id,type) values (?,?,?,?)";
		try {
			//if(!CheckNotification(target_id,user_id,trip_id)){
				PreparedStatement pst = myConn.prepareStatement(sql);
				pst.setInt(1, target_id);
				pst.setInt(2, user_id);
				pst.setInt(3, trip_id);
				pst.setString(4, "rate");
				
				//System.out.println(pst.toString());
				if(pst.executeUpdate()>0){
					System.out.println("RegisterNotificationToRate  Mpompa");
					System.out.println("target_id : "+ target_id+"user_id :"+user_id+"trip_id :"+trip_id);
				}else{
					System.out.println("RegisterNotificationToRate  no mpompa");
				}
			//}else{
			//	System.out.println("yparxei to notification");
			//}
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	public ArrayList<Integer> GetAllPassengersOfTrip(int trip_id){
		ArrayList<Integer> array = new ArrayList<>();
		String q = "select user_id from users_and_trips where trip_id = "+trip_id;
		try {
			myRes = myStm.executeQuery(q);
			while(myRes.next()){
				array.add(Integer.parseInt(myRes.getString("user_id")));
			}
			return array;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return array;
	}
	
	public boolean CheckNotification(int target_id,int user_id,int trip_id){
		String sql = "select * from notification where  target_id="+target_id
				+" and user_id= "+user_id+" and trip_id = "+trip_id+" and type = 'rate'";
		//System.out.println(sql);
		try {
			myRes = myStm.executeQuery(sql);
			if(myRes.next()){
				return true;
			}
			return false;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return false;
	}
		
}
