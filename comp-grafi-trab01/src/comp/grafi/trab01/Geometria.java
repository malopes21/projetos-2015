package comp.grafi.trab01;

import java.util.ArrayList;
import java.util.List;

public class Geometria {

    private List<Point2D> pontos = new ArrayList<>();
    private String id;
    private String cor;

    public List<Point2D> getPontos() {
        return pontos;
    }

    public void setPontos(List<Point2D> pontos) {
        this.pontos = pontos;
    }

    public void setPontos(String pontosX, String pontosY) {
        String[] x = pontosX.split(" ");
        String[] y = pontosY.split(" ");
        if (x.length != y.length) {
            throw new RuntimeException("Quantidade de coordenadas diferentes!");
        }
        for (int i = 0; i < x.length; i++) {
            Point2D p = new Point2D(Float.parseFloat(x[i]), Float.parseFloat(y[i]));
            pontos.add(p);
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

}
