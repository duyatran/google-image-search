var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var base = alphabet.length;
exports.encode = function(num) {
  var temp = '';
  var result = [];
  while (num > 0) {
    remainder = num % base;
    temp = alphabet[remainder];
    result.push(temp);
    num  = Math.floor(num / base);
  }
  return result.reverse().join();
}

exports.decode = function (num) {
  var result = 0;
  for (var i = 0; i < num.length; i++) {
    result = result * base + alphabet.indexOf(num[i]);
  }
  return result;
}
