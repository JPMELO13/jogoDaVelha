

var velha = [[0,0,0],
             [0,0,0],
             [0,0,0]]







// Sera executado apos o carregamento da pagina
window.onload = function() {
    // vamos pegar todos os botoes:
    var botoes = document.querySelectorAll(".botoes");
       
    for(var i=0;i<botoes.length;i++) {
      
      var botao = botoes[i];
      
       
      console.log(botao.id);
      
      // O jeito correto e padronizado de incluir eventos no ECMAScript
      // (Javascript) eh com addEventListener:
      botao.addEventListener("click", function(){
        if (this.value=="0"){
          this.value = parseInt(this.value)+1;
          this.innerText = "1";
          idMod=parseInt(this.id)
          if (idMod<3){
            velha[0][idMod] = this.value 
          }
          else if (idMod<6){
            velha[1][idMod-3] = this.value 
          }
          else{
            velha[2][idMod-6] = this.value 
          }
        }
      });
    }
 };

 