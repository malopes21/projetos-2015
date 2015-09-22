package aula05;

public class Transformacoes {
	
	//matriz de rotacao R: 	P' = R * P
	//	cos(ang) 	-sen(ang)	0
	//	sen(ang)	cos(ang)	0
	//	0			0			1
	
	public static Point2D rotacao(Point2D ponto, float ang /*em graus*/){
		ang = (float)(ang * Math.PI/180);
		Point2D out = new Point2D();
		out.x = (float) (ponto.x * Math.cos(ang) - ponto.y * Math.sin(ang) + ponto.w * 0);
		out.y = (float) (ponto.x * Math.sin(ang) + ponto.y * Math.cos(ang) + ponto.w * 0);
		out.w = ponto.w * 1;
		return out;
	}
	
	//matriz de translacao T: 	P' = T * P
		//	1 	0	dx
		//	0	1	dy
		//	0	0	1
		
	public static Point2D translacao(Point2D ponto, float dx, float dy){
		Point2D out = new Point2D();
		out.x = (float) (ponto.x * 1 + ponto.w * dx);
		out.y = (float) (ponto.y * 1 + ponto.w * dy);
		out.w = ponto.w * 1;
		return out;
	}
		
	//matriz de escala E: 	P' = E * P
	//	sx 	0	0
	//	0	sy	0
	//	0	0	1
	
	public static Point2D escala(Point2D ponto, float sx, float sy){
		Point2D out = new Point2D();
		out.x = (float) (ponto.x * sx);
		out.y = (float) (ponto.y * sy);
		out.w = ponto.w * 1;
		return out;
	}
}
