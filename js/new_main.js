$.ketchup

.validation('required', 'This field is required', function(form, element, value) {
  if(value.length != 0) {
    return true;
  } else {
    return false;
  }
})

.validation('min', 'Can not be lower than {arg1}', function(form, element, value, min) {
  if(value.length >= min) {
    return true;
  } else {
    return false;
  }
})

.validation('words', function(form, element, value, word1, word2) {
  if(value == word1 || value == word2) {
    return true;
  } else {
    return false;
  }
})

.message('words', 'Must be either {arg1} or {arg2}.')

//.createErrorContainer(function() {
//  console.log('overwritten');
//});

//.addErrorMessage(function(form, el, container, message) {
//  container.html(message)
//})

//.showErrorContainer(function(form, el, container) {
//  container.fadeIn();
//})

//.hideErrorContainer(function(form, el, container) {
//  container.fadeOut();
//})


$(document).ready(function() {
  $('form').ketchup({
    indicator: 'validate',
    attribute: 'rel'//,
    //validateElements: '.validate'
  //}, {
  //  'input': ['required,min(5),words(one,two)', 'click'],
  //  'select': 'min(3)'                     //wenn nicht über attr setzen
  });
});