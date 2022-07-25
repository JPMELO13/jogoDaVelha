var velha = [[0, 0, 0],
             [0, 0, 0],
             [0, 0, 0]]

var jogador = 1;
var ganhador = 0;

function mudarJogador() {
  jogador = jogador * -1;
}

function verificarVitoria() {
  let somaDiag1 = 0;
  let somaDiag2 = 0;
  //laço de repetição com 3 repetições
  for (let cont = 0; cont < 3; cont++) {
    // percorre e soma os elementos da primeira diagonal ao longo do for
    somaDiag1 += velha[cont][cont];
    // percorre os elementos da primeira diagonal ao longo do for
    somaDiag2 += velha[cont][2 - cont];
    
    //verifica linha por linha se há o ganhador 1
    if (velha[cont][0] + velha[cont][1] + velha[cont][2] == '3') {
      destacarVitoria(cont * 3, cont * 3 + 1, cont * 3 + 2)
      ganhador = 1
    }
    //verifica linha por linha se há o ganhador -1
    else if (velha[cont][0] + velha[cont][1] + velha[cont][2] == "-3") {
      destacarVitoria(cont * 3, cont * 3 + 1, cont * 3 + 2)
      ganhador = -1
    }
    //verifica col por col se há o ganhador -1
    if (velha[0][cont] + velha[1][cont] + velha[2][cont] == '3') {
      ganhador = 1
      destacarVitoria(cont, cont + 3, cont + 6)
    }
    //verifica col por col se há o ganhador -1
    else if (velha[0][cont] + velha[1][cont] + velha[2][cont] == "-3") {
      ganhador = -1
      destacarVitoria(cont, cont + 3, cont + 6)
    }
  }
  if (somaDiag1 == 3) {
    ganhador = 1;
    destacarVitoria(0, 4, 8);
  }
  else if (somaDiag1 == -3) {
    ganhador = -1;
    destacarVitoria(0, 4, 8);
  }
  else if (somaDiag2 == 3) {
    ganhador = 1;
    destacarVitoria(2, 4, 6);
  }
  else if (somaDiag2 == -3) {
    ganhador = -1;
    destacarVitoria(2, 4, 6);
  }
  if (ganhador == 1) {
    document.getElementById("titulo").innerText = "GANHADOR 1";
    terminar();
  }
  else if (ganhador == -1) {
    document.getElementById("titulo").innerText = "GANHADOR -1";
    terminar();
  }
}

function mudarTema(destaque, secundaria, fundo, hover) {
  document.documentElement.style.setProperty('--cor-destaque', destaque);
  document.documentElement.style.setProperty('--cor-secundaria', secundaria);
  document.documentElement.style.setProperty('--cor-de-fundo', fundo);
  document.documentElement.style.setProperty('--cor-hover-botao', hover);
}

function iniciar() {
  let botoes = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      botoes[3 * i + j].classList.add("selecionavel")
      botoes[3 * i + j].addEventListener("click", cliqueBotao);
    }
  }
}

function terminar() {
  let botoes = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      botoes[3 * i + j].classList.remove("selecionavel")
      botoes[3 * i + j].removeEventListener("click", cliqueBotao);
    }
  }
}

function reiniciar() {
  let botoes = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      velha[i][j] = 0;
      botoes[3 * i + j].innerHTML = "";
      botoes[3 * i + j].value = "0";
      botoes[3 * i + j].classList.remove("destaque__vitoria")
    }
  }
  ganhador = 0;
  jogador = 1;
  document.getElementById("titulo").innerText = "Vez do Player #";
  iniciar();
}

function destacarVitoria(id1, id2, id3) {
  document.getElementById(('b' + id1)).classList.add("destaque__vitoria");
  document.getElementById(('b' + id2)).classList.add("destaque__vitoria");
  document.getElementById(('b' + id3)).classList.add("destaque__vitoria");
}

function cliqueBotao(obj){
  if (obj.target.value == "0" && ganhador == 0) {
    obj.target.classList.remove("selecionavel")
    obj.target.value = parseInt(obj.target.value) + jogador;
    if (jogador == 1) {
      obj.target.innerHTML = "&#10006"
    } else if (jogador == -1) {
      obj.target.innerHTML = "&#9678"
    }
    idMod = parseInt(obj.target.id.substr(-1))
    // Math.floor(idMod/3) faz a "divisão inteira" no JS e % pega o resto da divisão
    velha[Math.floor(idMod / 3)][idMod % 3] = parseInt(obj.target.value)
    mudarJogador();
    verificarVitoria();
  }
}

window.onload = function () {
  document.getElementById("reiniciar__botao").addEventListener("click", reiniciar)

  // selecionar todos os botões do jogo:
  var botoes = document.querySelectorAll(".botoes");

  //chamar após preenchimento de nomes
  iniciar()

  
};