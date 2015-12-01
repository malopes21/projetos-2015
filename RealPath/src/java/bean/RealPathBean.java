/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bean;

import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import javax.servlet.ServletContext;

/**
 *
 * @author Papai
 */
@ManagedBean
@RequestScoped
public class RealPathBean {

    /**
     * Creates a new instance of RealPathBean
     */
    public RealPathBean() {
    }

    public void pega() {
        FacesContext facesContext = FacesContext.getCurrentInstance();
        ServletContext sContext = (ServletContext) facesContext.getExternalContext().getContext();
        String seuDiretorio = sContext.getRealPath("/relatorios");
        
        FacesMessage msg = new FacesMessage(seuDiretorio);
        facesContext.addMessage(null, msg);
        
        System.out.println(FacesContext.getCurrentInstance().getExternalContext().getRealPath("/relatorios"));
    }

}
