jQuery.ketchup

.validation('required', 'This field is required.', function(form, el, value) {
  if(value.length) {
    return true;
  } else {
    return false;
  }
})

.validation('minlength', 'This field must have a minimal length of {arg1} characters.', function(form, el, value, min) {
  if(value.length >= +min) {
    return true;
  } else {
    return false;
  }
})

.validation('maxlength', 'This field can not be longer than {arg1} characters.', function(form, el, value, max) {
  if(value.length <= +max) {
    return true;
  } else {
    return false;
  }
})

.validation('email', 'Must be a valid email.', function(form, el, value) {
  return this.isEmail(value);
})

.validation('username', 'Must be a valid username.', function(form, el, value) {
  return this.isUsername(value);
});