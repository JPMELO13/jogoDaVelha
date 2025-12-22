const form = document.getElementById('form_players');

const jogoPrincipal = {
  velha: [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]],
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
 * @param {string} destaque Código hex da cor de destaque
 * @param {string} secundaria Código hex da cor secundária
 * @param {string} fundo Código hex da cor de fundo
 * @param {string} hover Código hex da cor de hover dos botões */
function mudarTema(destaque, secundaria, fundo, hover) {
  //passando codigos hex das cores por parâmetro é alterada no arquivo css
  document.documentElement.style.setProperty('--cor-destaque', destaque);
  document.documentElement.style.setProperty('--cor-secundaria', secundaria);
  document.documentElement.style.setProperty('--cor-de-fundo', fundo);
  document.documentElement.style.setProperty('--cor-hover-botao', hover);
}

/**
 * Função que verifica se os nomes dos jogadores são iguais.
 * @param {string} nome1 Nome do jogador 1
 * @param {string} nome2 Nome do jogador 2
 * @returns {boolean} Retorna true se os nomes forem iguais, false caso contrário.
 */
function verificarNomesIguais(nome1, nome2) {
  return (nome1 === nome2);
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

/**
 * Função que alterna o jogador atual no objeto jogo e atualiza o título para indicar a vez do próximo jogador.
 * @param {Object} jogo Objeto contendo o estado atual do jogo.
 */
function mudarJogador(jogo) {
  // multiplicação por -1 faz o jogador "atual" alternar em -1 e 1.
  jogo.jogador = jogo.jogador * -1;
  if (jogo.jogador == 1) {
    document.getElementById("titulo").innerHTML = "Vez de " + player1
  }
  else {
    document.getElementById("titulo").innerHTML = "Vez de " + player2
  }
  jogo.jogada++;
  if (modo === "single") {
    if (jogo.jogador === -1) {
      removeListenerBotoes();
      setTimeout(() => botJogar(jogo), 100); // Delay para parecer natural
    }
    else {
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
  // Reset Visual do Cabeçalho e botões
  document.getElementById("titulo").classList.remove("destaque_titulo");
  let botoes = document.querySelectorAll(".botoes");

  // Reset Lógico do Jogo (Matriz e DOM)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      jogo.velha[i][j] = 0;
      botoes[3 * i + j].innerHTML = "";
      botoes[3 * i + j].value = "0";
      botoes[3 * i + j].classList.remove("destaque__vitoria")
    }
  }

  // Reset Variáveis do Jogo
  jogo.ganhador = 0;
  jogo.jogada = 0;
  jogo.estruturaVitoria = null;
  jogo.principal = true;

  // Exibe dificuldade selecionada
  const displayDif = document.getElementById("exibicao-dificuldade");
  if (modo === "single") {
      displayDif.innerText = dificuldade;
  }
  // Sorteia jogador inicial
  jogo.jogador = sorteiaJogador();
  // Se for o bot que começa, ele joga
  if ((jogo.jogador === -1) && (modo === "single")) {
    botJogar(jogo);
  }
  else {
    addListenerBotoes0();
  }
}

/**
 * Função que adiciona listeners de clique em todos os botões do tabuleiro que estejam vazios(no estado inicial ou após reinício do jogo).
 */
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

/**
 * Handler para o clique dos botões do tabuleiro, que preenche a casa clicada com a jogada do jogador atual, verifica se houve vitória ou empate e muda o jogador.
 * @param {PointerEvent} evento - Evento de clique no botão do tabuleiro.
 */
function cliqueBotao(evento) {
  if (evento.target.value == "0" && jogoPrincipal.ganhador == 0) {
    evento.target.classList.remove("selecionavel");
    evento.target.value = jogoPrincipal.jogador;
    if (jogoPrincipal.jogador == 1) {
      evento.target.innerHTML = "&#10005;"
    } else if (jogoPrincipal.jogador == -1) {
      evento.target.innerHTML = "&#9711;"
    }
    // substr(-1) pega o último caractere da string(id do botão)
    let idMod = parseInt(evento.target.id.substr(-1))
    // Math.floor(idMod/3) faz a "divisão inteira" no JS e % pega o resto da divisão
    jogoPrincipal.velha[Math.floor(idMod / 3)][idMod % 3] = jogoPrincipal.jogador;
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
    do {
        botaoEscolhido = Math.floor(Math.random() * 9);
      } while (jogo.velha[Math.floor(botaoEscolhido / 3)][botaoEscolhido % 3] != 0)
  }
  else if (dificuldade == "normal") {
    //soma diagonal ou linha ou coluna for igual a - 2 ele joga alinhado(+prioridade)
    //soma diagonal ou linha ou coluna for igual a 2 ele joga alinhado(-prioridade)
    let ganhaLinha = verificarSomaAlinhada(jogo.velha, -2, "linha");
    let ganhaColuna = verificarSomaAlinhada(jogo.velha, -2, "coluna");
    let ganhaDiagonal = verificarSomaAlinhada(jogo.velha, -2, "diagonal");
    let bloqLinha = verificarSomaAlinhada(jogo.velha, 2, "linha");
    let bloqColuna = verificarSomaAlinhada(jogo.velha, 2, "coluna");
    let bloqDiagonal = verificarSomaAlinhada(jogo.velha, 2, "diagonal");
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
    let melhorValor, valorAtual;
    let melhorJogada = -1;
    melhorValor = Infinity;
    for (let i = 0; i < jogo.velha.length; i++) {
      for (let j = 0; j < jogo.velha[0].length; j++) {
        if (jogo.velha[i][j] === 0) {
          jogo.velha[i][j] = -1; // simula jogada do bot
          let idAtual = i * 3 + j;
          let valorAtual = minimax(jogo.velha, 0, -Infinity, Infinity, true, idAtual);
          jogo.velha[i][j] = 0; // desfaz a jogada
          if (valorAtual < melhorValor) {
            melhorValor = valorAtual;
            melhorJogada = idAtual;
          }
        }
      }
    }
    botaoEscolhido = melhorJogada;
  }
  // Preenche a jogada do bot na matriz
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


/**
 * Função que cria um atraso antes de marcar a jogada do bot no tabuleiro.
 * @param {HTMLElement} obj Elemento HTML do botão a ser marcado.
 * @returns {Promise} Promessa que é resolvida após o atraso e marcação do botão.
 */
function esperarParaMarcar(obj) {
  return new Promise(resolve => {
    if (espera) clearTimeout(espera);
    espera = setTimeout(() => {
      if (jogoPrincipal.jogador == 1) {
        obj.innerHTML = "&#10005;";
      }
      else if (jogoPrincipal.jogador == -1) {
        obj.innerHTML = "&#9711;";
      }
      espera = null;
      resolve();
    }, 100);
  });
}

/**
 * Função que destaca a estrutura vencedora no tabuleiro e exibe a mensagem de vitória ou empate no título.
 * @param {number} id identificador do botão (de 0 a 8) que fez a jogada vencedora.
 */
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
  else if (jogoPrincipal.estruturaVitoria == "empate") {
    destacarColuna(0);
    destacarColuna(1);
    destacarColuna(2);
    document.getElementById("titulo").innerText = "Empate!";
  }
}

/**
 * Função que destaca a linha vencedora no tabuleiro.
 * @param {number} id identificador do botão (de 0 a 8) que fez a jogada vencedora. 
 */
function destacarLinha(id) {
  let inicio = (Math.floor(id / 3)) * 3
  document.getElementById(('b' + inicio)).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio + 1))).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio + 2))).classList.add("destaque__vitoria");
}

/**
 * Função que destaca a coluna vencedora no tabuleiro.
 * @param {number} id identificador do botão (de 0 a 8) que fez a jogada vencedora. 
 */
function destacarColuna(id) {
  let inicio = id % 3
  document.getElementById(('b' + inicio)).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio + 3))).classList.add("destaque__vitoria");
  document.getElementById(('b' + (inicio + 6))).classList.add("destaque__vitoria");
}

/**
 * Função que destaca a diagonal vencedora no tabuleiro.
 * @param {number} id identificador da diagonal (de 0 ou 2) que constitui a vitória.
 */
function destacarDiagonal(diag) {
  document.getElementById(('b4')).classList.add("destaque__vitoria");
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
  //h3 reservado para mensagens de erro temporárias
  form.insertAdjacentHTML("beforeend", "<h3 class='conteudo__titulo' >" + mensagem + "</h3>")
  setTimeout(() => {
    document.querySelector("h3").remove();
  }, 1000);
}

/**
 * Função que captura os dados do formulário antes de iniciar o jogo.
 * @param {SubmitEvent} e Evento de submissão do formulário.
 */
function capturaDadosForm(e) {
  e.preventDefault();
  player1 = "Player1"
  if (form.player1.value != "") {
    player1 = form.player1.value;
  }
  if (modo == "single") {
    player2 = "BOT";
    dificuldade = form.dificuldade.value
  }// (if  modo==single)
  else {
    player2 = "Player2"
    if (form.player2.value != "") {
      player2 = form.player2.value;
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

/**
 * Iniciador do jogo ao carregar a página, adicionando listeners aos botões de seleção de modo e ao botão de reinício.
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
      }
      else if (modo == "multi") {
        form.insertAdjacentHTML("beforeend", "<div class='player__field'><span class='player__icon'>&#9711;</span><input type='text' class='player__input' name='player2' placeholder='Player2'></div>")
      }
      form.insertAdjacentHTML("beforeend", "<button class='botao jogar' type='submit'>Jogar</button>");
    }
  }
  form.addEventListener('submit', capturaDadosForm);
  document.getElementById("reiniciar__botao").addEventListener("click", reiniciar);
};