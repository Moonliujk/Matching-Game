/*
 * Create a list that holds all of your cards
 */

/*
  * TODO:

  */
const CARDSNUM = 16;    //define the number of cards

let cardsArray = new Array(),
    matchQueue = new Array(),
    steps = 0,
    lastEle,
    clockFlag,
    matchNum = 0,
    time = 0;


var moves = document.getElementsByClassName("moves")[0];

let $deck = $('.deck');

var winInfor = document.getElementsByClassName('win')[0];
var renewInfor = document.getElementsByClassName('renew')[0];
var stars = document.getElementsByClassName("stars")[0];
var starsEle = stars.getElementsByTagName("span");
var minutes = document.getElementsByClassName('minutes')[0];
var seconds = document.getElementsByClassName('seconds')[0];
var container = document.getElementsByClassName('container')[0];
var countCircle = document.getElementsByClassName('count-circle')[0];
var startInterface = document.getElementsByClassName("start-interface")[0];
var countDown = document.getElementsByClassName('count-down')[0];
var inputs = document.getElementsByTagName('input');
var restTime = document.getElementById('rest-time');
var modeChooseInfor = document.getElementsByClassName('mode-choose')[0];
var source = [
  "chirsmasTree.jpg",
  "gre.png",
  "kanshan.png",
  "papa.png",
  "pizza.png",
  "polarBeer.png",
  "reindeer.jpg",
  "sushi.png"
];

//create 16 children nodes into the <ul class="deck">
function createNodes() {
  let content = ``;

  for(let i=0; i<CARDSNUM; i++) {
    content +=
    `<div class="flipper-container card">
          <div class="flipper">
              <div class="front"></div>
              <div class="back"></div>
          </div>
      </div>`;
  }

  $deck.html(content);
}

//Create Cards constructor, which includes imageNum & source properties
//The imageNum is an ID number of the card, which can be used to define whether two cards are matched
function Cards(i) {
  this.imageNum = i;
  this.source = `img/matchIcon/${source[i]}`;
}
//Create cards which save in cardsArray and each card has its own imageNum(there are two cards have same imageNum.)
function createCards () {
  let num = 0;

  for(let i=0; i<CARDSNUM; i++){
    if(i%2 === 0){
      num++;
    }
    cardsArray[i] = new Cards(num-1);
  }

}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle() {
    let currentIndex = cardsArray.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cardsArray[currentIndex];
        cardsArray[currentIndex] = cardsArray[randomIndex];
        cardsArray[randomIndex] = temporaryValue;
    }
}

//Create the structure which can save the elements that are clicked contiguously
//'matched' property can be used to judge whether two elements have been compared.
function MatchUnit(lastEle, currentEle) {
  this.lastEle = lastEle;
  this.currentEle = currentEle;
  this.matched = false;
}
//to format the output  eg: '0:0' => '00:09'
function formatting(time) {
  return (time>=0 && time<=9) ? "0" + time : time;
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//To create some eventsListener on some controller.
function eventsRegister() {
  let restartIcon = document.getElementsByClassName("restart-icon")[0],
      restartButtons = document.getElementsByClassName("restart"),
      continueButton = document.getElementsByClassName("continue")[0],
      backtoButton = document.getElementsByClassName('backto')[0],
      startButton = document.getElementById("start"),
      $cardsEle = $('.flipper');

  startButton.addEventListener("click", chooseModeDlg, false);
  backtoButton.addEventListener("click", backToMain, false);
  restartIcon.addEventListener("click", restartDlg, false);
  continueButton.addEventListener("click", continueToPlay, false);

  //const NUM_CARDS = cardsEle.length;
  const NUM_RESTARTBUTTONS = restartButtons.length;

  // to bind each cards with its function through the 'data-id' property eg: $cardsEle[1] => the function Cards[1]
  //for(let i=0;i<NUM_CARDS;i++){
  //  cardsEle[i].setAttribute("data-id", i);
  //  cardsEle[i].addEventListener("click", cardsClickEvent, false);
  //}
  $cardsEle.each(function(index) {
    $(this).attr("data-id", index).click(cardsClickEvent)
  })
  for(let i=0;i<NUM_RESTARTBUTTONS ;i++){
    restartButtons[i].addEventListener("click", backtoStart, false);
  }

}

// The start interface's animation & events
function chooseModeDlg() {
  //to judge whether choose the game level
  for (let i=0;i<inputs.length;i++) {
    if (inputs[i].checked) {
      startGame();
      return true;
    }
  }

  modeChooseInfor.style.display = "block";
  modeChooseInfor.firstElementChild.classList.add('flipInX');

  return false;
}

function startGame() {
  //To configure the game level depending on the player' option.
  for (let i=0;i<inputs.length;i++) {
    if (inputs[i].checked) {
      if(inputs[i].value === "hard") {
        showCountDown();
      }
    }
  }

  startInterface.style.display = "none";
  container.style.display = "flex";

  clock();
}

//to show the count-down timer
function showCountDown() {
  countDown.style.display = "block";
  countDown.classList.add("bounce-in-left");
  countCircle.classList.add('count-down-animation');
  countCircle.classList.add('running');

  setTimeout("countDownFinish()", 30000);
}

function countDownFinish() {
  if(time === 30 && matchNum !== 8)  {
      clearTimeout(clockFlag);
      winInfor.style.display = "block";
      winAnimation("false");
  }
}

//The' backto' dialog show & hidden animation.
function backToMain() {
  modeChooseInfor.firstElementChild.classList.remove('flipInX');
  modeChooseInfor.firstElementChild.classList.add('flipOutX');
  modeChooseInfor.firstElementChild.addEventListener('animationend', delBacktoAnimation, false);
}

function delBacktoAnimation() {
  modeChooseInfor.style.display = 'none';
  this.classList.remove('flipOutX');
  this.removeEventListener('animationend', delBacktoAnimation, false);
}

function restartDlg() {
  countCircle.classList.remove('running');
  countCircle.classList.add('paused');

  renewInfor.style.display = "block";
  container.classList.add("bg-blur");

  clearTimeout(clockFlag);
}

function continueToPlay() {
  clock();

  countCircle.classList.remove('paused');
  countCircle.classList.add('running');

  renewInfor.style.display = "none";
  container.classList.remove("bg-blur");
}

function backtoStart() {
  countCircle.classList.remove('count-down-animation', 'paused');
  restTime.classList.remove('empersized');

  renewInfor.style.display = "none";
  winInfor.style.display = "none";
  container.classList.remove("bg-blur");

  container.style.display = 'none';
  startInterface.style.display = 'block';

  for (let i=0;i<inputs.length;i++) {
    if (inputs[i].checked) {
      inputs[i].checked = false;
    }
  }

  initCards();
}

//to init relevant value, remove classname in elements and configure some elements background images.
function initCards() {
  let $cardsEle = $('.flipper');

  clearTimeout(clockFlag);

  minutes.innerHTML = '00';
  seconds.innerHTML = '00';
  moves.innerHTML = "0";
  steps = 0;
  matchNum = 0;
  time = 0;

  matchQueue = new Array();
  countDown.style.display = "none";
  countCircle.classList.remove('count-down-animation', 'running');

  createCards();
  shuffle();

  const NUM_STARTS = starsEle.length;
  const NUM_CARDS = $cardsEle.length;

  for (let i=0;i<NUM_STARTS;i++) {
    starsEle[i].className = "fa fa-star";
  }
  //to configure each card's background-image
  //for (let i=0; i<NUM_CARDS; i++) {
    // cardsEle[i].className = "flipper";
    //
    //cardsEle[i].lastElementChild.style.backgroundImage = `url(${cardsArray[i].source})`;
  //}
  $.each($('.flipper .back'), function(index) {
    $(this).css('background-image', `url(${cardsArray[index].source})`);
  })
}

//to add animation through adding classes on elements and count the number of steps
/**
 * [cardsClickEvent 为点击元素添加类名，添加点击动画以及将点击元素加入匹配单元]
 * @return none
 */
function cardsClickEvent() {
  let ele = $(this);

  if(ele.hasClass("match") || ele.hasClass("open") || ele.hasClass("error"))  return ;

  ele.addClass("open", "show");

  steps++;
  moves.innerHTML = Math.floor(steps/2);
  setStars(Math.floor(steps/2));

  if(steps%2 === 1){
    lastEle = ele;
  } else if (lastEle.attr("data-id") !== ele.attr("data-id")) {    // 保证两次单击的元素不一样
      currentEle = ele;
      matchQueue.push(new MatchUnit(lastEle, currentEle));
      setTimeout(() => {
        isMatch(matchQueue)
      }, 500);
  } else {
    steps--;
  }
}

function setStars(stepNum) {
  /*
  Erro: This function has a problem! when I set justify words into 'switch', it will lose the
  feature that can rate stars when achieving certain steps. But using single step to debug, it will
  work correctly! The reason is ?
  */
  let styleTxt = "fa fa-star-o",
      flag = 0;

  //to set diffirent stars depending on the number of steps.
  if (stepNum >= 14 && stepNum < 22) {
    flag = 1;
  } else if (stepNum >= 22 && stepNum < 28) {
    flag = 2;
  } else if (stepNum >= 28) {
    flag = 3;
  }
  switch (flag) {
    case (1):
      if(starsEle[2].className !== styleTxt)
        starsEle[2].className = styleTxt;
      break;
    case (2):
      if(starsEle[1].className !== styleTxt)
        starsEle[1].className = styleTxt;
      break;
    case (3):
      if(starsEle[0].className !== styleTxt)
        starsEle[0].className = styleTxt;
      break;
  }
}

//this algorithm has the problem, it can't finish dynamic data save!
//to compare with two elements' imageNum properties at the same MatchUnit(per 500ms)
function isMatch(array) {
  if(array.length === 0) return ;

  while ( (array.length !== 0) && (!array[0].matched)) {
    let $lastEle = array[0].lastEle,
        $currentEle = array[0].currentEle,
        num_last = $lastEle.attr("data-id"),
        num_cur = $currentEle.attr("data-id");

    if(cardsArray[num_last].imageNum === cardsArray[num_cur].imageNum){
      $lastEle.addClass("match");
      $currentEle.addClass("match");
      array.shift();
      if(++matchNum === 8) {
        countCircle.classList.remove('count-down-animation', 'paused');
        clearTimeout(clockFlag);
        winAnimation("true");
      }
    } else {
      array[0].matched = true;
      // google适用
      $lastEle.addClass("error").bind('animationend', function() {
        setTimeout(() => {
          $lastEle.removeClass("error open show")
        }, 250)
      });
      $currentEle.addClass("error").bind('animationend', function() {
        setTimeout(() => {
          $currentEle.removeClass("error open show")
        }, 250)
      });
      // edge 适用
      /*$lastEle.addClass("error").bind('animationend', function() {
          $lastEle.removeClass("error open show")
      });
      $currentEle.addClass("error").bind('animationend', function() {
          $currentEle.removeClass("error open show")
      });*/


      array.shift();
    }
  }
}

//to show the finish-game dislog, add some animation into it.
function winAnimation(isWin) {
  let finishStars = document.getElementsByClassName('fa-star-o'),
      header = winInfor.getElementsByClassName('header')[0],
      starsInfor = document.getElementById('starsInfor'),
      stepsInfor = document.getElementById('stepsInfor'),
      showMin = document.getElementById('minute'),
      showSec = document.getElementById('second');

  let finialTxt,
      finialStar = "",
      starsNum = 3 - finishStars.length;

  let delayTime = [
    "delay",
    "delay-two",
    "delay-three"
  ];

  winInfor.style.display = "block";
  container.classList.add("bg-blur");

  for (let i=0;i<starsNum;i++) {
    finialStar += `<span class='fa fa-star fade-in ${delayTime[i]}'></span> ` ;
  }

  if(isWin === "true"){
      switch(starsNum) {
        case 0:
          finialTxt = "Congratulations!";
          break;
        case 1:
          finialTxt = "Well Done!";
          break;
        case 2:
          finialTxt = "Excellence!";
          break;
        case 3:
          finialTxt = "Brilliance!";
          break;
      }
      header.innerHTML = finialTxt;
      starsInfor.innerHTML = starsNum === 0 ? "You passed the game!" : "You get " + finialStar + " .";
  } else {
      header.innerHTML = "Sorry!";
      starsInfor.innerHTML = "You didn't pass the game!";
  }

  header.classList.add("bounce-in-down");

  stepsInfor.innerHTML = Math.floor(steps/2);
  showMin.innerHTML = parseInt(time/60);
  showSec.innerHTML = time%60;
}

function clock() {
  if (clockFlag)
    clearTimeout(clockFlag);

  clockFlag = setTimeout("clock()", 1000);

  if (time <= 30)  {
        if (time <= 26) {
          restTime.innerHTML = 30 - time;
        } else {
          restTime.classList.add('empersized');
          restTime.innerHTML = 30 - time;
        }
  }

  minutes.innerHTML = formatting(parseInt(time/60));
  seconds.innerHTML = formatting(time%60);

  time++;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 function main() {

   createNodes();

   eventsRegister();

   initCards();

 }
main();
