var velha = [[0, 0, 0],
             [0, 0, 0],
             [0, 0, 0]]

var jogador = 1;
var ganhador = 0;
var player1 = "Player1"
var player2 = "Player2"

function mudarJogador() {
  jogador = jogador * -1;
  if (jogador != 1){
    document.getElementById("titulo").innerHTML="Vez de "+player2
  }
  else{
    console.log("entrou aqui")
    document.getElementById("titulo").innerHTML="Vez de "+player1
  }
  
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
    document.getElementById("titulo").innerText = "GANHADOR: " + player1;
    terminar();
  }
  else if (ganhador == -1) {
    document.getElementById("titulo").innerText = "GANHADOR: " + player2;
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
  document.getElementById("titulo").innerHTML="Vez de "+player1
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
      obj.target.innerHTML = "&#10005"
    } else if (jogador == -1) {
      obj.target.innerHTML = "&#9675"
    }
    idMod = parseInt(obj.target.id.substr(-1))
    // Math.floor(idMod/3) faz a "divisão inteira" no JS e % pega o resto da divisão
    velha[Math.floor(idMod / 3)][idMod % 3] = parseInt(obj.target.value)
    mudarJogador();
    verificarVitoria();
  }
}

function verificarNomesIguais(nome1, nome2){
  let resultado = 1
  if (nome1==nome2 && nome1!=""){
    resultado =0;
  }
  return resultado;
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

  //chamar após preenchimento de nomes
  

  
};