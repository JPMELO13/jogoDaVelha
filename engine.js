/**
 * Função que utiliza o algoritmo Minimax com poda Alpha-Beta para determinar a melhor jogada.
 * Avalia recursivamente as possibilidades do tabuleiro para garantir que o BOT não perca.
 * @param {number[][]} matriz Matriz 3x3 representando o estado atual do tabuleiro.
 * @param {number} profundidade Número que indica a distância da jogada atual (usado para pontuar vitórias rápidas).
 * @param {number} alpha O melhor valor que o maximizador (Player 1) pode garantir.
 * @param {number} beta O melhor valor que o minimizador (BOT) pode garantir.
 * @param {boolean} isMaximizing Define se é a vez do maximizador (Player = 1) ou minimizador (BOT = -1).
 * @param {number} ultimoId O ID da última casa preenchida (0 a 8) para verificação de vitória.
 * @returns {number} Pontuação calculada para o estado do tabuleiro.
 */
function minimax(matriz, profundidade, alpha, beta, isMaximizing, ultimoId) {
  const jogadorAnterior = isMaximizing ? -1 : 1;

  if (ultimoId !== undefined) {
    const resultado = avaliarQuadro(matriz, ultimoId, jogadorAnterior);
    if (resultado !== null) {
      return jogadorAnterior === 1 ? (10 - profundidade) : (-10 + profundidade);
    }
  }

  // Verifica se o tabuleiro está cheio (empate)
  let disponivel = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (matriz[i][j] === 0) disponivel++;
    }
  }
  if (disponivel === 0) return 0;

  if (isMaximizing) {
    let melhorScore = -Infinity;
    for (let idAtual = 0; idAtual < 9; idAtual++) {
      const i = Math.floor(idAtual / 3);
      const j = idAtual % 3;
      if (matriz[i][j] === 0) {
        matriz[i][j] = 1;
        const score = minimax(matriz, profundidade + 1, alpha, beta, false, idAtual);
        matriz[i][j] = 0;

        if (score > melhorScore) melhorScore = score;
        if (melhorScore > alpha) alpha = melhorScore;
        if (beta <= alpha) break;
      }
    }
    return melhorScore;
  } else {
    let melhorScore = Infinity;
    for (let idAtual = 0; idAtual < 9; idAtual++) {
      const i = Math.floor(idAtual / 3);
      const j = idAtual % 3;
      if (matriz[i][j] === 0) {
        matriz[i][j] = -1;
        const score = minimax(matriz, profundidade + 1, alpha, beta, true, idAtual);
        matriz[i][j] = 0;

        if (score < melhorScore) melhorScore = score;
        if (melhorScore < beta) beta = melhorScore;
        if (beta <= alpha) break;
      }
    }
    return melhorScore;
  }
}

/**
 * Função que avalia o quadro do jogo da velha a partir da última jogada realizada.
 * @param {number[][]} matriz Matriz 3x3 representando o tabuleiro preenchida com 1, -1 ou 0.
 * @param {number} id O id do botão da jogada a ser avaliada (0 a 8).
 * @param {number} jogador O valor do jogador atual (1 ou -1).
 * @returns {string|null} String representando a estrutura vencedora ("linha", "coluna", "diagonal0", "diagonal2") ou null se não houver vencedor.
 */
function avaliarQuadro(matriz, id, jogador) {
  let somaLinha = 0;
  let somaColuna = 0;
  let somaDiagonal0 = 0;
  let somaDiagonal2 = 0;
  let alvo = 3 * jogador;

  for (let i = 0; i < 3; i++) {
    somaLinha += matriz[Math.floor(id / 3)][i];
    somaColuna += matriz[i][id % 3];

    if (id == 4) {
      somaDiagonal0 += matriz[i][i];
      somaDiagonal2 += matriz[i][2 - i];
    } else if (id % 8 == 0) {
      somaDiagonal0 += matriz[i][i];
    } else if (id % 2 == 0) {
      somaDiagonal2 += matriz[i][2 - i];
    }
  }

  if (somaDiagonal0 == alvo) return "diagonal0";
  if (somaDiagonal2 == alvo) return "diagonal2";
  if (somaLinha == alvo) return "linha";
  if (somaColuna == alvo) return "coluna";

  return null;
}

/**
 * Função que verifica se a condição de vitória foi atingida, alterando as propriedades ganhador e estruturaVitoria.
 * OBS: Empate na última rodada é tido como fim de jogo sem ganhador.
 * @param {Object} jogo Objeto que representa o estado atual do jogo.
 * @param {number} id O id do botão da jogada a ser verificada (0 a 8).
 * @returns {boolean} Retorna true se o jogo terminou (vitória ou empate), false caso contrário.
 */
function verificarVitoria(jogo, id) {
  let resultado = false;
  if (jogo.jogada > 3) {
    let estrutura = avaliarQuadro(jogo.velha, id, jogo.jogador);

    if (estrutura) {
      jogo.ganhador = jogo.jogador;
      jogo.estruturaVitoria = estrutura;
      resultado = true;
    } else if (jogo.jogada === 8) {
      jogo.estruturaVitoria = "empate";
      resultado = true;
    }
  }
  return resultado;
}

/**
 * Função que verifica na matriz se há alguma estrutura com a soma esperada (usada na dificuldade Normal).
 * Retorna a posição da casa vazia na estrutura encontrada ou -1 caso não encontre.
 * @param {number[][]} matriz Matriz 3x3 representando o tabuleiro do jogo.
 * @param {number} valor Soma alvo a ser comparada (ex: -2 para vitória do BOT, 2 para bloqueio do Player).
 * @param {string} estrutura String ("linha", "coluna" ou "diagonal") a ser verificada.
 * @returns {number} ID da casa (0 a 8) ou -1.
 */
function verificarSomaAlinhada(matriz, valor, estrutura) {
  for (let i = 0; i < 3; i++) {
    if (estrutura == "linha") {
      if ((matriz[i][0] + matriz[i][1] + matriz[i][2]) == valor) {
        for (let j = 0; j < 3; j++) {
          if (matriz[i][j] == 0) {
            return (i * 3 + j);
          }
        }
      }
    } else if (estrutura == "coluna") {
      if ((matriz[0][i] + matriz[1][i] + matriz[2][i]) == valor) {
        for (let j = 0; j < 3; j++) {
          if (matriz[j][i] == 0) {
            return (j * 3 + i);
          }
        }
      }
    } else if ((estrutura == "diagonal") && (i != 1)) {
      if ((matriz[0][i] + matriz[1][1] + matriz[2][2 - i]) == valor) {
        if (matriz[0][i] == 0) {
          return i;
        } else if (matriz[1][1] == 0) {
          return 4;
        } else if (matriz[2][2 - i] == 0) {
          return 6 + (2 - i);
        }
      }
    }
  }
  return -1;
}