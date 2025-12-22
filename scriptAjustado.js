const form = document.getElementById('form_players');

var jogoPrincipal = {
    velha: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
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

// --- FUNÇÕES DE APOIO ---
function mudarTema(destaque, secundaria, fundo, hover) {
    document.documentElement.style.setProperty('--cor-destaque', destaque);
    document.documentElement.style.setProperty('--cor-secundaria', secundaria);
    document.documentElement.style.setProperty('--cor-de-fundo', fundo);
    document.documentElement.style.setProperty('--cor-hover-botao', hover);
}

function verificarNomesIguais(nome1, nome2) {
    return nome1 === nome2;
}

function sorteiaJogador() {
    let jogadorSorteado = Math.random() > 0.5 ? -1 : 1;
    document.getElementById("titulo").innerHTML = "Vez de " + (jogadorSorteado === 1 ? player1 : player2);
    return jogadorSorteado;
}

function mudarJogador(jogo) {
    jogo.jogador = jogo.jogador * -1;
    document.getElementById("titulo").innerHTML = "Vez de " + (jogo.jogador === 1 ? player1 : player2);
    jogo.jogada++;
    
    if (modo === "single") {
        if (jogo.jogador === -1) {
            removeListenerBotoes();
            setTimeout(() => botJogar(jogo), 500); // Delay para parecer natural
        } else {
            addListenerBotoes0();
        }
    }
}

// --- LÓGICA DO JOGO ---
function iniciar(jogo) {
    document.getElementById("titulo").classList.remove("destaque_titulo");
    let botoes = document.querySelectorAll(".botoes");
    for (let i = 0; i < 9; i++) {
        jogo.velha[Math.floor(i / 3)][i % 3] = 0;
        botoes[i].innerHTML = "";
        botoes[i].value = "0";
        botoes[i].classList.remove("destaque__vitoria");
    }
    jogo.ganhador = 0;
    jogo.jogada = 0;
    jogo.estruturaVitoria = null;
    jogo.principal = true;
    jogo.jogador = sorteiaJogador();

    if (jogo.jogador === -1 && modo === "single") {
        botJogar(jogo);
    } else {
        addListenerBotoes0();
    }
}

function addListenerBotoes0() {
    let botoes = document.querySelectorAll(".botoes");
    for (let i = 0; i < 9; i++) {
        if (jogoPrincipal.velha[Math.floor(i / 3)][i % 3] === 0) {
            botoes[i].classList.add("selecionavel");
            botoes[i].addEventListener("click", cliqueBotao);
        }
    }
}

function cliqueBotao(obj) {
    if (obj.target.value == "0" && jogoPrincipal.ganhador == 0) {
        obj.target.classList.remove("selecionavel");
        obj.target.value = jogoPrincipal.jogador;
        obj.target.innerHTML = jogoPrincipal.jogador === 1 ? "&#10005" : "&#9711";
        
        let idMod = parseInt(obj.target.id.replace('b', ''));
        jogoPrincipal.velha[Math.floor(idMod / 3)][idMod % 3] = jogoPrincipal.jogador;
        
        if (verificarVitoria(jogoPrincipal, idMod)) {
            terminar();
            destacarFinal(idMod);
        } else {
            mudarJogador(jogoPrincipal);
        }
    }
}

// --- INTELIGÊNCIA ARTIFICIAL (MINIMAX) ---

function avaliarQuadro(matriz) {
    for (let i = 0; i < 3; i++) {
        let sL = matriz[i][0] + matriz[i][1] + matriz[i][2];
        let sC = matriz[0][i] + matriz[1][i] + matriz[2][i];
        if (sL === 3 || sC === 3) return 1;
        if (sL === -3 || sC === -3) return -1;
    }
    let d1 = matriz[0][0] + matriz[1][1] + matriz[2][2];
    let d2 = matriz[0][2] + matriz[1][1] + matriz[2][0];
    if (d1 === 3 || d2 === 3) return 1;
    if (d1 === -3 || d2 === -3) return -1;
    return 0;
}

function minimax(matriz, profundidade, alpha, beta, isMaximizing) {
    let resultado = avaliarQuadro(matriz);
    if (resultado === -1) return -10 + profundidade;
    if (resultado === 1) return 10 - profundidade;
    
    // Checa empate
    let disponivel = 0;
    for(let i=0; i<3; i++) for(let j=0; j<3; j++) if(matriz[i][j] === 0) disponivel++;
    if (disponivel === 0) return 0;

    if (isMaximizing) {
        let melhorScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (matriz[i][j] === 0) {
                    matriz[i][j] = 1;
                    let score = minimax(matriz, profundidade + 1, alpha, beta, false);
                    matriz[i][j] = 0;
                    melhorScore = Math.max(score, melhorScore);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) break;
                }
            }
        }
        return melhorScore;
    } else {
        let melhorScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (matriz[i][j] === 0) {
                    matriz[i][j] = -1;
                    let score = minimax(matriz, profundidade + 1, alpha, beta, true);
                    matriz[i][j] = 0;
                    melhorScore = Math.min(score, melhorScore);
                    beta = Math.min(beta, score);
                    if (beta <= alpha) break;
                }
            }
        }
        return melhorScore;
    }
}

function botJogar(jogo) {
    let botaoEscolhido;
    
    if (dificuldade === "facil") {
        let ganhaLinha = verificaSomaAlinhada(jogo.velha, -2, "linha");
        let ganhaColuna = verificaSomaAlinhada(jogo.velha, -2, "coluna");
        let ganhaDiagonal = verificaSomaAlinhada(jogo.velha, -2, "diagonal");
        let bloqLinha = verificaSomaAlinhada(jogo.velha, 2, "linha");
        let bloqColuna = verificaSomaAlinhada(jogo.velha, 2, "coluna");
        let bloqDiagonal = verificaSomaAlinhada(jogo.velha, 2, "diagonal");

        if (ganhaLinha > -1) botaoEscolhido = ganhaLinha;
        else if (ganhaColuna > -1) botaoEscolhido = ganhaColuna;
        else if (ganhaDiagonal > -1) botaoEscolhido = ganhaDiagonal;
        else if (bloqLinha > -1) botaoEscolhido = bloqLinha;
        else if (bloqColuna > -1) botaoEscolhido = bloqColuna;
        else if (bloqDiagonal > -1) botaoEscolhido = bloqDiagonal;
        else {
            do {
                botaoEscolhido = Math.floor(Math.random() * 9);
            } while (jogo.velha[Math.floor(botaoEscolhido / 3)][botaoEscolhido % 3] !== 0);
        }
    } 
    else {
        let melhorScore = Infinity;
        let melhorI, melhorJ;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (jogo.velha[i][j] === 0) {
                    jogo.velha[i][j] = -1;
                    let score = minimax(jogo.velha, 0, -Infinity, Infinity, true);
                    jogo.velha[i][j] = 0;
                    if (score < melhorScore) {
                        melhorScore = score;
                        melhorI = i; melhorJ = j;
                    }
                }
            }
        }
        botaoEscolhido = melhorI * 3 + melhorJ;
    }

    // Execução visual
    let botoes = document.querySelectorAll(".botoes");
    let obj = botoes[botaoEscolhido];
    obj.value = jogo.jogador;
    jogo.velha[Math.floor(botaoEscolhido / 3)][botaoEscolhido % 3] = jogo.jogador;
    
    obj.innerHTML = "&#9711"; // Marca O para o BOT
    if (verificarVitoria(jogo, botaoEscolhido)) {
        terminar();
        destacarFinal(botaoEscolhido);
    } else {
        mudarJogador(jogo);
    }
}

// --- FUNÇÕES DE FINALIZAÇÃO E UI ---

function verificarVitoria(jogo, id = -1) {
    if (id === -1) return false;
    let r = Math.floor(id / 3), c = id % 3;
    let somaL = 0, somaC = 0, somaD1 = 0, somaD2 = 0;
    
    for (let i = 0; i < 3; i++) {
        somaL += jogo.velha[r][i];
        somaC += jogo.velha[i][c];
        somaD1 += jogo.velha[i][i];
        somaD2 += jogo.velha[i][2-i];
    }
    
    let winVal = 3 * jogo.jogador;
    if (somaL === winVal) { jogo.ganhador = jogo.jogador; jogo.estruturaVitoria = "linha"; return true; }
    if (somaC === winVal) { jogo.ganhador = jogo.jogador; jogo.estruturaVitoria = "coluna"; return true; }
    if (id % 4 === 0 && somaD1 === winVal) { jogo.ganhador = jogo.jogador; jogo.estruturaVitoria = "diagonal0"; return true; }
    if ((id === 2 || id === 4 || id === 6) && somaD2 === winVal) { jogo.ganhador = jogo.jogador; jogo.estruturaVitoria = "diagonal2"; return true; }
    
    if (jogo.jogada >= 8) { jogo.estruturaVitoria = "empate"; return true; }
    return false;
}

function destacarFinal(id) {
    let titulo = document.getElementById("titulo");
    if (jogoPrincipal.ganhador === 1) titulo.innerText = player1 + " venceu!";
    else if (jogoPrincipal.ganhador === -1) titulo.innerText = player2 + " venceu!";
    else titulo.innerText = "Empate!";

    if (jogoPrincipal.estruturaVitoria === "diagonal0") destacarDiagonal(0);
    else if (jogoPrincipal.estruturaVitoria === "diagonal2") destacarDiagonal(2);
    else if (jogoPrincipal.estruturaVitoria === "linha") destacarLinha(id);
    else if (jogoPrincipal.estruturaVitoria === "coluna") destacarColuna(id);
    else if (jogoPrincipal.estruturaVitoria === "empate") {
        for(let i=0; i<3; i++) destacarColuna(i);
    }
}

function destacarLinha(id) {
    let inicio = Math.floor(id / 3) * 3;
    for(let i=0; i<3; i++) document.getElementById('b'+(inicio+i)).classList.add("destaque__vitoria");
}

function destacarColuna(id) {
    let inicio = id % 3;
    for(let i=0; i<3; i++) document.getElementById('b'+(inicio+i*3)).classList.add("destaque__vitoria");
}

function destacarDiagonal(diag) {
    document.getElementById('b4').classList.add("destaque__vitoria");
    document.getElementById('b'+diag).classList.add("destaque__vitoria");
    document.getElementById('b'+(8-diag)).classList.add("destaque__vitoria");
}

function removeListenerBotoes() {
    let botoes = document.querySelectorAll(".botoes");
    botoes.forEach(b => {
        b.classList.remove("selecionavel");
        b.removeEventListener("click", cliqueBotao);
    });
}

function terminar() {
    removeListenerBotoes();
    document.getElementById("titulo").classList.add("destaque_titulo");
}

function reiniciar() {
    iniciar(jogoPrincipal);
}

function verificaSomaAlinhada(matriz, valor, estrutura) {
    for (let i = 0; i < 3; i++) {
        if (estrutura == "linha") {
            if ((matriz[i][0] + matriz[i][1] + matriz[i][2]) == valor) {
                for (let j = 0; j < 3; j++) if (matriz[i][j] == 0) return (i * 3 + j);
            }
        }
        else if (estrutura == "coluna") {
            if ((matriz[0][i] + matriz[1][i] + matriz[2][i]) == valor) {
                for (let j = 0; j < 3; j++) if (matriz[j][i] == 0) return (j * 3 + i);
            }
        }
        else if (estrutura == "diagonal" && i != 1) {
            if ((matriz[0][i] + matriz[1][1] + matriz[2][2 - i]) == valor) {
                if (matriz[0][i] == 0) return i;
                if (matriz[1][1] == 0) return 4;
                if (matriz[2][2 - i] == 0) return 6 + (2 - i);
            }
        }
    }
    return -1;
}

function capturaDadosForm(e) {
    e.preventDefault();

    // 1. Captura limpa (usando nomes e valores padrão)
    player1 = form.player1.value || "Player 1";
    player2 = (modo === "single") ? "BOT" : (form.player2.value || "Player 2");
    dificuldade = form.dificuldade.value;

    // 2. Validação direta (Early Return - "Retorno Antecipado")
    if (verificarNomesIguais(player1, player2)) {
        return mensagemDeErro("Nome(s) Inválido(s)!");
    }

    if (modo === "single" && !dificuldade) {
        return mensagemDeErro("Dificuldade Inválida!");
    }

    // 3. Sucesso: Executa o que precisa
    document.querySelector(".modal").classList.add("modal__concluido");
    iniciar(jogoPrincipal);
}

window.onload = function () {
    var gameMode = form.switchMode;
    for (let i = 0; i < gameMode.length; i++) {
        gameMode[i].onclick = function () {
            modo = this.value;
            let container = document.getElementById("form_players");
            // Limpa campos anteriores mantendo os radios de modo
            document.querySelectorAll(".player__field, .jogar").forEach(el => el.remove());
            
            container.insertAdjacentHTML("beforeend", "<div class='player__field'><input type='text' class='player__input' name='player1' placeholder='Nome Player 1'></div>");
            
            if (modo === "single") {
                container.insertAdjacentHTML("beforeend", "<div class='player__field'><div class='switch-field'><input type='radio' id='radio-facil' name='dificuldade' value='facil' checked><label for='radio-facil'>Fácil</label><input type='radio' id='radio-dif' name='dificuldade' value='impossivel'><label for='radio-dif'>Impossível</label></div></div>");
            } else {
                container.insertAdjacentHTML("beforeend", "<div class='player__field'><input type='text' class='player__input' name='player2' placeholder='Nome Player 2'></div>");
            }
            container.insertAdjacentHTML("beforeend", "<button class='botao jogar' type='submit'>Jogar</button>");
        }
    }
    form.addEventListener('submit', capturaDadosForm);
    document.getElementById("reiniciar__botao").addEventListener("click", reiniciar);
};