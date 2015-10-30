//classe TabelasEstaticas
function TabelasEstaticas() {
    this.palavrasReservadas = ["intero", "vero", "corda", "si", "mentre", "stampa", "entrare", "booleano"];
    this.delimitadores = ["(", ")"];
    this.operadores = ["+", "-", "*", "/", "<", ">", "<=", ">=", "==", "!=", "=", ".", "&&", "||"];
    
    TabelasEstaticas.prototype.ehPalavraReservada = function (imagem){
        for(var i=0; i<this.palavrasReservadas.length; i++) {
            if(this.palavrasReservadas[i] === imagem) {
                return true;
            } 
        }
        return false;
    };
    
    TabelasEstaticas.prototype.ehDelimitador = function (imagem){
        for(var i=0; i<this.delimitadores.length; i++) {
            if(this.delimitadores[i] === imagem) {
                return true;
            } 
        }
        return false;
    };
    
    TabelasEstaticas.prototype.ehOperador = function (imagem){
        for(var i=0; i<this.operadores.length; i++) {
            if(this.operadores[i] === imagem) {
                return true;
            } 
        }
        return false;
    };
}

//objeto global para acesso as tabelas estáticas
var tabelasEstaticas = new TabelasEstaticas();

//classe Simbolo (identificadores)
function Simbolo(imagem) {
    this.imagem = imagem;
    this.tipo = "";
    this.valor = "";
    
    Simbolo.prototype.toString = function() {
        return this.imagem + " - " + this.tipo + " - " + this.valor;
    };
}

function TabelaSimbolos() {
    this.simbolos = new Array();
    
    TabelaSimbolos.prototype.addSimbolo = function(token){
        var indice = this.getIndexSimbolo(token.imagem);
        if(indice > -1) {
            token.indice = indice; 
        } else {
            var simbNovo = new Simbolo(token.imagem);
            this.simbolos.push(simbNovo);
            token.indice = this.simbolos.length - 1;
        }
    };
    
    TabelaSimbolos.prototype.getIndexSimbolo = function(imagem){
        for(var i=0; i<this.simbolos.length; i++){
            if(this.simbolos[i].imagem === imagem) {
                return i;
            }
        }
        return -1;
    };
    
    TabelaSimbolos.prototype.getTipo = function(token){
        if(token.classe === "ID") {
            return this.simbolos[token.indice].tipo;
        } else if(token.classe === "CLI") {
            return "intero";
        } else if(token.classe === "CLR") {
            return "vero";
        } else if(token.classe === "CLS") {
            return "corda";
        } else if(token.classe === "CLL") {
            return "booleano";
        } 
    };
    
    TabelaSimbolos.prototype.setTipo = function(token, tipo){
        this.simbolos[token.indice].tipo = tipo;
    };
}

//objeto global para acesso a tabela de simbolos
var tabelaSimbolos;

//classe Token
function Token(imagem, classe, indice, linha, coluna) {
    this.imagem = imagem;
    this.classe = classe;
    this.indice = indice;
    this.linha = linha;
    this.coluna = coluna;
    
    Token.prototype.toString = function(){
        return this.imagem + " " + this.classe + " " + this.indice + " " + this.linha + " " + this.coluna; 
    };
}

//classe do AnalisadorLexico
function AnalisadorLexico(codigo){
    this.tokens = new Array();
    this.erros = new Array();
    this.codigo = codigo;
    
    AnalisadorLexico.prototype.temErros = function () {
        return this.erros.length !== 0;
    };
    
    AnalisadorLexico.prototype.mostraErros = function () {
        var saida = document.getElementById("saida");
        var conteudo = "";
        for(var i=0; i<this.erros.length; i++) {
            conteudo = conteudo + "Erro léxico: "+this.erros[i]+ "\n";
        }
        saida.value = saida.value + conteudo;
    };
    
    AnalisadorLexico.prototype.mostraTokens = function () {
        var saida = document.getElementById("saida");
        var conteudo = "\nTOKENS: ---------------------------\n";
        for(var i=0; i<this.tokens.length; i++) {
             conteudo = conteudo + this.tokens[i].toString()+ "\n";
        }
        saida.value = saida.value + conteudo;
    };

    AnalisadorLexico.prototype.mostraSimbolos = function () {
        var saida = document.getElementById("saida");
        var conteudo = "\nSIMBOLOS: ---------------------------\n";
        for(var i=0; i<tabelaSimbolos.simbolos.length; i++) {
             conteudo = conteudo + i + " - " + tabelaSimbolos.simbolos[i].toString()+ "\n";
        }
        saida.value = saida.value + conteudo;
    };
    
    AnalisadorLexico.prototype.analisar = function (){
        var cli = new RegExp("^[+-]?\\d\\d*$");
        var clr = new RegExp("^[+-]?\\d\\d*\\.\\d\\d*$");
        var id = new RegExp("^\\w(\\w|\\d)*$");
        var linhas = this.codigo.split("\n");
        for(var i=0; i<linhas.length; i++) {
            //console.log("linha: "+linhas[i].trim());
            var lexemas = linhas[i].trim().split(" ");
            for(var j=0; j<lexemas.length; j++){
                //console.log("lexema: "+lexemas[j]);
                var imagem = lexemas[j];
                if(imagem.length > 0 && imagem.charAt(0) === '#') {
                    break;
                } else if(imagem.length > 0 && imagem.charAt(0) === '"') {
                    //console.log("achei uma string!");
                    var linhaAtual = linhas[i].trim();
                    var inicio = linhaAtual.indexOf("\"");
                    var restanteLinha = linhaAtual.substr(inicio + 1);      //possivel problema
                    var fim = restanteLinha.indexOf("\"");
                    if(fim === -1) {
                        erros.push("String não finalizada! Linha: "+(i+1));
                        break;
                    }
                    imagem = linhaAtual.substr(inicio+1, fim);
                    var token = new Token(imagem, "CLS", -1, i+1, 0);
                    this.tokens.push(token);
                    linhas[i] = restanteLinha.substr(fim+1);                   //possível problema
                    i--;
                    break;
                    //console.log("restante: "+restanteLinha + " imagem: "+imagem);
                } else if(tabelasEstaticas.ehPalavraReservada(imagem)) {
                    var token = new Token(imagem, "PR", -1, i+1, 0);
                    this.tokens.push(token);
                } else if(tabelasEstaticas.ehOperador(imagem)){
                    var token = new Token(imagem, "OP", -1, i+1, 0);
                    this.tokens.push(token);
                } else if(tabelasEstaticas.ehDelimitador(imagem)){
                    var token = new Token(imagem, "DE", -1, i+1, 0);
                    this.tokens.push(token);
                } else if(imagem.match(cli)){
                    var token = new Token(imagem, "CLI", -1, i+1, 0);
                    this.tokens.push(token);
                } else if(imagem.match(clr)){
                    var token = new Token(imagem, "CLR", -1, i+1, 0);
                    this.tokens.push(token);
                } else if(imagem.match(id)){
                    var token = new Token(imagem, "ID", -1, i+1, 0);
                    this.tokens.push(token);
                    tabelaSimbolos.addSimbolo(token);
                } else {
                    if(imagem !== "") {
                        this.erros.push("Lexema desconhecido: '"+imagem+ "'. Linha: "+(i+1));
                    }
                }
            }
        }
        var token = new Token("$", "$", -1, -1, -1);
        this.tokens.push(token);
    };
};

//classe do No da AST
function No(tipo, token) {
    
    this.pai;
    this.filhos = new Array();
    this.tipo = tipo;
    this.token = token;
    
    No.prototype.get = function(pos) {
        return this.filhos[pos];
    };
    
    No.prototype.add = function(no){
        this.filhos.push(no);
        no.pai = this;
    };
    
    No.prototype.toString = function() {
        if(typeof this.token === "undefined" ||  this.token === null) {
            return this.tipo;
        } else {
            return "[" + this.token.imagem + "]";
        }
    };
};

//classe do Analisador Sintatico (ASRP)
function AnalisadorSintatico(tokens) {
    
    this.token = "";
    this.tokens = tokens;
    this.erros = new Array();
    this.pToken = 0;
    this.raiz;
    
    AnalisadorSintatico.prototype.temErros = function () {
        return this.erros.length !== 0;
    };
    
    AnalisadorSintatico.prototype.mostraErros = function () {
        var saida = document.getElementById("saida");
        var conteudo = "\n";
        for(var i=0; i<this.erros.length; i++) {
            conteudo = conteudo + "Erro sintático: "+this.erros[i]+ "\n";
        }
        saida.value = saida.value + conteudo;
    };
    
    AnalisadorSintatico.prototype.leToken = function() {
        this.token = this.tokens[this.pToken];
        this.pToken++;
    };
    
    AnalisadorSintatico.prototype.mostraArvore = function() {
        document.getElementById("saida").value = document.getElementById("saida").value + "\nAST: -------------------";
        this.mostraNo(this.raiz, "");
    };
    
    AnalisadorSintatico.prototype.mostraNo = function(no, espac) {
        document.getElementById("saida").value = document.getElementById("saida").value 
                    + "\n" + espac + no.toString();
        for(var i=0; i<no.filhos.length; i++) {
            this.mostraNo(no.filhos[i], espac + "   ");
        }
    };
    
    AnalisadorSintatico.prototype.analisar = function() {
        this.pToken = 0;
        this.leToken();
        this.raiz = this.ListComan();
        if(this.token.imagem !== "$") {
            this.erros.push("Esperado EOF.");
        }
    };
    
    //<List_Coman> ::= <Coman> <List_Coman> |
    AnalisadorSintatico.prototype.ListComan = function() {
        var no = new No("ListComan", null);
        if(this.token.imagem === "(") {
            no.add(this.Coman());
            no.add(this.ListComan());
        }
        return no;
    };
              
    //<Coman> ::= '(' <Coman_Inter> ')'
    AnalisadorSintatico.prototype.Coman = function() {
        var no = new No("Coman", null);
        if(this.token.imagem === "(") {
            no.add(new No("Token", this.token));
            this.leToken();
            no.add(this.ComanInter());
            if(this.token.imagem === ")") {
                no.add(new No("Token", this.token));
                this.leToken();
            } else {
                this.erros.push("Esperado ')'. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado '('. Token atual: "+this.token.toString());
        }
        return no;
    };     
         
    //<Coman_Inter> ::=  <Decl> | <Atrib> | <Escrita> | <Leitura> | <Laco> | <Cond> | <List_Coman>
     AnalisadorSintatico.prototype.ComanInter = function() {
        var no = new No("ComanInter");
        if(this.token.imagem === "intero" || this.token.imagem === "vero" || this.token.imagem === "corda" || this.token.imagem === "booleano") {
            no.add(this.Decl());
        } else if(this.token.imagem === "=") {
            no.add(this.Atrib());
        } else if(this.token.imagem === "stampa") {
            no.add(this.Escrita());
        } else if(this.token.imagem === "entrare") {
            no.add(this.Leitura());
        } else if(this.token.imagem === "mentre") {
            no.add(this.Laco());
        } else if(this.token.imagem === "si") {
            no.add(this.Cond());
        } else if(this.token.imagem === "(") {
            no.add(this.ListComan());
        } else {
            this.erros.push("Esperado '=', 'intero', 'vero', 'corda', 'booleano', 'stampa', 'estrare', 'mentre', 'si' ou '('. Token atual: "+this.token.toString());
        }
        return no;
     };
               
    //<Decl> ::= <Tipo> <List_Id>
    AnalisadorSintatico.prototype.Decl = function() {
        var no = new No("Decl", null);
        no.add(this.Tipo());
        no.add(this.ListId());
        return no;
    };
        
    //<Tipo> ::= 'intero' | 'vero' | 'corda' | 'booleano'
    AnalisadorSintatico.prototype.Tipo = function() {
        var no = new No("Tipo", null);
        if(this.token.imagem === "intero" || this.token.imagem === "vero" || this.token.imagem === "corda" || this.token.imagem === "booleano") {
            no.add(new No("Token", this.token));
            this.leToken();
        } else {
            this.erros.push("Esperado intero', 'vero', 'corda' ou 'booleano'. Token atual: "+this.token.toString());
        }
        return no;
    };
        
    //<List_Id> ::= id <List_Id2>
    AnalisadorSintatico.prototype.ListId = function() {
        var no = new No("ListId", null);
        if(this.token.classe === "ID") {
            no.add(new No("Token", this.token));
            this.leToken();
            no.add(this.ListId2());
        } else {
            this.erros.push("Esperado ID. Token atual: "+this.token.toString());
        }
        return no;
    };
           
    //<List_Id2> ::= id <List_Id2> |
    AnalisadorSintatico.prototype.ListId2 = function() {
        var no = new No("ListId2");
        if(this.token.classe === "ID") {
            no.add(new No("Token", this.token));
            this.leToken();
            no.add(this.ListId2());
        } 
        return no;
    };
            
    //<Atrib> ::= '=' id <Expr_Arit> 
    AnalisadorSintatico.prototype.Atrib = function() {
        var no = new No("Atrib", null);
        if(this.token.imagem === "=") {
            no.add(new No("Token", this.token));
            this.leToken();
            if(this.token.classe === "ID") {
                no.add(new No("Token", this.token));
                this.leToken();
                no.add(this.ExprArit());
            } else {
                this.erros.push("Esperado ID. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado '='. Token atual: "+this.token.toString());
        }
        return no;
    };
         
    //<Expr_Arit> ::= <Operan> | '(' <Op_Arit> <Expr_Arit> <Expr_Arit> ')'
    AnalisadorSintatico.prototype.ExprArit = function() {
        var no = new No("ExprArit");
        if(this.token.classe === "ID" || this.token.classe === "CLI" || this.token.classe === "CLR" || this.token.classe === "CLS") {
            no.add(this.Operan());
        } else if(this.token.imagem === "(") {
            no.add(new No("Token", this.token));
            this.leToken();
            no.add(this.OpArit());
            no.add(this.ExprArit());
            no.add(this.ExprArit());
            if(this.token.imagem === ")") {
                no.add(new No("Token", this.token));
                this.leToken();
            } else {
                this.erros.push("Esperado ')'. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado ID, CLI, CLR, CLS ou '('. Token atual: "+this.token.toString());
        }
        return no;
    };         
             
    //<Operan> ::= id | cli | cls | clr
    AnalisadorSintatico.prototype.Operan = function() {
        var no = new No("Operan", null);
        if(this.token.classe === "ID" || this.token.classe === "CLI" || this.token.classe === "CLR" || this.token.classe === "CLS") {
            no.add(new No("Token", this.token));
            this.leToken();
        } else {
            this.erros.push("Esperado ID, CLI, CLR ou CLS. Token atual: "+this.token.toString());
        }
        return no;
    };
    
    //<Op_Arit> ::= '+' | '-' | '*' | '/' | '.'
     AnalisadorSintatico.prototype.OpArit = function() {
        var no = new No("OpArit", null);
        if(this.token.imagem === "+" || this.token.imagem === "-" || this.token.imagem === "*" || this.token.imagem === "/" || this.token.imagem === "." ) {
            no.add(new No("Token", this.token));
            this.leToken();
        } else {
            this.erros.push("Esperado '+', '-', '*', '/' ou '.'. Token atual: "+this.token.toString());
        }
        return no;
    };
    
    //<Escrita> ::= 'stampa' <Expr_Arit>
    AnalisadorSintatico.prototype.Escrita = function() {
        var no = new No("Escrita", null);
        if(this.token.imagem === "stampa") {
            no.add(new No("Token", this.token));
            this.leToken();
            no.add(this.ExprArit());
        } else {
            this.erros.push("Esperado 'stampa'. Token atual: "+this.token.toString());
        }
        return no;
    };       
           
    //<Leitura> ::= 'entrare' id
    AnalisadorSintatico.prototype.Leitura = function() {
        var no = new No("Leitura", null);
        if(this.token.imagem === "entrare") {
            no.add(new No("Token", this.token));
            this.leToken();
            if(this.token.classe === "ID") {
                no.add(new No("Token", this.token));
                this.leToken();
            } else {
                this.erros.push("Esperado ID. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado 'entrare'. Token atual: "+this.token.toString());
        }
        return no;
    };
           
    //<Laco> ::= 'mentre' <Expr_Log> <List_Coman>
    AnalisadorSintatico.prototype.Laco = function() {
        var no = new No("Laco", null);
        if(this.token.imagem === "mentre") {
            no.add(new No("Token", this.token));
            this.leToken();
            no.add(this.ExprLog());
            no.add(this.ListComan());
        } else {
            this.erros.push("Esperado 'mentre'. Token atual: "+this.token.toString());
        }
        return no;
    };
        
    //metodo lookAhead para resolver a duvida do metodo ExprLog
    AnalisadorSintatico.prototype.lookAhead = function() {
        return this.tokens[this.pToken];
    };    
        
    //<Expr_Log> ::= '(' <Op_Log> <Expr_Log> <Expr_Log> ')' | <Expr_Rel>
    AnalisadorSintatico.prototype.ExprLog = function() {
        var no = new No("ExprLog", null);
        var ahead = this.lookAhead();
        if(this.token.imagem === "(") {
            if(ahead.imagem === "&&" || ahead.imagem === "||") {
                no.add(new No("Token", this.token));
                this.leToken(); //lendo o '('
                no.add(this.OpLog());
                no.add(this.ExprLog());
                no.add(this.ExprLog());
                if(this.token.imagem === ")") {
                    no.add(new No("Token", this.token));
                    this.leToken();
                } else {
                    this.erros.push("Esperado ')'. Token atual: "+this.token.toString());
                }
            } else {
                no.add(this.ExprRel());
            }
        } else {
            this.erros.push("Esperado '('. Token atual: "+this.token.toString());
        }
        return no;
    };
            
    //<Op_Log> ::= '&&' | '||'
    AnalisadorSintatico.prototype.OpLog = function() {
        var no = new No("OpLog", null);
        if(this.token.imagem === "&&" || this.token.imagem === "||") {
            no.add(new No("Token", this.token));
            this.leToken(); 
        } else {
            this.erros.push("Esperado '&&' ou '||'. Token atual: "+this.token.toString());
        }
        return no;
    };
          
    //<Expr_Rel> ::= '(' <Op_Rel> <Expr_Arit> <Expr_Arit> ')'
    AnalisadorSintatico.prototype.ExprRel = function() {
        var no = new No("ExprRel", null);
        if(this.token.imagem === "(") {
            no.add(new No("Token", this.token));
            this.leToken();
            no.add(this.OpRel());
            no.add(this.ExprArit());
            no.add(this.ExprArit());
            if(this.token.imagem === ")") {
                no.add(new No("Token", this.token));
                this.leToken();
            } else {
                this.erros.push("Esperado ')'. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado '('. Token atual: "+this.token.toString());
        }
        return no;
    };
            
    //<Op_Rel> ::= '>' | '<' | '<=' | '>=' | '==' | '!='
    AnalisadorSintatico.prototype.OpRel = function() {
        var no = new No("OpRel", null);
        if(this.token.imagem === ">" || this.token.imagem === "<" || this.token.imagem === "<=" || this.token.imagem === ">=" || this.token.imagem === "==" || this.token.imagem === "!=" ) {
            no.add(new No("Token", this.token));
            this.leToken();
        } else {
            this.erros.push("Esperado '>', '<', '>=', '<=', '==' ou '!='. Token atual: "+this.token.toString());
        }
        return no;
    };
          
    //<Cond> ::= 'si' <Expr_Log> <Coman> <Senao>
    AnalisadorSintatico.prototype.Cond = function() {
        var no = new No("Cond", null);
        if(this.token.imagem === "si") {
            no.add(new No("Token", this.token));
            this.leToken();
            no.add(this.ExprLog());
            no.add(this.Coman());
            no.add(this.Senao());
        } else {
            this.erros.push("Esperado 'si'. Token atual: "+this.token.toString());
        }
        return no;
    };
         
    //<Senao> ::= <Coman> |
    AnalisadorSintatico.prototype.Senao = function() {
        var no = new No("Senao", null);
        if(this.token.imagem === "(") {
            no.add(this.Coman());
        }
        return no;
    };
    
}

function AnalisadorSemantico(raiz) {
    this.raiz = raiz;
    this.erros = new Array();
    
    AnalisadorSemantico.prototype.temErros = function () {
        return this.erros.length !== 0;
    };
    
    AnalisadorSemantico.prototype.mostraErros = function () {
        var saida = document.getElementById("saida");
        var conteudo = "\n";
        for(var i=0; i<this.erros.length; i++) {
            conteudo = conteudo + "Erro semântico: "+this.erros[i]+ "\n";
        }
        saida.value = saida.value + conteudo;
    };
    
    AnalisadorSemantico.prototype.analisar = function() {
        this.analisa(this.raiz);
    };
    
    AnalisadorSemantico.prototype.analisa = function(no) {
        switch (no.tipo) {
            case "ListComan": return this.ListComan(no);
            case "Coman": return this.Coman(no);
            case "ComanInter": return this.ComanInter(no);        
            case "Decl": return this.Decl(no);
            case "Tipo": return this.Tipo(no);
            case "ListId": return this.ListId(no);
            case "ListId2": return this.ListId2(no);
            case "Atrib": return this.Atrib(no);
            case "ExprArit": return this.ExprArit(no);
            case "Operan": return this.Operan(no);
            case "OpArit": return this.OpArit(no);
            case "Escrita": return this.Escrita(no);
            case "Leitura": return this.Leitura(no);
            case "Laco": return this.Laco(no);
            case "ExprLog": return this.ExprLog(no);
            case "OpLog": return this.OpLog(no);
            case "ExprRel": return this.ExprRel(no);
            case "OpRel": return this.OpRel(no);
            case "Cond": return this.Cond(no);
            case "Senao": return this.Senao(no);
            case "Token": break;
            default : throw new Error("Tipo de no nao existente! Método AnalisadorSemantico.analisa(no). No: "+no.toString());
        }
    };
    
    //<List_Coman> ::= <Coman> <List_Coman> |
    AnalisadorSemantico.prototype.ListComan = function(no){
        if(no.filhos.length > 0) {
            this.analisa(no.get(0));
            this.analisa(no.get(1));
        }
    };
    
    //<Coman> ::= '(' <Coman_Inter> ')'
    AnalisadorSemantico.prototype.Coman = function(no) {
        this.analisa(no.get(1));
    };
    
    //<Coman_Inter> ::= <Atrib> | <Decl> | <Escrita> | <Leitura> | <Laco> | <Cond> | <List_Coman>
    AnalisadorSemantico.prototype.ComanInter = function(no) {
        this.analisa(no.get(0));
    };
    
    //<Decl> ::= <Tipo> <List_Id>
    AnalisadorSemantico.prototype.Decl = function(no) {
        var tipo = this.analisa(no.get(0));
        var listId = this.analisa(no.get(1));
        for(var i=0; i<listId.length; i++) {
            var id = listId[i];
            if(tabelaSimbolos.getTipo(id) !== "") {
                this.erros.push("Identificador redeclarado. Linha: " + id.linha +". Token: "+id.toString());
            }
            tabelaSimbolos.setTipo(id, tipo);
        }
    };
    
    //<Tipo> ::= 'intero' | 'vero' | 'corda' | 'booleano'
    AnalisadorSemantico.prototype.Tipo = function(no){
        return no.get(0).token.imagem;
    };
    
    //<List_Id> ::= id <List_Id2>
    AnalisadorSemantico.prototype.ListId = function(no) {
        var id = no.get(0).token;
        var listId2 = this.analisa(no.get(1));
        listId2.unshift(id);
        return listId2;
    };
    
    //<List_Id2> ::= id <List_Id2> |
    AnalisadorSemantico.prototype.ListId2 = function(no) {
        if(no.filhos.length > 0) {
            var id = no.get(0).token;
            var listId2 = this.analisa(no.get(1));
            listId2.unshift(id);
            return listId2;
        } else {
            return new Array();
        }
    };
    
    //<Atrib> ::= '=' id <Expr_Arit> 
    AnalisadorSemantico.prototype.Atrib = function(no) {
        var id = no.get(1).token;
        var tipoId = tabelaSimbolos.getTipo(id);
        if(tabelaSimbolos.getTipo(id) === "") {
            this.erros.push("Identificador não declarado. Linha: " + id.linha +". Token: "+id.toString());
        } else {
            var exprArit = this.analisa(no.get(2));
            for(var i=0; i<exprArit.length; i++) {
                var operan = exprArit[i];
                var tipoOperan = tabelaSimbolos.getTipo(operan);
                if( tipoOperan === "") {
                    this.erros.push("Identificador não declarado. Linha: " + operan.linha +". Token: "+operan.toString());
                } else if(tipoId !== tipoOperan) {
                    this.erros.push("Tipo de operando incompatível com o tipo do id do lado esquerdo. Linha: " + operan.linha +". Token: "+operan.toString());
                }
            }
        }
    };
    
    //<Expr_Arit> ::= <Operan> | '(' <Op_Arit> <Expr_Arit> <Expr_Arit> ')'
    AnalisadorSemantico.prototype.ExprArit = function(no) {
        if(no.filhos.length === 1) {
            var operan = this.analisa(no.get(0));
            var array = new Array();
            array.push(operan);
            return array;
        } else {
            var exprArit1 = this.analisa(no.get(2));
            var exprArit2 = this.analisa(no.get(3));
            var opArit = this.analisa(no.get(1));
            if(opArit.imagem === ".") {
                return exprArit1.concat(exprArit2);
            } else {
                var tudo = exprArit1.concat(exprArit2);
                var operan0 = tudo[0];
                var tipoOperan0 = tabelaSimbolos.getTipo(operan0);
                if(tipoOperan0 === "") {
                    this.erros.push("Identificador não declarado. Linha: " + operan0.linha +". Token: "+operan0.toString());
                } 
                for(var i=1; i<tudo.length; i++) {
                    var operan = tudo[i];
                    var tipoOperan = tabelaSimbolos.getTipo(operan);
                    if( tipoOperan === "") {
                        achouErro = true;
                        this.erros.push("Identificador não declarado. Linha: " + operan.linha +". Token: "+operan.toString());
                    } if(tipoOperan !== tipoOperan0) {
                        this.erros.push("Tipo de operando incompatível na expressao. Linha: " + operan.linha +". Token: "+operan.toString());
                    }
                }
                return tudo;
            }
            
        }
    };
    
    //<Operan> ::= id | cli | cls | clr
    AnalisadorSemantico.prototype.Operan = function(no) {
        return no.get(0).token;
    };      
          
    //<Op_Arit> ::= '+' | '-' | '*' | '/' | '.'
    AnalisadorSemantico.prototype.OpArit = function(no) {
        return no.get(0).token;
    };
           
    //<Escrita> ::= 'stampa' <Expr_Arit>
    AnalisadorSemantico.prototype.Escrita = function(no) {
        var exprArit = this.analisa(no.get(1));
        for(var i=0; i<exprArit.length; i++) {
            var operan = exprArit[i];
            var tipoOperan = tabelaSimbolos.getTipo(operan);
            if( tipoOperan === "") {
                this.erros.push("Identificador não declarado. Linha: " + operan.linha +". Token: "+operan.toString());
            } 
        }
    };
           
    //<Leitura> ::= 'entrare' id
    AnalisadorSemantico.prototype.Leitura = function(no) {
        
    };
           
    //<Laco> ::= 'mentre' <Expr_Log> <List_Coman>
    AnalisadorSemantico.prototype.Laco = function(no) {
        
    };
        
    //<Expr_Log> ::= '(' <Op_Log> <Expr_Log> <Expr_Log> ')' | <Expr_Rel>
    AnalisadorSemantico.prototype.ExprLog = function(no) {
        
    };
            
    //<Op_Log> ::= '&&' | '||'
    AnalisadorSemantico.prototype.OpLog = function(no) {
        
    };
          
    //<Expr_Rel> ::= '(' <Op_Rel> <Expr_Arit> <Expr_Arit> ')'
    AnalisadorSemantico.prototype.ExprRel = function(no) {
        
    };
            
    //<Op_Rel> ::= '>' | '<' | '<=' | '>=' | '==' | '!='
    AnalisadorSemantico.prototype.OpRel = function(no) {
        
    };
          
    //<Cond> ::= 'si' <Expr_Log> <Coman> <Senao>
    AnalisadorSemantico.prototype.Cond = function(no) {
        
    };
         
    //<Senao> ::= <Coman> |
    AnalisadorSemantico.prototype.Senao = function(no) {
        
    };
    
}

//classe main do aplicativo
function main() {
    tabelaSimbolos = new TabelaSimbolos();
    document.getElementById("saida").value = "";        //limpar a 'saida'
    var codigoFonte = document.getElementById("codigo").value;
    
    //Análise Léxica
    var analisadorLexico = new AnalisadorLexico(codigoFonte);
    analisadorLexico.analisar();
    if(analisadorLexico.temErros()) {
        analisadorLexico.mostraErros();
        return;
    }    
    analisadorLexico.mostraTokens();
    analisadorLexico.mostraSimbolos();
    
    //Análise Sintática
    var analisadorSintatico = new AnalisadorSintatico(analisadorLexico.tokens);
    analisadorSintatico.analisar();
    if(analisadorSintatico.temErros()) {
        analisadorSintatico.mostraErros();
        return;
    }
    
    analisadorSintatico.mostraArvore();
    
    var analisadorSemantico = new AnalisadorSemantico(analisadorSintatico.raiz);
    analisadorSemantico.analisar();
    if(analisadorSemantico.temErros()) {
        analisadorSemantico.mostraErros();
        return;
    }
    
    analisadorLexico.mostraSimbolos();
    
    document.getElementById("saida").scrollTop = 99999;  //rolar pro fim
    window.alert("SUCESSO!");
}