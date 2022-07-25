var velha = [[0, 0, 0],
[0, 0, 0],
[0, 0, 0]]

var jogador = 1;
var ganhador = 0;

function mudarJogador() {
  jogador = jogador * -1;
}

function verificarVitoria() {
  if (((velha[0][0] + velha[1][1] + velha[2][2]) == 3) || ((velha[0][2] + velha[1][1] + velha[2][0]) == 3)) {
    ganhador = 1;
  }
  else if ((velha[0][0] + velha[1][1] + velha[2][2] == -3) || (velha[0][2] + velha[1][1] + velha[2][0] == -3)) {
    ganhador = -1;
  }

  else {
    for (let cont = 0; cont < 3; cont++) {

      if (velha[cont][0] + velha[cont][1] + velha[cont][2] == '3') {
        ganhador = 1
      }
      else if (velha[cont][0] + velha[cont][1] + velha[cont][2] == "-3") {
        ganhador = -1
      }

      if (velha[0][cont] + velha[1][cont] + velha[2][cont] == '3') {
        ganhador = 1
      }
      else if (velha[0][cont] + velha[1][cont] + velha[2][cont] == "-3") {
        ganhador = -1
      }
    }
  }
  if (ganhador == 1) {
    document.getElementById("titulo").innerText = "GANHADOR 1";
    console.log('ganhou 1')
  }
  else if (ganhador == -1) {
    document.getElementById("titulo").innerText = "GANHADOR -1";
    console.log('ganhou -1')
  }
}

function mudarCor(destaque, secundaria, fundo, hover) {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--cor-destaque');
  console.log(value);
  document.documentElement.style.setProperty('--cor-destaque', destaque);
  document.documentElement.style.setProperty('--cor-secundaria', secundaria);
  document.documentElement.style.setProperty('--cor-de-fundo', fundo);
  document.documentElement.style.setProperty('--cor-hover-botao', hover);
}

function reiniciar() {
  var botoes1 = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      velha[i][j] = 0;
      botoes1[3 * i + j].innerHTML = "";
      botoes1[3 * i + j].value = "0";
      console.log(botoes1[3 * i + j]);
    }
  }
  ganhador = 0;
  jogador = 1;
  document.getElementById("titulo").innerText = "Vez do Player #";
}


window.onload = function () {
  document.getElementById("reiniciar__botao").addEventListener("click", reiniciar)
  // selecionar todos os botões do jogo:
  var botoes = document.querySelectorAll(".botoes");

  for (let i = 0; i < botoes.length; i++) {

    var botao = botoes[i];

    // addEventListener vai "aguardar" o click(gatilho) do usuario para disparar a função:
    botao.addEventListener("click", function () {
      if (this.value == "0" && ganhador == 0) {
        this.value = parseInt(this.value) + jogador;
        if (jogador == 1) {
          this.innerHTML = "&#10006"
        } else if (jogador == -1) {
          this.innerHTML = "&#9678"
        }
        // MELHORAR -> this.style.border = "0.5em solid black"
        idMod = parseInt(this.id.substr(-1))
        // Math.floor(idMod/3) faz a "divisão inteira" no JS e % pega o resto da divisão
        velha[Math.floor(idMod / 3)][idMod % 3] = parseInt(this.value)
      }
      console.log(velha);
      mudarJogador();
      verificarVitoria();
    });
  }
};