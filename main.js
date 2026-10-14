const form = document.getElementById('form_players');

const jogoPrincipal = {
  velha: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  jogada: 0,
  jogador: 0,
  ganhador: 0,
  estruturaVitoria: null,
  principal: false
};

let player1 = "";
let player2 = "";
let modo = "";
let dificuldade = "";
let espera = null;

// --- FUNÇÕES DE INTERFACE ---

/**
 * Função que altera o tema do jogo, modificando as variáveis CSS correspondentes.
 * @param {string} destaque Código hex da cor de destaque.
 * @param {string} secundaria Código hex da cor secundária.
 * @param {string} fundo Código hex da cor de fundo.
 * @param {string} hover Código hex da cor de hover dos botões.
 */
function mudarTema(destaque, secundaria, fundo, hover) {
  document.documentElement.style.setProperty('--cor-destaque', destaque);
  document.documentElement.style.setProperty('--cor-secundaria', secundaria);
  document.documentElement.style.setProperty('--cor-de-fundo', fundo);
  document.documentElement.style.setProperty('--cor-hover-botao', hover);
}

/**
 * Função que verifica se os nomes dos jogadores são iguais.
 * @param {string} nome1 Nome do jogador 1.
 * @param {string} nome2 Nome do jogador 2.
 * @returns {boolean} Retorna true se os nomes forem iguais, false caso contrário.
 */
function verificarNomesIguais(nome1, nome2) {
  return (nome1 === nome2);
}

/**
 * Função que sorteia o jogador inicial, atualiza o título e retorna 1 para player1 ou -1 para player2.
 * @returns {number} 1 ou -1.
 */
function sorteiaJogador() {
  let jogadorSorteado = 0;
  let x = Math.random();
  if (x > 0.5) {
    jogadorSorteado = -1;
    document.getElementById("titulo").textContent = "Vez de " + player2;
  } else {
    jogadorSorteado = 1;
    document.getElementById("titulo").textContent = "Vez de " + player1;
  }
  return jogadorSorteado;
}

/**
 * Função que alterna o jogador atual no objeto jogo e atualiza o título.
 * @param {Object} jogo Objeto contendo o estado atual do jogo.
 */
function mudarJogador(jogo) {
  jogo.jogador = jogo.jogador * -1;
  if (jogo.jogador === 1) {
    document.getElementById("titulo").textContent = "Vez de " + player1;
  } else {
    document.getElementById("titulo").textContent = "Vez de " + player2;
  }
  jogo.jogada++;
  if (modo === "single") {
    if (jogo.jogador === -1) {
      removeListenerBotoes();
      botJogar(jogo);
    } else {
      addListenerBotoes0();
    }
  }
}

// --- LÓGICA DO JOGO ---

/**
 * Função que prepara o tabuleiro e variáveis para iniciar/reiniciar o jogo.
 * @param {Object} jogo Objeto contendo o jogo a ser iniciado/reiniciado.
 */
function iniciar(jogo) {
  document.getElementById("titulo").classList.remove("destaque_titulo");
  let botoes = document.querySelectorAll(".botoes");

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      jogo.velha[i][j] = 0;
      botoes[3 * i + j].innerHTML = "";
      botoes[3 * i + j].value = "0";
      botoes[3 * i + j].classList.remove("destaque__vitoria");
    }
  }

  jogo.ganhador = 0;
  jogo.jogada = 0;
  jogo.estruturaVitoria = null;
  jogo.principal = true;

  const displayDif = document.getElementById("exibicao-dificuldade");
  displayDif.textContent = (modo === "single") ? dificuldade : "";

  jogo.jogador = sorteiaJogador();
  if (jogo.jogador === -1 && modo === "single") {
    removeListenerBotoes();
    botJogar(jogo);
  } else {
    addListenerBotoes0();
  }
}

/**
 * Função que adiciona listeners de clique em todos os botões vazios do tabuleiro.
 */
function addListenerBotoes0() {
  let botoes = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (jogoPrincipal.velha[i][j] == 0) {
        botoes[3 * i + j].classList.add("selecionavel");
        botoes[3 * i + j].addEventListener("click", cliqueBotao);
      }
    }
  }
}

/**
 * Handler para o clique dos botões do tabuleiro.
 * @param {PointerEvent} evento Evento de clique no botão do tabuleiro.
 */
function cliqueBotao(evento) {
  const botao = evento.currentTarget;
  if (botao.value === "0" && jogoPrincipal.ganhador === 0) {
    botao.classList.remove("selecionavel");
    botao.value = jogoPrincipal.jogador;
    if (jogoPrincipal.jogador === 1) {
      botao.innerHTML = "&#10005;";
    } else if (jogoPrincipal.jogador === -1) {
      botao.innerHTML = "&#9711;";
    }
    let idMod = parseInt(botao.id.slice(-1), 10);
    jogoPrincipal.velha[Math.floor(idMod / 3)][idMod % 3] = jogoPrincipal.jogador;
    if (verificarVitoria(jogoPrincipal, idMod)) {
      terminar();
      destacarFinal(idMod);
    } else {
      mudarJogador(jogoPrincipal);
    }
  }
}

/**
 * Calcula e executa a jogada do BOT de acordo com a dificuldade selecionada.
 * @param {Object} jogo Objeto contendo o jogo no qual o bot vai executar a jogada.
 */
function botJogar(jogo) {
  let botaoEscolhido = -1;

  if (dificuldade === "facil") {
    do {
      botaoEscolhido = Math.floor(Math.random() * 9);
    } while (jogo.velha[Math.floor(botaoEscolhido / 3)][botaoEscolhido % 3] !== 0);
  } else if (dificuldade === "normal") {
    const prioridades = [
      [-2, "linha"], [-2, "coluna"], [-2, "diagonal"],
      [2, "linha"],  [2, "coluna"],  [2, "diagonal"]
    ];
    for (const [alvo, estrutura] of prioridades) {
      botaoEscolhido = verificarSomaAlinhada(jogo.velha, alvo, estrutura);
      if (botaoEscolhido !== -1) break;
    }
    if (botaoEscolhido === -1) {
      do {
        botaoEscolhido = Math.floor(Math.random() * 9);
      } while (jogo.velha[Math.floor(botaoEscolhido / 3)][botaoEscolhido % 3] !== 0);
    }
  } else if (dificuldade === "impossivel") {
    let melhorValor = Infinity;
    let melhoresJogadas = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (jogo.velha[i][j] === 0) {
          jogo.velha[i][j] = -1;
          let idAtual = i * 3 + j;
          let valorAtual = minimax(jogo.velha, 0, -Infinity, Infinity, true, idAtual);
          jogo.velha[i][j] = 0;

          if (valorAtual < melhorValor) {
            melhorValor = valorAtual;
            melhoresJogadas = [idAtual];
          } else if (valorAtual === melhorValor) {
            melhoresJogadas.push(idAtual);
          }
        }
      }
    }
    botaoEscolhido = melhoresJogadas[Math.floor(Math.random() * melhoresJogadas.length)];
  }

  if (jogo.principal) {
    let botoes = document.querySelectorAll(".botoes");
    let obj = botoes[botaoEscolhido];
    if (obj.value === "0" && jogo.ganhador === 0) {
      esperarParaMarcar(obj, jogo, botaoEscolhido).then(() => {
        if (verificarVitoria(jogo, botaoEscolhido)) {
          terminar();
          destacarFinal(botaoEscolhido);
        } else {
          mudarJogador(jogo);
        }
      });
    }
  }
}

/**
 * Aguarda um atraso antes de efetivar a jogada do BOT na matriz e no DOM.
 * @param {HTMLElement} obj Elemento HTML do botão a ser marcado.
 * @param {Object} jogo Objeto contendo o estado atual do jogo.
 * @param {number} id Índice do botão escolhido (0 a 8).
 * @returns {Promise} Promessa resolvida após a marcação.
 */
function esperarParaMarcar(obj, jogo, id) {
  return new Promise(resolve => {
    if (espera) clearTimeout(espera);
    espera = setTimeout(() => {
      jogo.velha[Math.floor(id / 3)][id % 3] = jogo.jogador;
      obj.classList.remove("selecionavel");
      obj.value = jogo.jogador;
      if (jogo.jogador === 1) {
        obj.innerHTML = "&#10005;";
      } else if (jogo.jogador === -1) {
        obj.innerHTML = "&#9711;";
      }
      espera = null;
      resolve();
    }, 200);
  });
}

/**
 * Função que destaca a estrutura vencedora no tabuleiro e exibe o resultado no título.
 * @param {number} id Identificador do botão (0 a 8) que fez a jogada vencedora.
 */
function destacarFinal(id) {
  if (jogoPrincipal.ganhador == 1) {
    document.getElementById("titulo").innerText = player1 + " venceu!";
  } else if (jogoPrincipal.ganhador == -1) {
    document.getElementById("titulo").innerText = player2 + " venceu!";
  }

  if (jogoPrincipal.estruturaVitoria == "diagonal0") {
    destacarDiagonal(0);
  } else if (jogoPrincipal.estruturaVitoria == "diagonal2") {
    destacarDiagonal(2);
  } else if (jogoPrincipal.estruturaVitoria == "linha") {
    destacarLinha(id);
  } else if (jogoPrincipal.estruturaVitoria == "coluna") {
    destacarColuna(id);
  } else if (jogoPrincipal.estruturaVitoria == "empate") {
    destacarColuna(0);
    destacarColuna(1);
    destacarColuna(2);
    document.getElementById("titulo").innerText = "Empate!";
  }
}

/**
 * Função que destaca a linha vencedora no tabuleiro.
 * @param {number} id Identificador do botão (0 a 8) que fez a jogada vencedora.
 */
function destacarLinha(id) {
  let inicio = (Math.floor(id / 3)) * 3;
  document.getElementById('b' + inicio).classList.add("destaque__vitoria");
  document.getElementById('b' + (inicio + 1)).classList.add("destaque__vitoria");
  document.getElementById('b' + (inicio + 2)).classList.add("destaque__vitoria");
}

/**
 * Função que destaca a coluna vencedora no tabuleiro.
 * @param {number} id Identificador do botão (0 a 8) que fez a jogada vencedora.
 */
function destacarColuna(id) {
  let inicio = id % 3;
  document.getElementById('b' + inicio).classList.add("destaque__vitoria");
  document.getElementById('b' + (inicio + 3)).classList.add("destaque__vitoria");
  document.getElementById('b' + (inicio + 6)).classList.add("destaque__vitoria");
}

/**
 * Função que destaca a diagonal vencedora no tabuleiro.
 * @param {number} diag Identificador da diagonal (0 ou 2) que constitui a vitória.
 */
function destacarDiagonal(diag) {
  document.getElementById('b4').classList.add("destaque__vitoria");
  document.getElementById('b' + diag).classList.add("destaque__vitoria");
  document.getElementById('b' + (8 - diag)).classList.add("destaque__vitoria");
}

/**
 * Função que remove os listeners de clique de todos os botões do tabuleiro.
 */
function removeListenerBotoes() {
  let botoes = document.querySelectorAll(".botoes");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      botoes[3 * i + j].classList.remove("selecionavel");
      botoes[3 * i + j].removeEventListener("click", cliqueBotao);
    }
  }
}

/**
 * Função que encerra o jogo, removendo os listeners dos botões e destacando o título.
 */
function terminar() {
  removeListenerBotoes();
  document.getElementById("titulo").classList.add("destaque_titulo");
  clearTimeout(espera);
}

/**
 * Função que reinicia o jogo, interrompendo o jogo atual e iniciando um novo.
 */
function reiniciar() {
  terminar();
  iniciar(jogoPrincipal);
}

/**
 * Função que exibe uma mensagem de erro no formulário por um curto período.
 * @param {string} mensagem Mensagem de erro a ser exibida.
 */
function mensagemDeErro(mensagem) {
  const erroExistente = form.querySelector("h3");
  if (erroExistente) erroExistente.remove();

  const h3 = document.createElement("h3");
  h3.className = "conteudo__titulo";
  h3.textContent = mensagem;
  form.appendChild(h3);

  setTimeout(() => {
    h3.remove();
  }, 1000);
}

/**
 * Função que captura os dados do formulário antes de iniciar o jogo.
 * @param {SubmitEvent} e Evento de submissão do formulário.
 */
function capturaDadosForm(e) {
  e.preventDefault();
  const inputP1 = form.player1.value.trim();
  player1 = inputP1 !== "" ? inputP1 : "Player1";

  if (modo === "single") {
    player2 = "BOT";
    dificuldade = form.dificuldade.value;
  } else {
    const inputP2 = form.player2.value.trim();
    player2 = inputP2 !== "" ? inputP2 : "Player2";
  }

  if (!verificarNomesIguais(player1, player2)) {
    if (!(modo === "single" && dificuldade === "")) {
      document.getElementsByClassName("modal")[0].classList.add("modal__concluido");
      iniciar(jogoPrincipal);
    } else {
      mensagemDeErro("Dificuldade Inválida!");
    }
  } else {
    mensagemDeErro("Nome(s) Inválido(s)!");
  }
}

/**
 * Iniciador do jogo ao carregar a página.
 */
window.onload = function () {
  var gameMode = form.switchMode;
  for (let i = 0; i < gameMode.length; i++) {
    gameMode[i].onclick = function () {
      modo = this.value;
      let campos = document.getElementsByClassName("player__field");
      let botaoJogar = document.getElementsByClassName("jogar");
      while (campos.length > 0) {
        campos[0].remove();
      }
      if (botaoJogar[0]) {
        botaoJogar[0].remove();
      }
      form.insertAdjacentHTML("beforeend", "<div class='player__field'><span class='player__icon'>&#10005; </span><input type='text' class='player__input' name='player1' placeholder='Player1'></div>");
      if (modo == "single") {
        player2 = "BOT";
        form.insertAdjacentHTML("beforeend", "<div class='player__field'><div class='switch-field'><input type='radio' id='radio-facil' name='dificuldade' value='facil' ><label for='radio-facil'>Fácil</label><input type='radio' id='radio-normal' name='dificuldade' value='normal'><label for='radio-normal'>Normal</label><input type='radio' id='radio-dif' name='dificuldade' value='impossivel'><label for='radio-dif'>Impossível</label></div></div>");
      } else if (modo == "multi") {
        form.insertAdjacentHTML("beforeend", "<div class='player__field'><span class='player__icon'>&#9711;</span><input type='text' class='player__input' name='player2' placeholder='Player2'></div>");
      }
      form.insertAdjacentHTML("beforeend", "<button class='botao jogar' type='submit'>Jogar</button>");
    };
  }
  form.addEventListener('submit', capturaDadosForm);
  document.getElementById("reiniciar__botao").addEventListener("click", reiniciar);
};