$(document).ready(function() {
  module('Plugin Tests');
  
  test('Returns a jQuery Object (is chainable)', function() {
    var body = $('body');
    
    equals(typeof body.ketchup().data('chainable', true), 'object', 'Is a Object');
    equals(body.data('chainable'), true, 'Body has "chainable" data.');
  });
  
  
  module('Internal Functions');
  
  test('Add Validations', function() {
    //added in jquery.ketchup.validations.js
    equals($.ketchup.validations.required.message, 'This field is required.', 'Message of the required validation');
    equals(typeof $.ketchup.validations.minlength.func, 'function', 'Minlength validation has a function');
  });
  
  test('Add Validation Messages', function() {
    $.ketchup.message('required', 'overwritten');
    equals($.ketchup.validations.required.message, 'overwritten', 'Message function has overwritten required message');
    
    $.ketchup.messages({
      required : 'overwritten again',
      minlength: 'minlength {arg1}'
    });
    equals($.ketchup.validations.required.message, 'overwritten again', 'Messages function has overwritten required message');
    equals($.ketchup.validations.minlength.message, 'minlength {arg1}', 'Messages function has overwritten minlength message');
  });
  
  test('Extract validations from string', function() {
    var vals = $.ketchup.extractValidations('before validate(required, minlength(3), not(existent)) after', 'validate');
    
    equals(vals.length, 2, 'Two existing validations are extracted');
    equals(vals[0].name, 'required', 'Name of validation one is required');
    equals(typeof vals[0].func, 'function', 'Validation has function');
    equals(vals[1].arguments[0], 3, 'Argument 1 of validation two is 3');
    equals(vals[1].message, 'minlength 3', 'Validation two has correct message with arguments');
  });
  
  test('Extract events from string', function() {
    equals($.ketchup.extractEvents('before validate(required) on(keyup blur) after', 'on'), 'keyup blur', 'Two events are extratced');
  });
});