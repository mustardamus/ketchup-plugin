$.fn.ketchup.messages = {
  'tomato': 'I only like tomato!',
  'either': 'Must be either $arg1 or $arg2.'
}

$.fn.ketchup.validation('tomato', function(element, value) {
  if(value == 'tomato') return true;
  else return false;
});

$.fn.ketchup.validation('either', function(element, value, word1, word2) {
  var valueL = value.toLowerCase();
  
  if(valueL == word1.toLowerCase() || valueL == word2.toLowerCase()) return true;
  else return false;
});