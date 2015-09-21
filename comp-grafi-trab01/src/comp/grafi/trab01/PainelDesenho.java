/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package comp.grafi.trab01;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JPanel;

/**
 *
 * @author malopes
 */
public class PainelDesenho extends JPanel {

    private List<Geometria> geometrias = new ArrayList<>();

    private final float realWidth = 100.0f;
    private final float realHeight = 100.0f;
    private float centerX;
    private float centerY;
    private float tamPixel;
    private Graphics context;

    private Point2D current = new Point2D();

    private void initgr() {
        Dimension d = getSize();
        tamPixel = Math.max(realWidth / (d.width - 1), realHeight / (d.height - 1));
        centerX = d.width / 2;
        centerY = d.height / 2;
    }

    private int iX(float x) {
        return Math.round(x / tamPixel + centerX);
    }

    private int iY(float y) {
        return Math.round(centerY - y / tamPixel);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        initgr();
        context = g;

        //g.setColor(Color.red);
                
        g.drawLine(iX(-100), iY(0), iX(100), iY(0));
        g.drawLine(iX(0), iY(-45), iX(0), iY(45));

        desenhaGeometrias();

    }

    //funcoes para auxilio de desenho
    void moveTo(Point2D ponto) {
        current = ponto;
    }

    void lineTo(Graphics g, Point2D next) {
        g.drawLine(iX(current.x), iY(current.y), iX(next.x), iY(next.y));
        current = next;
    }

    private void desenhaGeometrias() {
        geometrias.forEach((geom) -> desenhaGeometria(geom));
    }

    private void desenhaGeometria(Geometria geom) {
        if(geom.getPontos().size() <= 1) {
            throw new RuntimeException("Geometria não adequada, deve ter pelo menos 2 pontos!");
        }
        try {
            Field field = Color.class.getField(geom.getCor());
            Color color = (Color)field.get(null);
            context.setColor(color);
        } catch(Exception ex) {
            System.out.println("ops!");
        }
        
        moveTo(geom.getPontos().get(0));
        for(int i=1; i<geom.getPontos().size(); i++) {
            lineTo(context, geom.getPontos().get(i));
        }
        lineTo(context, geom.getPontos().get(0));
    }

    public List<Geometria> getGeometrias() {
        return geometrias;
    }

    public void setGeometrias(List<Geometria> geometrias) {
        this.geometrias = geometrias;
    }

}
