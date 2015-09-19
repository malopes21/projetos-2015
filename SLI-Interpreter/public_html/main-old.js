function mainOld() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    //alert("files OK!");
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    
    
    var d = new Date(2013, 12, 5, 16, 23, 45, 600);
    var generatedFile = new File(["Rough Draft ...."], "prog01.sli"); //, "Draft1.txt", {type: "text/plain"; lastModified: d});
    alert("ops " + generatedFile);
    var reader = new FileReader("prog01.sli");
    alert("ops 2" + reader);
    
    while (!reader.AtEndOfStream) {
    //escreve o txt no TextArea
        //document.getElementById("texto").value = arquivo.ReadAll();
        
        alert();
    }
    //AbreArquivo("C:/Temp/NetBeansProjects/SLI-Interperter/public_html/prog01.sql");
}



//Função para gravar o arquivo
function GravaArquivo(arq, texto) {
    //pasta a ser salvo o arquivo
    var pasta = "C:/Temp/NetBeansProjects/SLI-Interperter/public_html/";
    //se o parametro arq que é o nome do arquivo vier vazio ele salvará o arquivo com o nome “Sem Titulo”
    if (arq == "") {
        arq = "Sem Titulo";
    }
    //carrega o txt
    var esc = dados.CreateTextFile(pasta + arq + ".sli", false);
    //escreve o que foi passado no parametro texto que é o texto contido no TextArea
    esc.WriteLine(texto);
    //fecha o txt
    esc.Close();
}
//Função para abrir o arquivo
function AbreArquivo(arq) {
    //o parametro arq é o endereço do txt
    //carrega o txt
    var arquivo = dados.OpenTextFile(arq, 1, true);
    
    //varre o arquivo
    while (!arquivo.AtEndOfStream) {
    //escreve o txt no TextArea
        //document.getElementById("texto").value = arquivo.ReadAll();
        alert(arquivo.ReadAll());
    }
    //fecha o txt
    arquivo.Close();
}

