
public class Trip {
	
	private int id;
	private String date;
	private String time;
	private int creator_id;
	
	public int getCreator_id() {
		return creator_id;
	}


	public void setCreator_id(int creator_id) {
		this.creator_id = creator_id;
	}


	public Trip(int id, String date, String time, int creator_id) {
		this.id = id;
		this.date = date;
		this.time = time;
		this.creator_id = creator_id;
	}


	public String GetFullDate(){
		return date+" "+time;

	}
	public Trip(int id, String date,String time) {
		this.id = id;
		this.date = date;
		this.time = time;
	}
	
	
	public String getTime() {
		return time;
	}


	public void setTime(String time) {
		this.time = time;
	}


	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	
	
}