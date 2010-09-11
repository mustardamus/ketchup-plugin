$.fn.ketchup.add('required', {
  message: 'This field is required. Please enter $attr(title|a value).',
  test: function(element, value) {
    if(element.attr('type') == 'checkbox') {
      if(element.attr('checked') == true) return true;
      else return false;
    } else {
      if(value.length == 0) return false;
      else return true;
    }
  }
});

$.fn.ketchup.addMultiple([
  ['minlength', {
    message: 'This field must have a minimal length of $arg1.',
    test: function(element, value, minlength) {
      if(value.length < minlength) return false;
      else return true;
    }
  }],
  ['maxlength', {
    message: 'This field must have a maximal length of $arg1.',
    test: function(element, value, maxlength) {
      if(value.length > maxlength) return false;
      else return true;
    }
  }],
  ['rangelength', {
    message: 'This field must have a length between $arg1 and $arg2.',
    test: function(element, value, minlength, maxlength) {
      if(value.length >= minlength && value.length <= maxlength) return true;
      else return false;
    }
  }],
  ['min', {
    message: 'Must be at least $arg1.',
    test: function(element, value, min) {
      if(parseInt(value) < min) return false;
      else return true;
    }
  }],
  ['max', {
    message: 'Can not be greater than $arg1.',
    test: function(element, value, max) {
      if(parseInt(value) > max) return false;
      else return true;
    }
  }],
  ['range', {
    message: 'Must be between $arg1 and $arg2.',
    test: function(element, value, min, max) {
      if(parseInt(value) >= min && parseInt(value) <= max) return true;
      else return false;
    }
  }],
  ['number', {
    message: 'Must be a number.',
    test: function(element, value) {
      if(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)) return true;
      else return false;
    }
  }],
  ['digits', {
    message: 'Must be digits.',
    test: function(element, value) {
      if(/^\d+$/.test(value)) return true;
      else return false;
    }
  }],
  ['email', {
    message: 'Must be a valid E-Mail.',
    test: function(element, value) {
      if(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value)) return true;
      else return false;
    }
  }],
  ['url', {
    message: 'Must be a valid URL.',
    test: function(element, value) {
      if(/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value)) return true;
      else return false;
    }
  }],
  ['username', {
    message: 'Must be a valid username.',
    test: function(element, value) {
      if(/^([a-zA-Z])[a-zA-Z_-]*[\w_-]*[\S]$|^([a-zA-Z])[0-9_-]*[\S]$|^[a-zA-Z]*[\S]$/.test(value)) return true;
      else return false;
    }
  }],
  ['match', {
    message: 'Must match the field above.',
    test: function(element, value, match) {
      if($(match).val() != value) return false;
      else return true;
    }
  }],
  ['date', {
    message: 'Must be a valid date.',
    test: function(element, value) {
      if(!/Invalid|NaN/.test(new Date(value))) return true;
      else return false;
    }
  }],
  ['minselect', {
    message: 'Select at least $arg1 checkboxes.',
    test: function(element, value, min) {
      if($('input[name="'+element.attr('name')+'"]:checked').length >= min) return true;
      else return false;
    }
  }],
  ['maxselect', {
    message: 'Select not more than $arg1 checkboxes.',
    test: function(element, value, max) {
      if($('input[name="'+element.attr('name')+'"]:checked').length <= max) return true;
      else return false;
    }
  }],
  ['rangeselect', {
    message: 'Select between $arg1 and $arg2 checkboxes.',
    test: function(element, value, min, max) {
      var checked = $('input[name="'+element.attr('name')+'"]:checked');

      if(checked.length >= min && checked.length <= max) return true;
      else return false;
    }
  }]
]);

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


