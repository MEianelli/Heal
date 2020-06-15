var healthBar = [];
var damage = 0;
var timerDamage = 0;
var timerDamage2 = 0;
var targetBar;
var casting = false;
var instant = false;
var timerCasting = 0;
var dificulty = 30;
var manaUsed = 0;
var milli;
var overHealed = 0;
var tempOverHealed = 0;
var totalOverHealed = 0;
var globalTimer = 0;
var previousTime = 0;
var buttonStart = document.getElementById("start");
var buttonReset = document.getElementById("reset");

//EVITAR O SOM TOCAR SEM CASTAR TEM QUE COLOCAR AONDE FOI CASTADO NESSE BUFFER
var castedOn;
//VARIAVEIS DOS SONS
var InstantHeal01;
var CastHeal01;

//VARIAVEIS DE JOGABILIDADE
var numBarras = 5; 
var castManaCost = 8;
var instantManaCost = 20;
var castHealAmount = 200;
var instantHealamount = 100;
var damageModifier = 10;

//DURACAO DO JOGO
var gameDuration = 300;

//VELOCIDADE COM QUE O DANO EH APLICADO
var damageCounter = 5;


//SETUP INICIAL DO CANVAS
function setup() {
 var canvas = createCanvas(400,500);
 canvas.parent('sketch-holder');
 $('#defaultCanvas0').css('display','none');
 CastHeal01 = new p5.SoundFile('sounds/CastHeal01.mp3');
 InstantHeal01 = new p5.SoundFile('sounds/InstantHeal01.mp3');
 noLoop();
 
 //Animacao para o menu de instructions
 $('#harder').bind('click',function(){
     if(numBarras < 20){
         numBarras++;
     }
     $('#healthb').html('#HEALTH BARS '+numBarras);
 });
 
 $('#healthb').html('#HEALTH BARS '+numBarras);
 $('#instructions').bind('click',function(){
        $('#instructions2').slideToggle();
 });
}


//BOTAO DE START DO JOGO, COMECA O LOOP DRAW E MOSTRA CONTAGEM REGRESSIVA
buttonStart.onclick = function startGame(){
    $('#defaultCanvas0').css('display','block');
    $('#score').css('display','none');
    //Cria array com a quantidade de barras de vida selecionada e com Width de valor para todos
    for(i = 0; i < numBarras; i++){
     healthBar.push(width);
    }
    setTimeout(outloop,3000);
    showMsg(2);
    setTimeout(function() {
        showMsg(1);
        setTimeout(function() {
            showMsg("GO")
        }, 1000);
    }, 1000);
    casting = false; //evitar ja comecar o jogo castando uma magia
}


//INICIAR TIMER FORA DO LOOP DRAW
function outloop(){
    previousTime = millis();
    loop();
}

//FUNCAO PARA MOSTRAR TEXTO NA TELA
function showMsg(word){
    background(51);
    textSize(50);
    fill(240);
    textFont("Tahoma");
    textAlign(CENTER);
    text(word,200,250);
}

buttonReset.onclick = function resetGame(){
    window.location.href = window.location.href;
}

//Funcao que retorna em qual barra de vida o mouse esta emcima
function getMouseY(){
 for (i = 1; i < numBarras+1; i++){
  if(mouseY > [i-1]*0.85*height/numBarras && mouseY < i*0.85*height/numBarras){
   targetBar = i-1;
   return targetBar;
  }
 }
} 

//Funcao para setar flags se usou mouse esquerdo ou direito (seta tipo da magia)
function mousePressed(){
 if(mouseButton == LEFT){   
  casting = true;
  castedOn = getMouseY();
  if($('#defaultCanvas0').css('display') === "block"){
      CastHeal01.setVolume(0.1);
      CastHeal01.play();
  }
 }
 if(mouseButton == RIGHT){
  instant = true;
  castedOn = getMouseY();
  if($('#defaultCanvas0').css('display') === "block"){
      InstantHeal01.setVolume(0.1);
      InstantHeal01.play();
  }
 }
}

function draw() {
 background(51);

 //Desenho da barra de cast e de mana
 noStroke();
 fill(0,90,185);
 rect(0,9*height/10,width-manaUsed,height/10); //MANA
 fill(206, 154, 185);
 rect(0,17*height/20,width/dificulty*timerCasting,height/20); //cast
 
 
 //timerDamage restringe a velocidade com que o dano eh aplicado
 if (timerDamage > damageCounter){
  //COMO CALCULA O DANO, PRECISA ATUALIZAR
  damage = Math.floor((Math.random() * 15) + damageModifier);
  //acha uma barra aleatoria
  var j = floor(random(healthBar.length));
  healthBar[j] -= damage;
  timerDamage = 0;
  timerDamage2 += 1;
  if(timerDamage2 > 10-numBarras){
      damage = Math.floor((Math.random() * 15) + damageModifier);
      j = floor(random(healthBar.length));
      healthBar[j] -= damage;
      timerDamage2 = 0;
  }
 }

 // desenho das barras de vida
 for(i = 0; i < numBarras; i++){
  var barColor = map(healthBar[i],0,width,0,180);
  noStroke();
  fill(160, barColor, 100);
  rect(0,i*0.85*height/numBarras,healthBar[i],0.85*height/numBarras); //health
 }
 
 //HIGHLIGHT A BARRA QUE O MOUSE ESTA EMCIMA
 getMouseY();
 noFill();
 stroke(226, 218, 46);
 strokeWeight(6);
 rect(0,targetBar*0.85*height/numBarras,width,0.85*height/numBarras);
 noStroke();
 
 

//magia de casting ira curar quando pressionar mouse esquerdo
 if(casting && manaUsed + castManaCost <= width){
  timerCasting++;
  if(timerCasting > dificulty){
   healthBar[castedOn] += castHealAmount;
   if(healthBar[castedOn] > 400){
       overHealed = healthBar[castedOn] - 400;
   }
   healthBar[castedOn] = constrain(healthBar[castedOn],0,width);
   mouseButton = null;
   timerCasting = 0;
   casting = false;
   manaUsed += castManaCost;
  }
 }
 
 //magia instant de curar, ira curar metade aleatoriamente
 if(instant && manaUsed + instantManaCost <= width){
  var shuffled = [];
  for(i = 0; i < numBarras; i++){
   shuffled[i] = i;
  }
  shuffled = shuffle(shuffled);
  var selected = subset(shuffled,0,floor(numBarras/2)); 
  for(i = 0; i < floor(numBarras/2); i++){
   healthBar[selected[i]] += instantHealamount;
   if(healthBar[selected[i]] > 400){
       overHealed += healthBar[selected[i]] - 400;
   }
   healthBar[selected[i]] = constrain(healthBar[selected[i]],0,width);
  }
  mouseButton = null;
  instant = false;
  manaUsed += instantManaCost;
 }
 

//TEXTO DE OVERHEAL
 if(overHealed > 0){
     totalOverHealed += overHealed;
     tempOverHealed = overHealed;
     milli = millis();
     overHealed = 0;
 }
 
 //MOSTRA O OVERHEAL CRESCENDO NA TELA
 if(millis() < milli + 1500){
    var size = ((millis()- milli)/1000)+1;
    textSize(20*size);
    fill(240);
    textFont("Open Sans");
    textAlign(CENTER);
    text("OVER HEALED "+tempOverHealed,200,250);
 }
 

 //Se alguma barra ficar zerada o jogo acaba
 if(healthBar[j] <= 0){
     showMsg("GAME OVER");
     textSize(25);
     text("OVERHEALED: "+totalOverHealed,200,300);
     noLoop();
     setTimeout(gameover,2000);
 }

//RELOGIO DO JOGO
 document.getElementById("timer").innerHTML = globalTimer/10;
 if(previousTime + 100 < millis()){
     globalTimer++;
     if(globalTimer > gameDuration){
        showMsg("VICTORY");
        textSize(25);
        text("OVERHEALED: "+totalOverHealed,200,300);
            $('#overhealed').val(totalOverHealed);
        $('#Healthbars').val(numBarras);
        noLoop();
        setTimeout(removeCanvas,2000);
     }
     previousTime = millis();
 }    
 timerDamage++; 
}

function gameover(){
    $(buttonReset).trigger("click");
}

//remover canvas no final do jogo e mostrar tela de score
function removeCanvas(){
    $('#defaultCanvas0').css('display','none');
    $('#score').css('display','block');
    $('#scoreform').css('display','block');
}