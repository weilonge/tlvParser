/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

function toHexString(v){
  var s = v.toString(16);
  return s.length === 1 ? '0' + s : s;
}

function showTlv(tlvData, tab) {
  if(!tab) tab = 0;
  var tabStr = '';
  for(var i = 0; i < tab; i++){
    tabStr = tabStr + ' ';
  }
  console.log(tabStr +
    'T:(0x' + toHexString(tlvData.T) + ' / ' + tlvData.T + ')' +
    ' L:' + tlvData.L);
  if( Object.prototype.toString.call( tlvData.V ) === '[object Array]' ) {
    for(var i = 0; i < tlvData.V.length; i++){
      if(isNaN(tlvData.V[i])){
        showTlv(tlvData.V[i], tab+2);
      } else {
        console.log(tabStr + '  | [' + String('00' + i).slice(-2) + '] 0x' + toHexString(tlvData.V[i]));
      }
    }
  } else {
    console.log(tabStr + 'V:' + JSON.stringify(tlvData.V));
  }
}

function parseTlv(stkCmd) {
  var ret, nextV = stkCmd.slice(2);

  if(stkCmd.length < 2 ){
    return stkCmd;
  } else if(nextV.length < stkCmd[1] ){
    return stkCmd;
  } else if(nextV.length === stkCmd[1] ){
    ret = {};
    ret.T = stkCmd[0];
    ret.L = stkCmd[1];
    ret.V = parseTlv(nextV);
    return ret;
  } else {
    ret = [];
    for(var i = 0, length = 0; i < nextV.length; i = i + length + 2){
      length = stkCmd[i+1];
      var ccc = stkCmd.slice(i, i+length+2);
      ret.push(parseTlv(ccc));      
    }
    return ret;
  }
}

function tlvStrToArray(stkStrCmd) {
  var arrayStrCmd = [];
  for(var i = 0; i < stkStrCmd.length; i = i + 2){
    var tmp = parseInt('' + stkStrCmd[i] + stkStrCmd[i+1], 16);
    arrayStrCmd.push(tmp);
  }
  return arrayStrCmd;
}

(function (){
  if(process.argv.length === 3 ){
    var tlvSet = tlvStrToArray(process.argv[2]);
    var parsed = parseTlv(tlvSet)
    showTlv(parsed);
  } else {
    console.log('arguments incorrect');
  }
})();

