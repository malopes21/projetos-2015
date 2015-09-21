package comp.grafi.trab01;

public class Point2D {
	
	public float x;
	public float y;
	public float w;
	
	public Point2D(){
		this.x = 0;
		this.y = 0;
		this.w = 1;
	}
	
	public Point2D(float x, float y){
		this.x = x;
		this.y = y;
		this.w = 1;
	}
	
	public Point2D(float x, float y, float w){
		this.x = x;
		this.y = y;
		this.w = w;
	}
	
}
