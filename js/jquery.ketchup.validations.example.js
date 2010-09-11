$.fn.ketchup.add('tomato', {
  message: 'I only like tomato!',
  test: function(element, value) {
    if(value == 'tomato') return true;
    else return false;
  }
});

$.fn.ketchup.add('either', {
  message: 'Must be either $arg1 or $arg2.',
  test: function(element, value, word1, word2) {
    var valueL = value.toLowerCase();

    if(valueL == word1.toLowerCase() || valueL == word2.toLowerCase()) return true;
    else return false;
  }
});