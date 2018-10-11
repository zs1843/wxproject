const app = getApp();

Page({
  data: {
    hidden: false,
    userInfo: {},
    boardArr: [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ],
  },
  onReady: function() {
   this.init();
  },
  // 初始化
  init: function(){
    this.setData({
      hidden: true,
    });
    app.getUserInfo(res => {
      this.setData({
        userInfo: res
      })
    });
    // 填充两个格子
    this.fillLocation();
    this.fillLocation();
  },
  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function (ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

  },
  touchMove: function (ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function () {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

      if (Math.max(absdisX, absdisY) > 10) { // 确定是否在滑动
        var direction = absdisX > absdisY ? (disX < 0 ? 'right' : 'left') : (disY < 0 ? 'down' : 'up');  // 确定移动方向
        var data = this.move(direction);
      }
  },
  // 随机位置
  fillLocation: function(){
    const [x, y] = [this.randomNum(0,3), this.randomNum(0,3)];
    this.data.boardArr.map((row,i)=>{
      if(x === i){
        row.map((col, j)=>{
          if(y === j && !col){
            this.fillCellValue(i, j)
          }
        })
      }
    })
  },
  // 范围的随机数
  randomNum: function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  // 一个格子的值
  fillCellValue: function(i, j, num){
      var changedData = {};
      changedData['boardArr[' + i + '][' + j + ']'] = Math.random() > 0.7 ? 2 : 4;
      this.setData(changedData);
  },
  // 移动
  move: function (dir) {
    var curList = this.rebuildArr(dir);

    var list = this.combine(curList);
    var result = [[], [], [], []];

    for (var i = 0; i < 4; i++){
      for (var j = 0; j < 4; j++) {
        switch (dir) {
          case 'up':
            result[i][j] = list[j][i];
            break;
          case 'right':
            result[i][j] = list[i][4 - 1 - j];
            break;
          case 'down':
            result[i][j] = list[j][4 - 1 - i];
            break;
          case 'left':
            result[i][j] = list[i][j];
            break;
        }
      }
    }
      console.log(result)
    // 更新一下整个数组 
    this.setData({
      boardArr: result,
    });

    // 再随机填充一个格子
    this.fillLocation();
  },
  canMoveDown: function () {

  },
  canMoveUp: function (i) {
  },
  canMoveLeft: function () {

  },
  canMoveRight: function () {

  },
  // 改变方向时重组数组，改变下标
  rebuildArr: function (dir){
    var list = [[], [], [], []];
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++) {
        switch (dir) {
          case 'up':
            list[i].push(this.data.boardArr[j][i]);
            break;
          case 'right':
            list[i].push(this.data.boardArr[i][4 - 1 - j]);
            break;
          case 'down':
            list[i].push(this.data.boardArr[4 - 1 - j][i]);
            break;
          case 'left':
            list[i].push(this.data.boardArr[i][j]);
            break;
        }
      }
    return list;
  },
  // 将不为空的值提前，数字靠边  [2,null,null,2] -->  [2,2,null,null]
  changeItem(item) {
    var cnt = 0;
    for (var i = 0; i < item.length; i++){
      if (item[i]){
        item[cnt++] = item[i];
      }
    }
    for (var j = cnt; j < item.length; j++){
      item[j] = null;
    }
    return item;
  },
  // 合并
  combine(list) {
    if(list){
    // 不相同的靠边
    for (var i = 0; i < list.length; i++){
      list[i] = this.changeItem(list[i]);
    }
    for (var i = 0; i < 4; i++) {
      for (var j = 1; j < 4; j++) {
        if (list[i][j - 1] === list[i][j] && list[i][j]) {
          list[i][j - 1] *=2;
          list[i][j] = null;
          this.fillCellValue(i, j)
        }
      }
    }
    // 不相同的再次靠边
    for (var i = 0; i < list.length; i++){
      list[i] = this.changeItem(list[i]);
    }

    return list;
    }
  },

  // over
  gameOver: function(){
    if(this.isGameOver){
      this.setData({

      })
    }
  },
  isGameOver: function(){
    return !this.availableCellLength && !this.checkIfHasEqual;
  },
  checkIfHasEqual: function(){
    const {boardArr} = this.data;
    for (let i = 0; i < boardArr.length; i++) {
      for (let j = 0; j < boardArr[i]; j++) {
        if (boardArr[i][j]=== boardArr[i-1][j] || boardArr[i][j] === boardArr[i][j-1]){
          return true;
        }
      }
    }
    return false;
  },
  availableCellLength: function(){
    const { boardArr } = this.data;
    let empty = [];
    for (let i = 0; i < boardArr.length; i++) {
      for (let j = 0; j < boardArr[i]; j++) {
        if(!boardArr[i][j]){
          empty.push({
            x: i,
            y: j
          })
        }
      }
    }
    return empty.length;
  }
})