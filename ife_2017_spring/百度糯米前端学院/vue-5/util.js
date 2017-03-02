var Util = function(){
  var rident = /[$a-zA-Z_][$a-zA-Z0-9_]*/g;
  var rproperty = /\.\s*[\w\.\$]+/g;
  var number = 1;
  var rfill = /\?\?\d+/g;
  var stringPool = {};

  function dig(a){
    var key = '??' + number++;
    stringPool[key] = a;
    return key;
  }

  function fill(a){
    return stringPool[a];
  }

  function addPerfix(str){
    var js = str.replace(rproperty, dig);
    js = js.replace(rident, function(a){
      return 'data.' + a;
    })
    return js.replace(rfill, fill);
  }

  function quote(str){
    return str.replace(/"/g, '\\"');
  }

  return {
    addPerfix: addPerfix,
    quote: quote
  }
}()
