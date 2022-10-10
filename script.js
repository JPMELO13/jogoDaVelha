
var velha = [[0, 0, 0],
             [0, 0, 0],
             [0, 0, 0]]
var jogada = 0;
var jogador = 0;
var ganhador = 0;
var player1 = "";
var player2 = "";
var modo = "";
var dificuldade = "";

const form = document.getElementById('form_players');

function mudarTema(destaque, secundaria, fundo, hover) {
  //passando codigos hex das cores por parâmetro é alterada no arquivo css
  document.documentElement.style.setProperty('--cor-destaque', destaque);
  document.documentElement.style.setProperty('--cor-secundaria', secundaria);
  document.documentElement.style.setProperty('--cor-de-fundo', fundo);
  document.documentElement.style.setProperty('--cor-hover-botao', hover);
}

function verificarNomesIguais(nome1, nome2){
  let resultado = 0
  if (nome1==nome2){
    resultado =1;
  }
  return resultado;
}


function sorteiaPrimeiroJogador(){
  let x = Math.random();
  if(x>0.5){
    jogador = -1;
    document.getElementById("titulo").innerHTML="Vez de "+player2
  }
  else{
    jogador = 1;
    document.getElementById("titulo").innerHTML="Vez de "+player1
  }
}

function mudarJogador() {
  // multiplicação por -1 faz o jogador "atual" alternar em -1 e 1. Função altera exibição do turno
  jogador = jogador * -1;
  if (jogador == 1){
    document.getElementById("titulo").innerHTML="Vez de "+player1
  }
  else{
    document.getElementById("titulo").innerHTML="Vez de "+player2
  }
  jogada ++;

  if (modo=="single"){
    if (jogador==-1){
      removeListenerBotoes();
      botJogar();
    }
    else{
      addListenerBotoes0();
    }

  }

}

function iniciar() {
  let botoes = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      velha[i][j] = 0;
      botoes[3 * i + j].innerHTML = "";
      botoes[3 * i + j].value = "0";
      botoes[3 * i + j].classList.remove("destaque__vitoria")
      document.getElementById("titulo").classList.remove("destaque_titulo");
    }
  }
  ganhador = 0;
  jogada = 0;

  sorteiaPrimeiroJogador();
  if ((jogador == -1)&&(modo == "single")){
    botJogar();
  }
  else{
    addListenerBotoes0();
  }
}

function addListenerBotoes0(){
  let botoes = document.querySelectorAll(".botoes");
  //2 laços for para percorrer matriz 3x3 para aplicar a classe selecionavel e "escutar" cliques de todos botões
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if(velha[i][j]==0){
        botoes[3 * i + j].classList.add("selecionavel");
        botoes[3 * i + j].addEventListener("click", cliqueBotao);
      }
      
    }
  }
}

function cliqueBotao(obj){
  if (obj.target.value == "0" && ganhador == 0) {
    obj.target.classList.remove("selecionavel")
    obj.target.value = jogador;
    if (jogador == 1) {
      obj.target.innerHTML = "&#10005"
    } else if (jogador == -1) {
      obj.target.innerHTML = "&#9711"
    }
    idMod = parseInt(obj.target.id.substr(-1))
    // Math.floor(idMod/3) faz a "divisão inteira" no JS e % pega o resto da divisão
    velha[Math.floor(idMod / 3)][idMod % 3] = parseInt(obj.target.value)
    verificarVitoria(idMod);
    
  }
}

function verificaSomaAlinhada(valor, estrutura){
  //retorna a posição da estrutura onde deve ser jogado
  for (let i=0; i<3;i++){
    if(estrutura=="linha"){
      if((velha[i][0]+velha[i][1]+velha[i][2]) == valor){
        for(let j=0;j<3;j++){
          if (velha[i][j] ==0){
            return (i*3+j);
          }
        }
      }
    }
    else if(estrutura=="coluna"){
      if((velha[0][i]+velha[1][i]+velha[2][i]) == valor){
        for(let j=0;j<3;j++){
          if (velha[j][i] ==0){
            return (j*3+i);
          }
        }
      }
    }
    else if((estrutura=="diagonal")&&(i!=1)){
      if ((velha[0][i]+velha[1][1]+velha[2][2-i])==valor){
        if (velha[0][i]==0){
          return i;
        }
        else if (velha[1][1]==0){
          return 4;
        }
        else if (velha[2][2-i]==0){
          return 6+(2-i);
        }
      } 
    }
  }
  return -1;
}


function botJogar(){
  let botaoEscolhido;
  if (dificuldade=="facil"){
    //soma diagonal ou linha ou coluna for igual a - 2 ele joga alinhado(+prioridade)
    //soma diagonal ou linha ou coluna for igual a 2 ele joga alinhado(-prioridade)
    let ganhaLinha = verificaSomaAlinhada(-2, "linha");
    let ganhaColuna = verificaSomaAlinhada(-2, "coluna");
    //GANHAR DIAGONAL NAO ESTÁ FUNCIONANDO REVER
    let ganhaDiagonal = verificaSomaAlinhada(-2, "diagonal");
    let bloqLinha = verificaSomaAlinhada(2, "linha");
    let bloqColuna = verificaSomaAlinhada(2, "coluna");
    //REVER BLOQUEIO DIAGONAL -> NAO ESTÁ FUNCIONANDO
    let bloqDiagonal = verificaSomaAlinhada(2, "diagonal");
    if(ganhaLinha>-1){
      botaoEscolhido=ganhaLinha;
    }else if(ganhaColuna>-1){
      botaoEscolhido=ganhaColuna;
    }else if(ganhaDiagonal>-1){
      botaoEscolhido=ganhaDiagonal;
    }else if(bloqLinha>-1){
      botaoEscolhido=bloqLinha;
    }else if(bloqColuna>-1){
      botaoEscolhido=bloqColuna;
    }else if(bloqDiagonal>-1){
      botaoEscolhido=bloqDiagonal;
    }else{
      
      do{
        botaoEscolhido = Math.floor(Math.random() * 9);
      }while (velha[Math.floor(botaoEscolhido / 3)][botaoEscolhido%3] != 0)
    }
    
    let botoes = document.querySelectorAll(".botoes");
    let obj=botoes[botaoEscolhido];
      
    if (obj.value == "0" && ganhador == 0) {
      obj.classList.remove("selecionavel")
      obj.value = jogador;
      setTimeout(() => {
        obj.innerHTML = "&#9711" 
        idMod = parseInt(obj.id.slice(-1));
        // Math.floor(idMod/3) faz a "divisão inteira" no JS e % pega o resto da divisão
        velha[Math.floor(idMod / 3)][idMod % 3] = parseInt(obj.value);
        verificarVitoria(idMod);
      }, 500);
    }
    
    
  }
  

}

function verificarVitoria(id){
  let somaLinha=0;
  let somaColuna=0;
  let somaDiagonal0=0;
  let somaDiagonal2=0;
  for(let i=0;i<3;i++){
    somaLinha+=velha[Math.floor(id / 3)][i]
    somaColuna+=velha[i][id%3]
    if (id==4){
      somaDiagonal0 += velha[i][i];
      somaDiagonal2 += velha[i][2-i]
    }
    else if (id%8==0){
      somaDiagonal0 += velha[i][i];
    }
    else if (id%2==0){
      somaDiagonal2 += velha[i][2-i];
    }
  }
  if(somaDiagonal0 == (3*jogador)){
    ganhador = jogador;
    destacarDiagonal(0)
  }else if(somaDiagonal2 == (3*jogador)){
    ganhador = jogador;
    destacarDiagonal(2)
  } else if (somaLinha == (3*jogador)){
    ganhador = jogador;
    destacarLinha(id);
  } else if (somaColuna == (3*jogador)){
    ganhador = jogador;
    destacarColuna(id);
  }
  if (ganhador == 1) {
    document.getElementById("titulo").innerText = player1 + " venceu!";
    terminar();
  }
  else if (ganhador == -1) {
    document.getElementById("titulo").innerText = player2 + " venceu!";
    terminar();
  }
  else if (ganhador == 0 && jogada ==8)
  {
    terminar()
    document.getElementById("titulo").innerText = "Empate!";
    destacarColuna(0);
    destacarColuna(1);
    destacarColuna(2);

  }
  else{
    mudarJogador();
  }
}

function destacarLinha(id) {
  let inicio = (Math.floor(id / 3))*3
  document.getElementById(('b' + inicio)).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio+1))).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio+2))).classList.add("destaque__vitoria");
}

function destacarColuna(id) {
  let inicio = id%3
  document.getElementById(('b' + inicio)).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio+3))).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio+6))).classList.add("destaque__vitoria");
}

function destacarDiagonal(diag) {
  document.getElementById(('b4')).classList.add("destaque__vitoria");
  document.getElementById('b' + diag).classList.add("destaque__vitoria");
  document.getElementById('b' + (8-diag)).classList.add("destaque__vitoria");
}

function removeListenerBotoes(){
  let botoes = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      botoes[3 * i + j].classList.remove("selecionavel");
      botoes[3 * i + j].removeEventListener("click", cliqueBotao);
    }
  }
}

function terminar() {
  removeListenerBotoes();
  document.getElementById("titulo").classList.add("destaque_titulo");
}

function reiniciar() {
  terminar();
  iniciar();
}

function mensagemDeErro(mensagem){
  form.insertAdjacentHTML("beforeend", "<h3 class='conteudo__titulo' >"+ mensagem+"</h3>")
  setTimeout(() => {
    document.querySelector("h3").remove();
  }, 1000);
}

function capturaDadosForm(e){
  e.preventDefault();
    player1 = "Player1"
    if(form.elements[2].value != ""){
      player1=form.elements[2].value;
    }
    if (modo == "single"){
      player2 = "BOT";
      dificuldade = form.dificuldade.value
    }// if (modo==single)
    else{
      player2 = "Player2"
      if(form.elements[3].value != ""){
        player2=form.elements[3].value;
      }
    }//(if modo==multi)
    if(verificarNomesIguais(player1,player2)==0){
      if(!((modo=="single")&&(dificuldade==""))){
        if(!((modo=="single")&&(dificuldade=="dificil"))){
          document.getElementsByClassName("modal")[0].classList.add("modal__concluido");
          iniciar();
        }
        else{
          mensagemDeErro("Não disponível!");
        }
      }
      else{
        mensagemDeErro("Dificuldade Inválida!");
      }      
    }else{
      mensagemDeErro("Nome(s) Inválido(s)!");
    }

}



window.onload = function () {
  document.getElementById("reiniciar__botao").addEventListener("click", reiniciar)
  var gameMode = form.switchMode;
  for(let i=0;i<gameMode.length;i++){
    gameMode[i].onclick = function(){
      modo = this.value;
      let campos = document.getElementsByClassName("player__field");
      let botaoJogar = document.getElementsByClassName("jogar");
      for(let j=0;j<campos.length;){
        campos[j].remove();
      }
      if(botaoJogar.length>0){
        botaoJogar[0].remove();
      }      
      form.insertAdjacentHTML("beforeend", "<div class='player__field'><span class='player__icon'>&#10005 </span><input type='text' class='player__input' name='player1' placeholder='Player1'></div>");
      
      if (modo=="single"){
        player2="BOT";
        form.insertAdjacentHTML("beforeend", "<div class='player__field'><div class='switch-field'><input type='radio' id='radio-facil' name='dificuldade' value='facil' ><label for='radio-facil'>Fácil</label><input type='radio' id='radio-dif' name='dificuldade' value='dificil'><label for='radio-dif'>Difícil</label></div></div>");

      }
      else if (modo=="multi"){
        form.insertAdjacentHTML("beforeend", "<div class='player__field'><span class='player__icon'>&#9711</span><input type='text' class='player__input' name='player2' placeholder='Player2'></div>")

      }
      form.insertAdjacentHTML("beforeend", "<button class='botao jogar' type='submit'>Jogar</button>");
    }
  }
  
  form.addEventListener('submit', capturaDadosForm)
};