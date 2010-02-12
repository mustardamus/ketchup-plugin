$.fn.ketchup.validation('required', function(element, value) {
  if(element.attr('type') == 'checkbox') {
    if(element.attr('checked') == true) return true;
    else return false;
  } else {
    if(value.length == 0) return false;
    else return true;
  }
});


$.fn.ketchup.validation('minlength', function(element, value, minlength) {
  if(value.length < minlength) return false;
  else return true;
});

$.fn.ketchup.validation('maxlength', function(element, value, maxlength) {
  if(value.length > maxlength) return false;
  else return true;
});

$.fn.ketchup.validation('rangelength', function(element, value, minlength, maxlength) {
  if(value.length >= minlength && value.length <= maxlength) return true;
  else return false;
});


$.fn.ketchup.validation('min', function(element, value, min) {
  if(parseInt(value) < min) return false;
  else return true;
});

$.fn.ketchup.validation('max', function(element, value, max) {
  if(parseInt(value) > max) return false;
  else return true;
});

$.fn.ketchup.validation('range', function(element, value, min, max) {
  if(parseInt(value) >= min && parseInt(value) <= max) return true;
  else return false;
});


$.fn.ketchup.validation('number', function(element, value) {
  if(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)) return true;
  else return false;
});

$.fn.ketchup.validation('digits', function(element, value) {
  if(/^\d+$/.test(value)) return true;
  else return false;
});


$.fn.ketchup.validation('email', function(element, value) {
  if(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value)) return true;
  else return false;
});


$.fn.ketchup.validation('url', function(element, value) {
  if(/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value)) return true;
  else return false;
});


$.fn.ketchup.validation('username', function(element, value) {
  if(/^([a-zA-Z])[a-zA-Z_-]*[\w_-]*[\S]$|^([a-zA-Z])[0-9_-]*[\S]$|^[a-zA-Z]*[\S]$/.test(value)) return true;
  else return false;
});


$.fn.ketchup.validation('match', function(element, value, match) {
  if($(match).val() != value) return false;
  else return true;
});


$.fn.ketchup.validation('date', function(element, value) {
  if(!/Invalid|NaN/.test(new Date(value))) return true;
  else return false;
})


function watchSelect(type) {
  $('input['+$.fn.ketchup.defaults.validationAttribute+'*="'+type+'"]').each(function() {
    var el = $(this);

    $('input[name="'+el.attr('name')+'"]').each(function() {
      var al = $(this);
      if(al.attr($.fn.ketchup.defaults.validationAttribute).indexOf(type) == -1) al.blur(function() { el.blur(); });
    });
  });
}

$(document).ready(function() {
  watchSelect('minselect');
  watchSelect('maxselect');
  watchSelect('rangeselect');
});

$.fn.ketchup.validation('minselect', function(element, value, min) {
  if($('input[name="'+element.attr('name')+'"]:checked').length >= min) return true;
  else return false;
});

$.fn.ketchup.validation('maxselect', function(element, value, max) {
  if($('input[name="'+element.attr('name')+'"]:checked').length <= max) return true;
  else return false;
});

$.fn.ketchup.validation('rangeselect', function(element, value, min, max) {
  var checked = $('input[name="'+element.attr('name')+'"]:checked');
  
  if(checked.length >= min && checked.length <= max) return true;
  else return false;
});