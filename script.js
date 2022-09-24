var velha = [[0, 0, 0],
             [0, 0, 0],
             [0, 0, 0]]
var jogada = 0;
var jogador = 0;
var ganhador = 0;
var player1 = "Player1"
var player2 = "Player2"

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
}

function mudarTema(destaque, secundaria, fundo, hover) {
  //passando codigos hex das cores por parâmetro é alterada no arquivo css
  document.documentElement.style.setProperty('--cor-destaque', destaque);
  document.documentElement.style.setProperty('--cor-secundaria', secundaria);
  document.documentElement.style.setProperty('--cor-de-fundo', fundo);
  document.documentElement.style.setProperty('--cor-hover-botao', hover);
}

function verificarNomesIguais(nome1, nome2){
  let resultado = 1
  if (nome1==nome2 && nome1!=""){
    resultado =0;
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

function iniciar() {
  let botoes = document.querySelectorAll(".botoes");
  //2 laços for para percorrer matriz 3x3 para aplicar a classe selecionavel e "escutar" cliques de todos botões
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      botoes[3 * i + j].classList.add("selecionavel")
      botoes[3 * i + j].addEventListener("click", cliqueBotao);
    }
  }
  sorteiaPrimeiroJogador();
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
    verificarVitoria2(idMod);
    
  }
}

function verificarVitoria2(id){
  let somaLinha=0;
  let somaColuna=0;
  let somaDiagonal0=0;
  let somaDiagonal1=0;
  for(let i=0;i<3;i++){
    somaLinha+=velha[Math.floor(id / 3)][i]
    somaColuna+=velha[i][id%3]
    if (id==4){
      somaDiagonal0 += velha[i][i];
      somaDiagonal1 += velha[i][2-i]
    }
    else if (id%8==0){
      somaDiagonal0 += velha[i][i];
    }
    else if (id%2==0){
      somaDiagonal1 += velha[i][2-i];
    }
  }
  if(somaDiagonal0 == (3*jogador)){
    ganhador = jogador;
    destacarDiagonal(0)
  }else if(somaDiagonal1 == (3*jogador)){
    ganhador = jogador;
    destacarDiagonal(1)
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

  }
  else{
    mudarJogador();
  }
}

function terminar() {
  let botoes = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      botoes[3 * i + j].classList.remove("selecionavel")
      botoes[3 * i + j].removeEventListener("click", cliqueBotao);
      if(ganhador==0){
        botoes[3 * i + j].classList.add("destaque__vitoria");
      }
    }
  }
  document.getElementById("titulo").classList.add("destaque_titulo");
}

function reiniciar() {
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
  iniciar();
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
  document.getElementById(('b' + (diag*2))).classList.add("destaque__vitoria");
  document.getElementById(('b' + (8-(diag*2)))).classList.add("destaque__vitoria");
}

window.onload = function () {
  document.getElementById("reiniciar__botao").addEventListener("click", reiniciar)
  const form = document.getElementById('form_players')
  form.addEventListener('submit', e => {
    e.preventDefault()
    if(verificarNomesIguais(form.elements[0].value,form.elements[1].value)){
      if(form.elements[0].value!=""){
        player1 = form.elements[0].value
      }
      if(form.elements[1].value!=""){
        player2 = form.elements[1].value
      }
      document.getElementsByClassName("modal")[0].classList.add("modal__conlcuido");
      iniciar()
    }
  })
};