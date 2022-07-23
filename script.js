var velha = [[0,0,0],
             [0,0,0],
             [0,0,0]]

var jogador = 1;
var ganhador = 0;

// Sera executado apos o carregamento da pagina

function mudarJogador(){
  jogador = jogador * -1;
}

function verificarVitoria(){
  if (((velha[0][0] + velha[1][1] + velha[2][2])==3)||((velha[0][2] + velha[1][1] + velha[2][0])==3)){
    ganhador = 1;
  }
  else if((velha[0][0] + velha[1][1] + velha[2][2]==-3)||(velha[0][2] + velha[1][1] + velha[2][0]==-3)){
    ganhador = -1;
  }
  else{
    for(let cont=0; cont<3; cont++){

      if(velha[cont][0] + velha[cont][1] + velha[cont][2] == '3'){
        ganhador = 1
      }
      else if(velha[cont][0] + velha[cont][1] + velha[cont][2] == "-3"){
        ganhador = -1
      }
  
      if(velha[0][cont] + velha[1][cont] + velha[2][cont] == '3'){
        ganhador = 1
      }
      else if(velha[0][cont] + velha[1][cont] + velha[2][cont] == "-3"){
        ganhador = -1
      }
    }
  }
  if(ganhador==1){    
    document.getElementById("titulo").innerText = "GANHADOR 1";
    console.log('ganhou 1')
  }
  else if(ganhador ==-1){
    document.getElementById("titulo").innerText = "GANHADOR -1";
    console.log('ganhou -1')
  }

  

}

window.onload = function() {
    // vamos pegar todos os botoes:
    var botoes = document.querySelectorAll(".botoes");
    
    for(let i=0;i<botoes.length;i++) {
      
      var botao = botoes[i];
      
      // O jeito correto e padronizado de incluir eventos no ECMAScript
      // (Javascript) eh com addEventListener:
      botao.addEventListener("click", function(){
        if (this.value=="0" && ganhador==0){
          this.value = parseInt(this.value)+ jogador;
          this.innerText = jogador;
          this.style.border = "0.5em solid black"
          idMod=parseInt(this.id)
          if (idMod<3){
            velha[0][idMod] = parseInt(this.value)
          }
          else if (idMod<6){
            velha[1][idMod-3] = parseInt(this.value) 
          }
          else{
            velha[2][idMod-6] = parseInt(this.value) 
          }
        }
        console.log(velha);
        mudarJogador();
        verificarVitoria();
      });
    }
 };

 