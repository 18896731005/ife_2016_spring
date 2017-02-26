"use strict"
/*use ES5 defineProperty*/
function Observer_es5 (data) {
  //暂不考虑数组
  this.data = data;
  this.makeObserver(data);
}
Observer_es5.prototype.setterAndGetter = function (key, val) {
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
      val = newVal;
    }
  })
}
Observer_es5.prototype.makeObserver = function (obj) {
  let val;
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      val = obj[key];
      //深度遍历
      if(typeof val === 'object'){
        new Observer_es5(val);
      }
    }
    this.setterAndGetter(key, val);
  }
}

/* use ES6 proxy, ES6方法只适用于单层对象 */
function Observer_es6(data){
  for(let key in data){
    if(data.hasOwnProperty(key) && typeof data[key] === 'object'){
      Observer_es6(data[key]);
    }
  }

  return new Proxy(data, {
    get: function(target, key){
      if(key in target){
        console.log('你访问了' + key);
        return target[key];
      }else{
        throw new Error('key does not exist')
      }
    },
    set: function(target, key, newVal){
      console.log('你设置了' + key);
      console.log('新的' + key + '=' + newVal);
      target[key] = newVal;
    }
  })
}
