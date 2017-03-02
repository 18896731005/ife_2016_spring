function Vue(obj){
  this.el = obj.el;
  this.data = obj.data;

  this.updateView(this.render(this.el));
}

Vue.prototype.render = function(tpl){
  var tokens = this.tokenize(document.querySelector(tpl).innerHTML);
  var ret = [];
  tokens.forEach(function(token){
    if(token.type === 'text'){
      ret.push('"' + token.expr + '"');
    }else{
      ret.push(Util.addPerfix(token.expr));
    }
  })

  return new Function("data", "return " + ret.join('+'));
}

Vue.prototype.tokenize = function(str){
  var openTag = '{{',
      closeTag = '}}',
      ret = [];
  do {
    var index = str.indexOf(openTag);
    index = index === -1 ? str.length : index;

    var value = str.slice(0, index).replace(/\s+/g, '');
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

Vue.prototype.updateView = function(fn){
  document.querySelector(this.el).innerHTML = fn(this.data);
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
