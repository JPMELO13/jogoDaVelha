const form = document.getElementById('form_players');

function mudarTema(destaque, secundaria, fundo, hover) {
  //passando codigos hex das cores por parâmetro é alterada no arquivo css
  document.documentElement.style.setProperty('--cor-destaque', destaque);
  document.documentElement.style.setProperty('--cor-secundaria', secundaria);
  document.documentElement.style.setProperty('--cor-de-fundo', fundo);
  document.documentElement.style.setProperty('--cor-hover-botao', hover);
}

function verificarNomesIguais(nome1, nome2){
  let resultado = false
  if (nome1==nome2){
    resultado = true;
  }
  return resultado;
}

function mensagemDeErro(mensagem){
  form.insertAdjacentHTML("beforeend", "<h3 class='conteudo__titulo' >"+ mensagem+"</h3>")
  setTimeout(() => {
    document.querySelector("h3").remove();
  }, 1000);
}

function capturaDadosForm(e){
  e.preventDefault();
    player1 = "Player1"
    if(form.elements[2].value != ""){
      player1=form.elements[2].value;
    }
    if (modo == "single"){
      player2 = "BOT";
      dificuldade = form.dificuldade.value
    }// (if  modo==single)
    else{
      player2 = "Player2"
      if(form.elements[3].value != ""){
        player2=form.elements[3].value;
      }
    }//else(if modo==multi)
    if(verificarNomesIguais(player1,player2)==0){
      if(!((modo=="single")&&(dificuldade==""))){
        if(!((modo=="single")&&(dificuldade=="impossivel"))){
          document.getElementsByClassName("modal")[0].classList.add("modal__concluido");
          iniciar();
        }
        else{
          // mensagemDeErro("Não disponível!");
          document.getElementsByClassName("modal")[0].classList.add("modal__concluido");
          iniciar();
        }
      }
      else{
        mensagemDeErro("Dificuldade Inválida!");
      }      
    }else{
      mensagemDeErro("Nome(s) Inválido(s)!");
    }

}

window.onload = function () {
  document.getElementById("reiniciar__botao").addEventListener("click", reiniciar)
  var gameMode = form.switchMode;
  for(let i=0;i<gameMode.length;i++){
    gameMode[i].onclick = function(){
      modo = this.value;
      let campos = document.getElementsByClassName("player__field");
      let botaoJogar = document.getElementsByClassName("jogar");
      for(let j=0;j<campos.length;){
        campos[j].remove();
      }
      if(botaoJogar.length>0){
        botaoJogar[0].remove();
      }      
      form.insertAdjacentHTML("beforeend", "<div class='player__field'><span class='player__icon'>&#10005 </span><input type='text' class='player__input' name='player1' placeholder='Player1'></div>");
      
      if (modo=="single"){
        player2="BOT";
        form.insertAdjacentHTML("beforeend", "<div class='player__field'><div class='switch-field'><input type='radio' id='radio-facil' name='dificuldade' value='facil' ><label for='radio-facil'>Fácil</label><input type='radio' id='radio-dif' name='dificuldade' value='impossivel'><label for='radio-dif'>Impossível</label></div></div>");

      }
      else if (modo=="multi"){
        form.insertAdjacentHTML("beforeend", "<div class='player__field'><span class='player__icon'>&#9711</span><input type='text' class='player__input' name='player2' placeholder='Player2'></div>")

      }
      form.insertAdjacentHTML("beforeend", "<button class='botao jogar' type='submit'>Jogar</button>");
    }
  }
  
  form.addEventListener('submit', capturaDadosForm)
};