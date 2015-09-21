/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package calc.cirella;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Papai
 */
public class CalcCirella {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        List<Valor> valores = new ArrayList<>();
        valores.add(new Valor("abr/2014", 87000.0, "Entrada"));
        valores.add(new Valor("mai/2014",  2208.0, "parcela"));
        valores.add(new Valor("jun/2014",  2225.0, "parcela"));
        valores.add(new Valor("jul/2014",  2223.0, "parcela"));
        valores.add(new Valor("ago/2014",  2206.0, "parcela"));
        valores.add(new Valor("set/2014",  2193.0, "parcela"));
        valores.add(new Valor("out/2014",  2185.0, "parcela"));
        valores.add(new Valor("out/2014",  4941.0, "sessao de direito"));
        valores.add(new Valor("nov/2014",  2191.0, "parcela"));
        valores.add(new Valor("dez/2014",  2191.0, "parcela"));
        
        valores.add(new Valor("jan/2015",  2219.0, "parcela"));
        valores.add(new Valor("fev/2015",  2233.0, "parcela"));
        valores.add(new Valor("mar/2015",  2250.0, "parcela"));
        valores.add(new Valor("abr/2015",  2256.0, "parcela"));
        valores.add(new Valor("abr/2015",  9050.0, "balao extra"));
        valores.add(new Valor("mai/2015",  2278.0, "parcela"));
        valores.add(new Valor("jun/2015",  2304.0, "parcela"));
        valores.add(new Valor("jul/2015",  2314.0, "parcela"));
        valores.add(new Valor("ago/2015",  2329.0, "parcela"));
        valores.add(new Valor("set/2015",  2345.0, "parcela"));
        
        valores.add(new Valor("---/2015",  5000.0, "corretagem"));
        
        double total = valores.get(0).getValor();
        System.out.println(valores.get(0));
        
        for(int i=1; i<valores.size(); i++) {
            Valor valor = valores.get(i);
            total = total + valor.getValor();
            total = total + total * 0.005;
            System.out.println(valor);
        }
        System.out.printf("Total: %9.2f\n", total);
    }

}

class Valor {

    private String data;
    private Double valor;
    private String obs;

    public Valor() {
    }

    public Valor(String data, Double valor, String obs) {
        this.data = data;
        this.valor = valor;
        this.obs = obs;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getObs() {
        return obs;
    }

    public void setObs(String obs) {
        this.obs = obs;
    }

    @Override
    public String toString() {
        return "Valor{" + "data=" + data + ", valor=" + valor + ", obs=" + obs + '}';
    }

    
}
