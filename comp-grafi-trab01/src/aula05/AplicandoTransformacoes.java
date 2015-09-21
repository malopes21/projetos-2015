package aula05;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;

public class AplicandoTransformacoes extends JFrame {

	private static final long serialVersionUID = 1L;

	public static void main(String[] args) {
		new AplicandoTransformacoes();
	}

	AplicandoTransformacoes() {
		super("Demo transformacao de rotacao");
		this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);		
		setSize(1000, 600);
		this.getContentPane().setBackground(Color.white);
		JPanel painel = new JPanel();
		painel.add(new JButton("ops"));
		add("Center", new CvAplicandoTransformacoes());
		add("North", painel);
		setVisible(true);
	}
}

class CvAplicandoTransformacoes extends JPanel {

	private static final long serialVersionUID = 1L;

	int centerX;
	int centerY;
	int currentX;
	int currentY;
	float pixelSize;
	float rWidth = 100.0F;
	float rHeight = 100.0F;

	//inicia dimensoes do ambiente gráfico
	void initgr() {
		Dimension d = getSize();
		int maxX = d.width - 1, maxY = d.height - 1;
		pixelSize = Math.max(rWidth / maxX, rHeight / maxY);
		centerX = maxX / 3;
		centerY = maxY - (maxY / 3);
		setBackground(Color.WHITE);
	}

	//funcoes de mapeamento de coordenadas do mundo para coordenadas do dispositivo
	int iX(float x) {
		return Math.round(centerX + x / pixelSize);
	}

	int iY(float y) {
		return Math.round(centerY - y / pixelSize);
	}

	//funcoes para auxilio de desenho
	void moveTo(Point2D ponto) {
		currentX = iX(ponto.x);
		currentY = iY(ponto.y);
	}

	void lineTo(Graphics g, Point2D next) {
		int x1 = iX(next.x);
		int y1 = iY(next.y);
		g.drawLine(currentX, currentY, x1, y1);
		currentX = x1;
		currentY = y1;
	}

	void drawArrow(Graphics g, Point2D[] geom) {
		moveTo(geom[0]);
		lineTo(g, geom[1]);
		lineTo(g, geom[2]);
		lineTo(g, geom[3]);
		lineTo(g, geom[1]);
	}

	void rotGeom(Point2D[] geom, float ang) {
		for(int i=0; i<geom.length; i++) {
			geom[i] = Transformacoes.rotacao(geom[i], ang);
		}
	}
	
	void transGeom(Point2D[] geom, float dx, float dy){
		for(int i=0; i<geom.length; i++) {
			geom[i] = Transformacoes.translacao(geom[i], dx, dy);
		}
	}
	
	void escGeom(Point2D[] geom, float sx, float sy){
		for(int i=0; i<geom.length; i++) {
			geom[i] = Transformacoes.escala(geom[i], sx, sy);
		}
	}
	
	
	public void paint(Graphics g) {
		
		initgr();		
		
		float r = 0.0F;
		float[] x = { r, r, r - 2, r + 2 };
		float[] y = { 0, 14, 7, 7 };
		Point2D[] geometria = createGeome(x, y);
		
		// Show coordinate axes:
		moveTo(new Point2D(100, 0));
		lineTo(g, new Point2D(0, 0));
		lineTo(g, new Point2D(0, 60));
		
		
		// Show initial arrow:
		g.setColor(Color.blue);
		drawArrow(g, geometria);
		
		//rotacao
		rotGeom(geometria, -90);
		g.setColor(Color.green);
		drawArrow(g, geometria);
		
		//translacao
		transGeom(geometria, 10, 20);
		g.setColor(Color.red);
		drawArrow(g, geometria);
		
		//rotacao fora do eixo
		rotGeom(geometria, 90);
		g.setColor(Color.cyan);
		drawArrow(g, geometria);
				
		//voltar 
		rotGeom(geometria, -90);
		
		//rotacao sobre o proprio eixo  => combinacao de transformadas
		transGeom(geometria, -10, -20);
		rotGeom(geometria, 45);
		transGeom(geometria, 10, 20);
		g.setColor(Color.lightGray);
		drawArrow(g, geometria);
		
		//translacao
		transGeom(geometria, -10, -20);
		
		//escala
		escGeom(geometria, 2, 2);
		g.setColor(Color.magenta);
		drawArrow(g, geometria);
		
		
	}

	private Point2D[] createGeome(float[] x, float[] y) {
		if(x.length != y.length) {
			throw new RuntimeException("tamanhos de arrays diferentes!");
		}
		Point2D[] geom = new Point2D[x.length];
		for(int i=0; i<x.length; i++) {
			geom[i] = new Point2D(x[i], y[i]);
		}
		return geom;
	}
}
