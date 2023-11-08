const form = document.getElementById('form_players');

var jogoPrincipal = {
  velha: [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]],
  jogada: 0,
  jogador: 0,
  ganhador: 0,
  estruturaVitoria: null,
  principal: false
};


var player1 = "";
var player2 = "";
var modo = "";
var dificuldade = "";

var espera = null;

function mudarTema(destaque, secundaria, fundo, hover) {
  //passando codigos hex das cores por parâmetro é alterada no arquivo css
  document.documentElement.style.setProperty('--cor-destaque', destaque);
  document.documentElement.style.setProperty('--cor-secundaria', secundaria);
  document.documentElement.style.setProperty('--cor-de-fundo', fundo);
  document.documentElement.style.setProperty('--cor-hover-botao', hover);
}

function verificarNomesIguais(nome1, nome2) {
  let resultado = false
  if (nome1 == nome2) {
    resultado = true;
  }
  return resultado;
}

/**
 * Função que sorteia um jogador, escreve no título a vez do jogador e retorna 1 para player1 e -1 para player2. 
 */
function sorteiaJogador() {
  let jogadorSorteado = 0;
  let x = Math.random();
  if (x > 0.5) {
    jogadorSorteado = -1;
    document.getElementById("titulo").innerHTML = "Vez de " + player2
  }
  else {
    jogadorSorteado = 1;
    document.getElementById("titulo").innerHTML = "Vez de " + player1
  }
  return jogadorSorteado;
}

function mudarJogador(jogo) {
  // multiplicação por -1 faz o jogador "atual" alternar em -1 e 1. Função altera exibição do turno
  jogo.jogador = jogo.jogador * -1;
  if (jogo.jogador == 1) {
    document.getElementById("titulo").innerHTML = "Vez de " + player1
  }
  else {
    document.getElementById("titulo").innerHTML = "Vez de " + player2
  }
  jogo.jogada++;
  if (modo == "single") {
    if (jogo.jogador == -1) {
      removeListenerBotoes();
      botJogar(jogo);
    }
    else {
      addListenerBotoes0();
    }
  }
}

function iniciar(jogo) {
  document.getElementById("titulo").classList.remove("destaque_titulo");
  let botoes = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      jogo.velha[i][j] = 0;
      botoes[3 * i + j].innerHTML = "";
      botoes[3 * i + j].value = "0";
      botoes[3 * i + j].classList.remove("destaque__vitoria")
    }
  }
  jogo.ganhador = 0;
  jogo.jogada = 0;
  jogo.estruturaVitoria = null;
  jogo.principal = true;
  jogo.jogador = sorteiaJogador();
  if ((jogo.jogador == -1) && (modo == "single")) {
    botJogar(jogo);
  }
  else {
    addListenerBotoes0();
  }
}

function addListenerBotoes0() {
  let botoes = document.querySelectorAll(".botoes");
  //2 laços for para percorrer matriz 3x3 para aplicar a classe selecionavel e "escutar" cliques de todos botões

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (jogoPrincipal.velha[i][j] == 0) {
        botoes[3 * i + j].classList.add("selecionavel");
        botoes[3 * i + j].addEventListener("click", cliqueBotao);
      }
    }
  }
}

function cliqueBotao(obj) {
  if (obj.target.value == "0" && jogoPrincipal.ganhador == 0) {
    obj.target.classList.remove("selecionavel")
    obj.target.value = jogoPrincipal.jogador;
    if (jogoPrincipal.jogador == 1) {
      obj.target.innerHTML = "&#10005"
    } else if (jogoPrincipal.jogador == -1) {
      obj.target.innerHTML = "&#9711"
    }
    let idMod = parseInt(obj.target.id.substr(-1))
    // Math.floor(idMod/3) faz a "divisão inteira" no JS e % pega o resto da divisão
    jogoPrincipal.velha[Math.floor(idMod / 3)][idMod % 3] = parseInt(obj.target.value)
    if (verificarVitoria(jogoPrincipal, idMod)) {
      terminar();
      destacarFinal(idMod)
    }
    else {
      mudarJogador(jogoPrincipal);
    }
  }
}



/**
 * Função que preenche uma casa do tabuleiro com a jogada do bot após analisar todas estruturas do tabuleiro, de forma que, primeiramente, tentará vencer caso haja apenas duas casas preenchidas pelo bot em uma estrutura e, secundariamente, bloqueará a vitória caso haja apenas duas casas preenchidas pelo player em uma estrutura.
 * Caso essas condições não sejam atendidas, o bot jogará aleatoriamente em uma das casas disponíveis.
 * OBS: Há a verificação se o jogo é o principal, para preenchimento da jogada na tela(com delay)e verificação da vitória para encerramento do jogo pós jogada.  
 * @param jogo Objeto contendo o jogo no qual o bot vai executar a jogada.
 */
function botJogar(jogo) {
  let botaoEscolhido;
  if (dificuldade == "facil") {
    //soma diagonal ou linha ou coluna for igual a - 2 ele joga alinhado(+prioridade)
    //soma diagonal ou linha ou coluna for igual a 2 ele joga alinhado(-prioridade)
    let ganhaLinha = verificaSomaAlinhada(jogo.velha, -2, "linha");
    let ganhaColuna = verificaSomaAlinhada(jogo.velha, -2, "coluna");
    let ganhaDiagonal = verificaSomaAlinhada(jogo.velha, -2, "diagonal");
    let bloqLinha = verificaSomaAlinhada(jogo.velha, 2, "linha");
    let bloqColuna = verificaSomaAlinhada(jogo.velha, 2, "coluna");
    let bloqDiagonal = verificaSomaAlinhada(jogo.velha, 2, "diagonal");
    if (ganhaLinha > -1) {
      botaoEscolhido = ganhaLinha;
    } else if (ganhaColuna > -1) {
      botaoEscolhido = ganhaColuna;
    } else if (ganhaDiagonal > -1) {
      botaoEscolhido = ganhaDiagonal;
    } else if (bloqLinha > -1) {
      botaoEscolhido = bloqLinha;
    } else if (bloqColuna > -1) {
      botaoEscolhido = bloqColuna;
    } else if (bloqDiagonal > -1) {
      botaoEscolhido = bloqDiagonal;
    } else {
      do {
        botaoEscolhido = Math.floor(Math.random() * 9);
      } while (jogo.velha[Math.floor(botaoEscolhido / 3)][botaoEscolhido % 3] != 0)
    }
  }
  else if (dificuldade == "impossivel") {
    // ESCREVER PARTE FALTANTE AQUI E DEFINIR FUNÇÃO COM ALGORITMO MINIMAX FORA(COM PODA ALFA BETA)
  }

  jogo.velha[Math.floor(botaoEscolhido / 3)][botaoEscolhido % 3] = jogo.jogador;
  if (jogo.principal) {
    let botoes = document.querySelectorAll(".botoes");
    let obj = botoes[botaoEscolhido];
    if (obj.value == "0" && jogo.ganhador == 0) {
      obj.classList.remove("selecionavel")
      obj.value = jogo.jogador;
      esperarParaMarcar(obj).then(() => {
        if (verificarVitoria(jogo, botaoEscolhido)) {
          terminar();
          destacarFinal(botaoEscolhido);
        }
        else {
          mudarJogador(jogo);
        }
      })
    }
  }
}

function esperarParaMarcar(obj) {
  return new Promise(resolve => {
    espera = setTimeout(() => {
      obj.innerHTML = "&#9711";
      resolve();
    }, 500);
  });
}

/**
 * Função que verifica na matriz, se há a estrutura que possua a soma esperada.
 * Retorna a posição da casa não preenchida presente na estrutura que tenha a soma esperada. Caso não encontre, retorna -1.
 * @param matriz Objeto contendo o jogo no qual o bot vai executar a jogada.
 * @param valor Número a ser comparado durante verificação.
 * @param estrutura String ("linha","coluna" ou "diagonal") a ser executada verificação
 */
function verificaSomaAlinhada(matriz, valor, estrutura) {
  //retorna a posição da estrutura onde deve ser jogado
  for (let i = 0; i < 3; i++) {
    if (estrutura == "linha") {
      if ((matriz[i][0] + matriz[i][1] + matriz[i][2]) == valor) {
        for (let j = 0; j < 3; j++) {
          if (matriz[i][j] == 0) {
            return (i * 3 + j);
          }
        }
      }
    }
    else if (estrutura == "coluna") {
      if ((matriz[0][i] + matriz[1][i] + matriz[2][i]) == valor) {
        for (let j = 0; j < 3; j++) {
          if (matriz[j][i] == 0) {
            return (j * 3 + i);
          }
        }
      }
    }
    else if ((estrutura == "diagonal") && (i != 1)) {
      if ((matriz[0][i] + matriz[1][1] + matriz[2][2 - i]) == valor) {
        if (matriz[0][i] == 0) {
          return i;
        }
        else if (matriz[1][1] == 0) {
          return 4;
        }
        else if (matriz[2][2 - i] == 0) {
          return 6 + (2 - i);
        }
      }
    }
  }
  return -1;
}

/**
 * Função que verifica se a condicao de vitoria foi atingida, podendo alterar ou não as variáveis ganhador e estruturaVitoria.
 * OBS: Empate na ultima rodada é tido como uma vitória sem ganhador.
 * @param id O id do botão da jogada a ser verificada.
 * @param matriz Matriz que representa o tabuleiro na qual será verificada a vitória
 */
function verificarVitoria(jogo, id = (-1)) {
  let resultado = false;
  if (id == -1) {
    for (let cont = 0; cont<9; cont++){
      if(verificarVitoria(jogo,cont)){
        return true
      };
    }
  }
  else {
    if (jogo.jogada > 3) {
      //Ao fim dos turnos verifica as condicoes de vitoria, preenche a variavel ganhador com o player caso haja ganhador e retorna true
      let somaLinha = 0;
      let somaColuna = 0;
      let somaDiagonal0 = 0;
      let somaDiagonal2 = 0;
      for (let i = 0; i < 3; i++) {
        somaLinha += jogo.velha[Math.floor(id / 3)][i]
        somaColuna += jogo.velha[i][id % 3]
        if (id == 4) {
          somaDiagonal0 += jogo.velha[i][i];
          somaDiagonal2 += jogo.velha[i][2 - i]
        }
        else if (id % 8 == 0) {
          somaDiagonal0 += jogo.velha[i][i];
        }
        else if (id % 2 == 0) {
          somaDiagonal2 += jogo.velha[i][2 - i];
        }
      }
      if (somaDiagonal0 == (3 * jogo.jogador)) {
        jogo.ganhador = jogo.jogador;
        jogo.estruturaVitoria = "diagonal0"
        resultado = true;
      }
      else if (somaDiagonal2 == (3 * jogo.jogador)) {
        jogo.ganhador = jogo.jogador;
        jogo.estruturaVitoria = "diagonal2"
        resultado = true;
      }
      else if (somaLinha == (3 * jogo.jogador)) {
        jogo.ganhador = jogo.jogador;
        jogo.estruturaVitoria = "linha"
        resultado = true;
      }
      else if (somaColuna == (3 * jogo.jogador)) {
        jogo.ganhador = jogo.jogador;
        jogo.estruturaVitoria = "coluna"
        resultado = true;
      }
      else if (jogo.jogada == 8) {
        jogo.estruturaVitoria = "empate";
        resultado = true;
      }
    }
  }

  return resultado
}

function destacarFinal(id) {
  if (jogoPrincipal.ganhador == 1) {
    document.getElementById("titulo").innerText = player1 + " venceu!";
  }
  else if (jogoPrincipal.ganhador == -1) {
    document.getElementById("titulo").innerText = player2 + " venceu!";
  }
  if (jogoPrincipal.estruturaVitoria == "diagonal0") {
    destacarDiagonal(0);
  }
  else if (jogoPrincipal.estruturaVitoria == "diagonal2") {
    destacarDiagonal(2);
  }
  else if (jogoPrincipal.estruturaVitoria == "linha") {
    destacarLinha(id);
  }
  else if (jogoPrincipal.estruturaVitoria == "coluna") {
    destacarColuna(id);
  }
  else if (jogoPrincipal.estruturaVitoria = "empate") {
    destacarColuna(0);
    destacarColuna(1);
    destacarColuna(2);
    document.getElementById("titulo").innerText = "Empate!";
  }
}

function destacarLinha(id) {
  let inicio = (Math.floor(id / 3)) * 3
  document.getElementById(('b' + inicio)).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio + 1))).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio + 2))).classList.add("destaque__vitoria");
}

function destacarColuna(id) {
  let inicio = id % 3
  document.getElementById(('b' + inicio)).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio + 3))).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio + 6))).classList.add("destaque__vitoria");
}

function destacarDiagonal(diag) {
  document.getElementById(('b4')).classList.add("destaque__vitoria");
  document.getElementById('b' + diag).classList.add("destaque__vitoria");
  document.getElementById('b' + (8 - diag)).classList.add("destaque__vitoria");
}

function removeListenerBotoes() {
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
  clearTimeout(espera);
}

function reiniciar() {
  terminar();
  iniciar(jogoPrincipal);
}

function mensagemDeErro(mensagem) {
  form.insertAdjacentHTML("beforeend", "<h3 class='conteudo__titulo' >" + mensagem + "</h3>")
  setTimeout(() => {
    document.querySelector("h3").remove();
  }, 1000);
}

function capturaDadosForm(e) {
  e.preventDefault();
  player1 = "Player1"
  if (form.elements[2].value != "") {
    player1 = form.elements[2].value;
  }
  if (modo == "single") {
    player2 = "BOT";
    dificuldade = form.dificuldade.value
  }// (if  modo==single)
  else {
    player2 = "Player2"
    if (form.elements[3].value != "") {
      player2 = form.elements[3].value;
    }
  }//else(if modo==multi)
  if (verificarNomesIguais(player1, player2) == 0) {
    if (!((modo == "single") && (dificuldade == ""))) {
      if (!((modo == "single") && (dificuldade == "impossivel"))) {
        document.getElementsByClassName("modal")[0].classList.add("modal__concluido");
        iniciar(jogoPrincipal);
      }
      else {
        // mensagemDeErro("Não disponível!");
        document.getElementsByClassName("modal")[0].classList.add("modal__concluido");
        iniciar(jogoPrincipal);
      }
    }
    else {
      mensagemDeErro("Dificuldade Inválida!");
    }
  } else {
    mensagemDeErro("Nome(s) Inválido(s)!");
  }
}

window.onload = function () {
  var gameMode = form.switchMode;
  for (let i = 0; i < gameMode.length; i++) {
    gameMode[i].onclick = function () {
      modo = this.value;
      let campos = document.getElementsByClassName("player__field");
      let botaoJogar = document.getElementsByClassName("jogar");
      for (let j = 0; j < campos.length;) {
        campos[j].remove();
      }
      if (botaoJogar.length > 0) {
        botaoJogar[0].remove();
      }
      form.insertAdjacentHTML("beforeend", "<div class='player__field'><span class='player__icon'>&#10005 </span><input type='text' class='player__input' name='player1' placeholder='Player1'></div>");
      if (modo == "single") {
        player2 = "BOT";
        form.insertAdjacentHTML("beforeend", "<div class='player__field'><div class='switch-field'><input type='radio' id='radio-facil' name='dificuldade' value='facil' ><label for='radio-facil'>Fácil</label><input type='radio' id='radio-dif' name='dificuldade' value='impossivel'><label for='radio-dif'>Impossível</label></div></div>");
      }
      else if (modo == "multi") {
        form.insertAdjacentHTML("beforeend", "<div class='player__field'><span class='player__icon'>&#9711</span><input type='text' class='player__input' name='player2' placeholder='Player2'></div>")
      }
      form.insertAdjacentHTML("beforeend", "<button class='botao jogar' type='submit'>Jogar</button>");
    }
  }
  form.addEventListener('submit', capturaDadosForm);
  document.getElementById("reiniciar__botao").addEventListener("click", reiniciar);
};