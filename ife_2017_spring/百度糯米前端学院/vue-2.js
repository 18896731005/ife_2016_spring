"use strict"
/*use ES5 defineProperty*/
function Observer (data) {
  //暂不考虑数组
  this.data = data;
  this.makeObserver(data);
  this.eventsBus = new Event();
}
Observer.prototype.setterAndGetter = function (key, val) {
  let _this = this;
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function(){
      console.log('你访问了' + key);
      return val;
    },
    set: function(newVal){
      console.log('你设置了' + key);
      console.log('新的' + key + '=' + newVal);
      //出发$watch函数
      _this.eventsBus.emit(key, val, newVal);
      val = newVal;
      //如果newval是对象的话
      if(typeof newVal === 'object'){
        new Observer(val);
      }
    }
  })
}
Observer.prototype.makeObserver = function (obj) {
  let val;
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      val = obj[key];
      //深度遍历
      if(typeof val === 'object'){
        new Observer(val);
      }
    }
    this.setterAndGetter(key, val);
  }
}
Observer.prototype.$watch = function(attr, callback){
  this.eventsBus.on(attr, callback);
}

//实现一个事件
function Event(){
  this.events = {};
}
Event.prototype.on = function(attr, callback){
  if(this.events[attr]){
    this.events[attr].push(callback);
  }else{
    this.events[attr] = [callback];
  }
}
Event.prototype.off = function(attr){
  for(let key in this.events){
    if(this.events.hasOwnProperty(key) && key === attr){
      delete this.events[key];
    }
  }
}
Event.prototype.emit = function(attr, ...arg){
  this.events[attr] && this.events[attr].forEach(function(item){
    item(...arg);
  })
}

//测试
let app = new Observer({
        name: 'youngwind',
        age: 25
});

app.$watch('age', function(oldVal, newVal) {
        console.log(`我的年纪变了，原来是：${oldVal}, 现在已经是：${newVal}岁了`);
});

app.$watch('age', function(oldVal, newVal) {
        console.log(`我的年纪变了，真的变成${newVal}岁了诶`);
});

app.data.age = 100;
