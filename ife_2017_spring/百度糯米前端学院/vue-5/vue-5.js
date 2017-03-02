function Vue(obj){
  this.el = obj.el;
  this.data = obj.data;
  //View
  var view = new View(this.data, this.el);
  view.updateView(view.render(view.tpl));

  //为数据添加setter，getter
  new Observer(this.data);
  //watcher
  new Watcher(this.data,"user", view);
}

function View(data, el){
  this.el = el;
  this.data = data,
  this.tpl = document.querySelector(el).innerHTML;
}

View.prototype.render = function(tpl){
  var tokens = this.tokenize(tpl);
  var ret = [];
  tokens.forEach(function(token){
    if(token.type === 'text'){
      ret.push('"' + Util.quote(token.expr) + '"');
    }else{
      ret.push(Util.addPerfix(token.expr));
    }
  })

  return new Function("data", "return " + ret.join('+'));
}

View.prototype.tokenize = function(str){
  var openTag = '{{',
      closeTag = '}}',
      ret = [];
  do {
    var index = str.indexOf(openTag);
    index = index === -1 ? str.length : index;

    var value = str.slice(0, index).replace(/\n/g, '');
    ret.push({
      expr: value,
      type: 'text'
    });

    str = str.slice(index + openTag.length);
    if(str){
      index = str.indexOf(closeTag);
      var value = str.slice(0, index).trim();

      ret.push({
        expr: value,
        type: 'js'
      })

      str = str.slice(index + closeTag.length);
    }
  } while (str.length);

  return ret;
}

View.prototype.updateView = function(fn){
  document.querySelector(this.el).innerHTML = fn(this.data);
}

/*use ES5 defineProperty*/
function Observer (data) {
  this.data = data;
  this.dep = new Dep();

  if(Array.isArray(data)){
    //暂不考虑数组
  }else{
    this.makeObserver(data);
  }
}

Observer.prototype.setterAndGetter = function (key, val) {
  let dep = new Dep();
  if(typeof val === 'object'){
    var childOb = new Observer(val);
  }

  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function(){
      console.log('你访问了' + key);

      if(Dep.target){
        dep.depend();
        if(childOb){
          childOb.dep.depend();
        }
      }
      return val;
    },
    set: function(newVal){
      console.log('你设置了' + key);
      console.log('新的' + key + '=' + newVal);

      if(newVal === val) return
      val = newVal;

      if(typeof val === 'object'){
        childOb = new Observer(newVal);
      }

      dep.notify();
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
  //this.eventsBus.on(attr, callback);
  for(let key in this.data){
    if(this.data.hasOwnProperty(key) && typeof this.data[key] === 'object'){
      this.data[key].__ob__.eventsBus.on(attr, callback);
    }
  }
}

//观察者
function Dep(){
  this.subs = [];
}
Dep.target = null;

Dep.prototype.depend = function(){
  Dep.target.addDep(this);
}

Dep.prototype.addSub = function(sub){
  this.subs.push(sub);
}
Dep.prototype.notify = function(){
  for(let i = 0, len = this.subs.length; i < len; i++ ){
    this.subs[i].update();
  }
}


//watcher
function Watcher(value, attr, view){
  this.value = value;
  this.attr = attr;
  this.view = view;
  this.get();
}

Watcher.prototype.beforeGet = function(){
  Dep.target = this;
}

Watcher.prototype.get = function(){
  this.beforeGet();

  let val = this.value[this.attr];

  if(typeof val === 'object'){
    for(let childAttr in val){
      new Watcher(val[childAttr], childAttr, this.view);
    }
  }
}

Watcher.prototype.addDep = function(dep){
  dep.addSub(this);
}
Watcher.prototype.update = function(){
  this.view.updateView(this.view.render(this.view.tpl));
}

var app = new Vue({
  el: '#app',
  data: {
    user: {
      name: 'liujianhuan',
      age: 24
    }
  }
})

document.getElementById('nameInput').onchange = function(){
  app.data.user.name = this.value;
}
document.getElementById('ageInput').onchange = function(){
  app.data.user.age = this.value;
}
