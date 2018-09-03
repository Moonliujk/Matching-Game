function createCards () {
  var num = 0;
  for(let i=0;i<5;i++){
    if(i%2 == 0){
      num++;
    }
    cardsArray[i] = new Cards(num-1);
  }
}
