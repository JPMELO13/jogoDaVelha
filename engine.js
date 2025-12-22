/**
 * Função que utiliza o algoritmo Minimax com poda Alpha-Beta para determinar a melhor jogada.
 * Avalia recursivamente as possibilidades do tabuleiro para garantir que o BOT não perca.
 * @param matriz Matriz 3x3 representando o estado atual do tabuleiro.
 * @param profundidade Número que indica a distância da jogada atual (usado para pontuar vitórias rápidas).
 * @param alpha O melhor valor que o maximizador pode garantir.
 * @param beta O melhor valor que o minimizador pode garantir.
 * @param isMaximizing Booleano que define se é a vez do maximizador (BOT) ou minimizador (Player).
 * @param ultimoId O ID da última casa preenchida para verificação de vitória.
 */
function minimax(matriz, profundidade, alpha, beta, isMaximizing, ultimoId) {
    let jogadorAnterior;
    //console.count("Simulações do BOT");
    // Define quem fez a última jogada para poder avaliar o quadro
    if (isMaximizing == true) {
        jogadorAnterior = -1; // Se agora seria o BOT(1) a maximizar, o anterior foi o Player(-1)
    } else {
        jogadorAnterior = 1;  // Se agora seria o Player(-1), o anterior foi o BOT(1)
    }

    if (ultimoId !== undefined) {
        let resultado = avaliarQuadro(matriz, ultimoId, jogadorAnterior);

        if (resultado != null) {
            // Se o vencedor foi o Player (1), retorna pontuação positiva
            if (jogadorAnterior == 1) {
                return 10 - profundidade;
            } 
            // Se o vencedor foi o BOT (-1), retorna pontuação negativa
            else {
                return -10 + profundidade;
            }
        }
    }

    // Verifica se o tabuleiro está cheio (empate)
    let disponivel = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (matriz[i][j] == 0) {
                disponivel++;
            }
        }
    }

    if (disponivel == 0) {
        return 0;
    }

    if (isMaximizing == true) {
        let melhorScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (matriz[i][j] == 0) {
                    matriz[i][j] = 1; // Simula jogada do Player
                    let idAtual = i * 3 + j;
                    let score = minimax(matriz, profundidade + 1, alpha, beta, false, idAtual);
                    matriz[i][j] = 0; // Desfaz simulação
                    
                    if (score > melhorScore) {
                        melhorScore = score;
                    }
                    if (melhorScore > alpha) {
                        alpha = melhorScore;
                    }
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return melhorScore;
    } else {
        let melhorScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (matriz[i][j] == 0) {
                    matriz[i][j] = -1; // Simula jogada do BOT
                    let idAtual = i * 3 + j;
                    let score = minimax(matriz, profundidade + 1, alpha, beta, true, idAtual);
                    matriz[i][j] = 0; // Desfaz simulação

                    if (score < melhorScore) {
                        melhorScore = score;
                    }
                    if (melhorScore < beta) {
                        beta = melhorScore;
                    }
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return melhorScore;
    }
}

/**
 * Função que avalia o quadro do jogo da velha, retornando 1 se o player 1 venceu, -1 se o player 2 venceu e 0 caso contrário.
 * @param {number[][]} matriz uma matriz 3x3 representando o tabuleiro do jogo da velha preenchida com 1, -1 ou 0
 * @param {number} id o id do botão da jogada a ser avaliada (0 a 8)
 * @param {number} jogador o valor do jogador atual (1 ou -1)
 * @returns {string|null} uma string representando a estrutura vencedora ("linha", "coluna", "diagonal0", "diagonal2") ou null se não houver vencedor
 */
function avaliarQuadro(matriz, id, jogador) {
  let somaLinha = 0;
  let somaColuna = 0;
  let somaDiagonal0 = 0;
  let somaDiagonal2 = 0;
  let alvo = 3 * jogador;
  for (let i = 0; i < 3; i++) {
      // Soma a linha e coluna do ID clicado
      somaLinha += matriz[Math.floor(id / 3)][i];
      somaColuna += matriz[i][id % 3];
      // Lógica das diagonais que você criou
      if (id == 4) {
        somaDiagonal0 += matriz[i][i];
        somaDiagonal2 += matriz[i][2 - i];
      }
      else if (id % 8 == 0) {
        somaDiagonal0 += matriz[i][i];
      }
      else if (id % 2 == 0) {
        somaDiagonal2 += matriz[i][2 - i];
      }
  }
  // Retorna a estrutura apenas se a soma atingir o alvo do jogador atual
  if (somaDiagonal0 == alvo) return "diagonal0";
  if (somaDiagonal2 == alvo) return "diagonal2";
  if (somaLinha == alvo) return "linha";
  if (somaColuna == alvo) return "coluna";

  return null; // Ninguém venceu ainda
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
        jogo.ganhador=jogo.velha[Math.floor(cont/3)][cont%3];
        return true
      };
    }
  }
  if (jogo.jogada > 3) {
    //Ao fim dos turnos verifica as condicoes de vitoria, preenche a variavel ganhador com o player caso haja ganhador e retorna true
    let estrutura = avaliarQuadro(jogo.velha, id, jogo.jogador);

    if(estrutura) {
      jogo.ganhador = jogo.jogador;
      jogo.estruturaVitoria = estrutura;
      resultado = true;
    }
    // Se ninguém ganhou e é a última jogada, é empate
    else if (jogo.jogada === 8) {
      jogo.estruturaVitoria = "empate";
      resultado = true;
    }
  }
  return resultado
}

/**
 * Função que verifica na matriz, se há a estrutura que possua a soma esperada.
 * Retorna a posição da casa não preenchida presente na estrutura que tenha a soma esperada. Caso não encontre, retorna -1.
 * @param matriz Matriz 3x3 representando o tabuleiro do jogo.
 * @param valor Número a ser comparado durante verificação.
 * @param estrutura String ("linha","coluna" ou "diagonal") a ser executada verificação
 */
function verificarSomaAlinhada(matriz, valor, estrutura) {
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