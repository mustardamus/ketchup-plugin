jQuery.ketchup

.validation('required', 'This field is required.', function(form, el, value) {
  var type = el.attr('type').toLowerCase();
  
  if(type == 'checkbox' || type == 'radio') {
    return (el.attr('checked') == true);
  } else {
    return (value.length != 0);
  }
})

.validation('minlength', 'This field must have a minimal length of {arg1}.', function(form, el, value, min) {
  return (value.length >= +min);
})

.validation('maxlength', 'This field must have a maximal length of {arg1}.', function(form, el, value, max) {
  return (value.length <= +max);
})

.validation('rangelength', 'This field must have a length between {arg1} and {arg2}.', function(form, el, value, min, max) {
  return (value.length >= min && value.length <= max);
})

.validation('min', 'Must be at least {arg1}.', function(form, el, value, min) {
  return (this.isNumber(value) && +value >= +min);
})

.validation('max', 'Can not be greater than {arg1}.', function(form, el, value, max) {
  return (this.isNumber(value) && +value <= +max);
})

.validation('range', 'Must be between {arg1} and {arg2}.', function(form, el, value, min, max) {
  return (this.isNumber(value) && +value >= +min && +value <= +max);
})

.validation('number', 'Must be a number.', function(form, el, value) {
  return this.isNumber(value);
})

.validation('digits', 'Must be digits.', function(form, el, value) {
  return /^\d+$/.test(value);
})

.validation('email', 'Must be a valid E-Mail.', function(form, el, value) {
  return this.isEmail(value);
})

.validation('url', 'Must be a valid URL.', function(form, el, value) {
  return this.isUrl(value);
})

.validation('username', 'Must be a valid username.', function(form, el, value) {
  return this.isUsername(value);
})

.validation('match', 'Must be {arg1}.', function(form, el, value, word) {
  return (el.val() == word);
})

.validation('contain', 'Must contain {arg1}', function(form, el, value, word) {
  return this.contains(value, word);
})

.validation('date', 'Must be a valid date.', function(form, el, value) {
  return this.isDate(value);
})

.validation('minselect', 'Select at least {arg1} checkboxes.', function(form, el, value, min) {
  return (min <= this.inputsWithName(form, el).filter(':checked').length);
}, function(form, el) {
  this.bindBrothers(form, el);
})

.validation('maxselect', 'Select not more than {arg1} checkboxes.', function(form, el, value, max) {
  return (max >= this.inputsWithName(form, el).filter(':checked').length);
}, function(form, el) {
  this.bindBrothers(form, el);
})

.validation('rangeselect', 'Select between {arg1} and {arg2} checkboxes.', function(form, el, value, min, max) {
  var checked = this.inputsWithName(form, el).filter(':checked').length;
  
  return (min <= checked && max >= checked);
}, function(form, el) {
  this.bindBrothers(form, el);
});