//classe TabelasEstaticas
function TabelasEstaticas() {
    this.palavrasReservadas = ["intero", "vero", "corda", "si", "mentre", "stampa", "entrare", "booleano"];
    this.delimitadores = ["(", ")"];
    this.operadores = ["+", "-", "*", "/", "<", ">", "<=", ">=", "==", "!=", "=", "."];
    
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
        return this.imagem + " " + this.tipo + " " + this.valor;
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
}

//objeto global para acesso a tabela de simbolos
var tabelaSimbolos = new TabelaSimbolos();

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
        var cli = new RegExp("^\\d\\d*$");
        var clr = new RegExp("^\\d\\d*\\.\\d\\d*$");
        var id = new RegExp("^\\w(\\w|\\d)*$");
        var linhas = this.codigo.split("\n");
        for(var i=0; i<linhas.length; i++) {
            //console.log("linha: "+linhas[i].trim());
            var lexemas = linhas[i].trim().split(" ");
            for(var j=0; j<lexemas.length; j++){
                //console.log("lexema: "+lexemas[j]);
                var imagem = lexemas[j];
                if(imagem.length > 0 && imagem.charAt(0) === '"') {
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

function No() {
    
};

function AnalisadorSintatico(tokens) {
    
    this.token = "";
    this.tokens = tokens;
    this.erros = new Array();
    this.pToken = 0;
    
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
    
    AnalisadorSintatico.prototype.analisar = function() {
        this.pToken = 0;
        this.leToken();
        this.ListComan();
        if(this.token.imagem !== "$") {
            this.erros.push("Esperado EOF.");
        }
    };
    
    //<List_Coman> ::= <Coman> <List_Coman> |
    AnalisadorSintatico.prototype.ListComan = function() {
        if(this.token.imagem === "(") {
            this.Coman();
            this.ListComan();
        }
    };
              
    //<Coman> ::= '(' <Coman_Inter> ')'
    AnalisadorSintatico.prototype.Coman = function() {
        if(this.token.imagem === "(") {
            this.leToken();
            this.ComanInter();
            if(this.token.imagem === ")") {
                this.leToken();
            } else {
                this.erros.push("Esperado ')'. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado '('. Token atual: "+this.token.toString());
        }
    };     
         
    //<Coman_Inter> ::=  <Decl> | <Atrib> | <Escrita> | <Leitura> | <Laco> | <Cond> | <List_Coman>
     AnalisadorSintatico.prototype.ComanInter = function() {
        if(this.token.imagem === "intero" || this.token.imagem === "vero" || this.token.imagem === "corda" || this.token.imagem === "booleano") {
            this.Decl();
        } else if(this.token.imagem === "=") {
            this.Atrib();
        } else if(this.token.imagem === "stampa") {
            this.Escrita();
        } else if(this.token.imagem === "entrare") {
            this.Leitura();
        } else if(this.token.imagem === "mentre") {
            this.Laco();
        } else if(this.token.imagem === "si") {
            this.Cond();
        } else if(this.token.imagem === "(") {
            this.ListComan();
        } else {
            this.erros.push("Esperado '=', 'intero', 'vero', 'corda', 'booleano', 'stampa', 'estrare', 'mentre', 'si' ou '('. Token atual: "+this.token.toString());
        }
     };
               
    //<Decl> ::= <Tipo> <List_Id>
    AnalisadorSintatico.prototype.Decl = function() {
        this.Tipo();
        this.ListId();
    };
        
    //<Tipo> ::= 'intero' | 'vero' | 'corda' | 'booleano'
    AnalisadorSintatico.prototype.Tipo = function() {
        if(this.token.imagem === "intero" || this.token.imagem === "vero" || this.token.imagem === "corda" || this.token.imagem === "booleano") {
            this.leToken();
        } else {
            this.erros.push("Esperado intero', 'vero', 'corda' ou 'booleano'. Token atual: "+this.token.toString());
        }
    };
        
    //<List_Id> ::= id <List_Id2>
    AnalisadorSintatico.prototype.ListId = function() {
        if(this.token.classe === "ID") {
            this.leToken();
            this.ListId2();
        } else {
            this.erros.push("Esperado ID. Token atual: "+this.token.toString());
        }
    };
           
    //<List_Id2> ::= id <List_Id2> |
    AnalisadorSintatico.prototype.ListId2 = function() {
        if(this.token.classe === "ID") {
            this.leToken();
            this.ListId2();
        } 
    };
            
    //<Atrib> ::= '=' id <Expr_Arit> 
    AnalisadorSintatico.prototype.Atrib = function() {
        if(this.token.imagem === "=") {
            this.leToken();
            if(this.token.classe === "ID") {
                this.leToken();
                this.ExprArit();
            } else {
                this.erros.push("Esperado ID. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado '='. Token atual: "+this.token.toString());
        }
       
    };
         
    //<Expr_Arit> ::= <Operan> | '(' <Op_Arit> <Expr_Arit> <Expr_Arit> ')'
    AnalisadorSintatico.prototype.ExprArit = function() {
        if(this.token.classe === "ID" || this.token.classe === "CLI" || this.token.classe === "CLR" || this.token.classe === "CLS") {
            this.Operan();
        } else if(this.token.imagem === "(") {
            this.leToken();
            this.OpArit();
            this.ExprArit();
            this.ExprArit();
            if(this.token.imagem === ")") {
                this.leToken();
            } else {
                this.erros.push("Esperado ')'. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado ID, CLI, CLR, CLS ou '('. Token atual: "+this.token.toString());
        }
    };         
             
    //<Operan> ::= id | cli | cls | clr
    AnalisadorSintatico.prototype.Operan = function() {
        if(this.token.classe === "ID" || this.token.classe === "CLI" || this.token.classe === "CLR" || this.token.classe === "CLS") {
            this.leToken();
        } else {
            this.erros.push("Esperado ID, CLI, CLR ou CLS. Token atual: "+this.token.toString());
        }
    };
    
    //<Op_Arit> ::= '+' | '-' | '*' | '/' | '.'
     AnalisadorSintatico.prototype.OpArit = function() {
        if(this.token.imagem === "+" || this.token.imagem === "-" || this.token.imagem === "*" || this.token.imagem === "/" || this.token.imagem === "." ) {
            this.leToken();
        } else {
            this.erros.push("Esperado '+', '-', '*', '/' ou '.'. Token atual: "+this.token.toString());
        }
    };
    
    //<Escrita> ::= 'stampa' <Expr_Arit>
    AnalisadorSintatico.prototype.Escrita = function() {
        if(this.token.imagem === "stampa") {
            this.leToken();
            this.ExprArit();
        } else {
            this.erros.push("Esperado 'stampa'. Token atual: "+this.token.toString());
        }
    };       
           
    //<Leitura> ::= 'entrare' id
    AnalisadorSintatico.prototype.Leitura = function() {
        if(this.token.imagem === "entrare") {
            this.leToken();
            if(this.token.classe === "ID") {
                this.leToken();
            } else {
                this.erros.push("Esperado ID. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado 'entrare'. Token atual: "+this.token.toString());
        }
    };
           
    //<Laco> ::= 'mentre' <Expr_Log> <List_Coman>
    AnalisadorSintatico.prototype.Laco = function() {
        if(this.token.imagem === "mentre") {
            this.leToken();
            this.ExprLog();
            this.ListComan();
        } else {
            this.erros.push("Esperado 'mentre'. Token atual: "+this.token.toString());
        }
    };
        
    //metodo lookAhead para resolver a duvida do metodo ExprLog
    AnalisadorSintatico.prototype.lookAhead = function() {
        return this.tokens[this.pToken];
    };    
        
    //<Expr_Log> ::= '(' <Op_Log> <Expr_Log> <Expr_Log> ')' | <Expr_Rel>
    AnalisadorSintatico.prototype.ExprLog = function() {
        var ahead = this.lookAhead();
        if(this.token.imagem === "(") {
            if(ahead === "&&" || ahead === "||") {
                this.leToken(); //lendo o '('
                this.OpLog();
                this.ExprLog();
                this.ExprLog();
                if(this.token.imagem === ")") {
                    this.leToken();
                } else {
                    this.erros.push("Esperado ')'. Token atual: "+this.token.toString());
                }
            } else {
                this.ExprRel();
            }
        } else {
            this.erros.push("Esperado '('. Token atual: "+this.token.toString());
        }
    };
            
    //<Op_Log> ::= '&&' | '||'
    AnalisadorSintatico.prototype.OpLog = function() {
        if(ahead === "&&" || ahead === "||") {
            this.leToken(); 
        } else {
            this.erros.push("Esperado '&&' ou '||'. Token atual: "+this.token.toString());
        }
    };
          
    //<Expr_Rel> ::= '(' <Op_Rel> <Expr_Arit> <Expr_Arit> ')'
    AnalisadorSintatico.prototype.ExprRel = function() {
        if(this.token.imagem === "(") {
            this.leToken();
            this.OpRel();
            this.ExprArit();
            this.ExprArit();
            if(this.token.imagem === ")") {
                this.leToken();
            } else {
                this.erros.push("Esperado ')'. Token atual: "+this.token.toString());
            }
        } else {
            this.erros.push("Esperado '('. Token atual: "+this.token.toString());
        }
    };
            
    //<Op_Rel> ::= '>' | '<' | '<=' | '>=' | '==' | '!='
    AnalisadorSintatico.prototype.OpRel = function() {
        if(this.token.imagem === ">" || this.token.imagem === "<" || this.token.imagem === "<=" || this.token.imagem === ">=" || this.token.imagem === "==" || this.token.imagem === "!=" ) {
            this.leToken();
        } else {
            this.erros.push("Esperado '>', '<', '>=', '<=', '==' ou '!='. Token atual: "+this.token.toString());
        }
    };
          
    //<Cond> ::= 'si' <Expr_Log> <Coman> <Senao>
    AnalisadorSintatico.prototype.Cond = function() {
        if(this.token.imagem === "si") {
            this.leToken();
            this.ExprLog();
            this.Coman();
            this.Senao();
        } else {
            this.erros.push("Esperado 'si'. Token atual: "+this.token.toString());
        }
    };
         
    //<Senao> ::= <Coman> |
    AnalisadorSintatico.prototype.Senao = function() {
        if(this.token.imagem === "(") {
            this.Coman();
        }
    };
    
}

//classe main do aplicativo
function main() {
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
    
    window.alert("SUCESSO!");
    analisadorSintatico.mostraArvore();
    
    
}