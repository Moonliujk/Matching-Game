/*
 * Create a list that holds all of your cards
 */

/*
  * TODO:

  */
const CARDSNUM = 16;    //define the number of cards
const source = [
  "chirsmasTree.jpg",
  "gre.png",
  "kanshan.png",
  "papa.png",
  "pizza.png",
  "polarBeer.png",
  "reindeer.jpg",
  "sushi.png"
];

let cardsArray = new Array(),
    matchQueue = new Array(),
    steps = 0,
    lastEle,
    clockFlag,  // 计时器终止条件
    matchNum = 0,
    time = 0;


let $moves = $('.moves');

// define timer which includes time relative params
let timer = {
  time: 0,
  minutes: $('.minutes'),
  seconds: $('.seconds'),
}

let $winInfor = $('.win');
let $renewInfor = $('.renew');
let $stars = $('.stars');
let $starsEle = $('.stars span');
let $container = $('.container');
let $countCircle = $('.count-circle');
let $startInterface = $(".start-interface");
let $countDown = $('.count-down');
let $inputs = $('input');
let $restTime = $('#rest-time');
let $modeChooseInfor = $('.mode-choose');

//create 16 children nodes into the <ul class="deck">
function createNodes() {
  let content = '';
  let $deck = $('.deck');

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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//To create some eventsListener on some controller.
function eventsRegister() {
  let $restartIcon = $('.restart-icon'),
      $restartButtons = $('.restart'),
      $continueButton = $('.continue'),
      $backtoButton = $('.backto'),
      $startButton = $('#start'),
      $cardsEle = $('.flipper');

  $startButton.click(chooseModeDlg);
  $backtoButton.click(backToMain);
  $restartIcon.click(restartDlg);
  $continueButton.click(continueToPlay);

  //const NUM_CARDS = cardsEle.length;
  $restartButtons.each(function() {
    $(this).click(backtoStart)
  });

  // to bind each cards with its function through the 'data-id' property eg: $cardsEle[1] => the function Cards[1]
  $cardsEle.each(function(index) {
    $(this).attr("data-id", index).click(cardsClickEvent)
  })

}

// The start interface's animation & events
function chooseModeDlg() {
  //to judge whether choose the game level
  for (let i=0;i<$inputs.length;i++) {
    if ($inputs.get(i).checked) {
      return startGame();
    }
  }

  $modeChooseInfor.css("display", "block");
  $('.mode-choose section').addClass('flipInX');

  return false;
}

function startGame() {
  //To configure the game level depending on the player' option.
  for (let i=0; i<$inputs.length; i++) {
    if ($inputs.get(i).checked) {
      if($inputs.get(i).value === "hard") {
        showCountDown();
      }
    }
  }

  $startInterface.css("display", "none");
  $container.css("display", "flex");

  // 开始计时
  clock();
}

//to show the count-down timer
function showCountDown() {
  $countDown.css("display", "block");
  $countDown.addClass("bounce-in-left");
  $countCircle.addClass('count-down-animation');
  $countCircle.addClass('running');

  setTimeout("countDownFinish()", 30000);
}

function countDownFinish() {
  if(timer.time === 30 && matchNum !== 8)  {
      clearTimeout(clockFlag);
      $winInfor.css ("display", "block");
      winAnimation("false");
  }
}

//The' backto' dialog show & hidden animation.
function backToMain() {
  $('.mode-choose section').removeClass('flipInX');
  $('.mode-choose section').addClass('flipOutX');
  $('.mode-choose section')[0].addEventListener('animationend', delBacktoAnimation, false);
}

function delBacktoAnimation() {
  $modeChooseInfor.css('display', 'none');
  this.classList.remove('flipOutX');
  this.removeEventListener('animationend', delBacktoAnimation, false);
}

function restartDlg() {
  $countCircle.removeClass('running');
  $countCircle.addClass('paused');

  $renewInfor.css("display", "block");
  $container.addClass("bg-blur");

  clearTimeout(clockFlag);
}

function continueToPlay() {
  clock();

  $countCircle.removeClass('paused');
  $countCircle.addClass('running');

  $renewInfor.css("display", "none");
  $container.removeClass("bg-blur");
}

function backtoStart() {
  $countCircle.removeClass('count-down-animation paused');
  $restTime.removeClass('empersized');

  $renewInfor.css("display", "none");
  $winInfor.css("display", "none");
  $container.removeClass("bg-blur");

  $container.css('display', 'none');
  startInterface.css('display', 'block');

  for (let i=0;i<$inputs.length;i++) {
    if ($inputs.get(i).checked) {
      $inputs.get(i).checked = false;
    }
  }

  // 初始化卡片
  initCards();
}

/**
 * [初始化游戏参数：去除卡片的类名（open、match）]
 */
function initCards() {
  let $cardsEle = $('.flipper');

  clearTimeout(clockFlag);

  // 移除卡片类名：match、open
  $cardsEle.removeClass('match open');

  // 计时器归零
  timer.minutes.text('00');
  timer.seconds.text('00');
  $moves.text("0");
  steps = 0;
  matchNum = 0;
  timer.time = 0;

  // 匹配队列归零
  matchQueue = new Array();
  $countDown.css("display", "none");
  $countCircle.removeClass('count-down-animation running');

  createCards();
  shuffle();

  const NUM_STARTS = $starsEle.length;
  const NUM_CARDS = $cardsEle.length;

  // 初始化星星
  $starsEle.attr('class', 'fa fa-star')
  //重新配置卡片的图片

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
  $moves.text(Math.floor(steps/2));
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
      $('.stars span:nth-child(3)').attr('class', styleTxt);
      break;
    case (2):
      $('.stars span:nth-child(2)').attr('class', styleTxt);
      break;
    case (3):
      $('.stars span:nth-child(1)').attr('class', styleTxt);
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
        $countCircle.removeClass('count-down-animation paused');
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

// 显示通关信息
function winAnimation(isWin) {
  let $finishStars = $('.fa-star-o'),
      $header = $('.win .header'),
      $starsInfor = $('#starsInfor'),
      $stepsInfor = $('#stepsInfor'),
      $showMin = $('#minute'),
      $showSec = $('#second');

  let finialTxt,
      finialStar = "",
      starsNum = 3 - $finishStars.length;

  let delayTime = [
    "delay",
    "delay-two",
    "delay-three"
  ];

  $winInfor.css("display", "block");
  $container.addClass("bg-blur");

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
      $header.text(finialTxt);
      $starsInfor[0].innerHTML = starsNum === 0 ? "You passed the game!" : "You get " + finialStar + " .";
  } else {
      $header.text("Sorry!");
      $starsInfor.text("You didn't pass the game!");
  }

  $header.addClass("bounce-in-down");

  $stepsInfor.text(Math.floor(steps/2));
  $showMin.text(parseInt(timer.time/60));
  $showSec.text(timer.time%60);
}

function clock() {
  let time = timer.time;

  if (clockFlag)
    clearTimeout(clockFlag);

  clockFlag = setTimeout(() => {
    clock()
  }, 1000);

  if (time <= 30)  {
        if (time <= 26) {
        } else {
          $restTime.addClass('empersized');
        }
        $restTime.text(30 - time);
  }

  timer.minutes.text( formatting( parseInt(time/60) ) );
  timer.seconds.text( formatting( time%60 ) );

  timer.time++;
}

//to format the output  eg: '0:0' => '00:09'
function formatting(time) {
  return ( time>=0 && time<=9 ) ? "0" + time : time;
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
