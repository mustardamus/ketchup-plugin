jQuery Ketchup Plugin - Tasty Form Validation
=============================================

> This is still in development. Anyway, feel free to test it and tell me what you think at twitter `@mustardamus`
> or `@usejquery`. This doc has live demos in `docs/index.html` Have fun!

Ketchup is a small (xxx minified) jQuery Plugin that helps you to validate your forms.
Out of the box it has 18 basic validations and a bubble like style. But truly this
Plugin wants to be hacked to fit your needs. Easily write your own validations and overwrite/extend
the default behaviour. Bubbles are not for everyone...


Default Behavior
----------------

If you like the style of the bubbles and all validations you need are already included
you can get this Plugin up and running like so:

### Your HTML Header

Include the default stylesheet (located in `./css/` in this package) and the bundled and minified Plugin
along with the latest jQuery version in your HTML header.

    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>Yammie</title>

        <link rel="stylesheet" type="text/css" media="screen" href="css/jquery.ketchup.css" />

        <script type="text/javascript" src="js/jquery-1.4.4.min.js"></script>
        <script type="text/javascript" src="js/jquery.ketchup.all.min.js"></script>
      </head>

      <body>
        ... form stuff ...

### Your HTML

By default Ketchup checks the `data-validate` attribute of form fields if it can find matching
validations. The default indicator for validations is `validate()`, all validations
go in there and are separated by comma. Validations can have arguments, also separated by comma.

    <form id="default-behavior" action="index.html">
      <ul>
        <li>
          <label for="db-mail">E-Mail</label>
          <input type="text" id="db-mail" data-validate="validate(required, email)" />
        </li>
        <li>
          <label for="db-username">Username</label>
          <input type="text" id="db-username" data-validate="validate(required, username, minlength(3))" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript

Just call `ketchup()` on your form, voilà.

    $('#default-behavior').ketchup();


Declare fields to validate in the call
--------------------------------------

The last version of Ketchup checked the `class` attribute for validations... which was not everyones taste
because `class` should be used for defining CSS classes. In HTML5 we have the `data-` attributes for the rescue
to set custom data.

However, if you still want to separate the validations declarations from your markup you can do so
by passing an object with jQuery selectors as keys and validations as values to Ketchup.

### Your HTML

Note that `required` is not a validation declaration but an actual class name. We use that to
select the fields to validate.

    <form id="fields-in-call" action="index.html">
      <ul>
        <li>
          <label for="fic-email">E-Mail</label>
          <input type="text" id="fic-email" class="required" />
        </li>
        <li>
          <label for="fic-username">Username</label>
          <input type="text" id="fic-username" class="required" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript

Right after the options (empty here `{}`) we pass in an object. Use the key to declare the jQuery
selector on which fields the validations in the value are processed.
Validations declared like this don't need the `validate()` indicator.

    $('#fields-in-call').ketchup({}, {
      '.required'    : 'required',    //all fields in the form with the class 'required'
      '#fic-username': 'minlength(3)' //one field in the form with the id 'fic-username'
    });
    

Validate on different events
----------------------------

By default Ketchup listens to the `blur` event on form fields. You can overwrite that behaviour
for every field in the options, and you can overwrite it separately for a single field.

### Your HTML

In the `data-validate` attribute you can have a `on()` indicator. Events go in there and are separated by a space. These
are strings jQuery's `bind()` accepts.

    <form id="validation-events" action="index.html">
      <ul>
        <li>
          <label for="ve-username">Username</label>
          <input type="text" id="ve-username" data-validate="validate(required, minlength(3)) on(keyup focus)" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $('#validation-events').ketchup({
      validateEvents: 'dblclick'
    });

    /*if you set the fields to validate in the call
      you  simply pass  in a array as value.  First
      argument is  the validations string  and  the
      second is the events string. Like so:

    $('#validation-events').ketchup({}, {
      '#ve-username': ['required, minlength(3)', 'keyup focus']
    });*/


Included Validations
--------------------

 * `required`              - The field is required.
 * `minlength(min)`        - The field must have a minimal length of `min` characters.
 * `maxlength(max)`        - The field must have a maximal length of `max` characters.
 * `rangelength(min, max)` - The field must have a length between `min` and `max` characters.
 * `min(min)`              - The field must have a minimal number of `min`.
 * `max(max)`              - The field must have a maximal number of `max`.
 * `range(min, max)`       - The field must have a number between `min` and `max`.
 * `number`                - The field must be a number.
 * `digits`                - The field must be a digit (full number).
 * `email`                 - The field must be a valid email.
 * `url`                   - The field must be a valid URL.
 * `username`              - The field must be a valid username.
 * `match(word)`           - The field must match the value `word`.
 * `contain(word)`         - The field must contain `word`.
 * `date`                  - The field must be a valid date.
 * `minselect(min)`        - At least `min` checkboxes with the same name must be selected.
 * `maxselect(max)`        - No more than `max` checkboxes with the same name must be selected.
 * `rangeselect(min, max)` - Between `min` and `max` checkboxes with the same name must be selected.


Write your own validations
--------------------------

You can write your own validation functions for Ketchup. A validation function must return a
boolean, `true` if the field validates fine and `false` if it fails to validate.

Validations pass in at least three arguments:

 * `form`  - the jQuery object for the form (we validate in this form)
 * `el`    - the jQuery object for the form field (we validate on this field)
 * `value` - the value of the form field (short for `el.val()`)

After these three arguments you can declare the arguments for your validation. In this example the
`word` validation has two arguments, `word1` and `word2`. You pass in the arguments in your validation call like
`word(ketchup, mustard)`. Now 'ketchup' is the `word1` argument and so on.

Validation messages have `{argN}` placeholders for your arguments. `Is {arg1}` would become `Is ketchup`.

### Your HTML

    <form id="own-validation" action="index.html">
      <ul>
        <li>
          <label for="ov-word">Ketchup or Mustard</label>
          <input type="text" id="ov-word" data-validate="validate(word(ketchup, mustard))" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $.ketchup.validation('word', 'Either "{arg1}" or "{arg2}"', function(form, el, value, word1, word2) {
      if(value == word1 || value == word2) {
        return true;
      } else {
        return false;
      }
    });

    $('#own-validation').ketchup();


Helpers for your validations
----------------------------

Helpers are repeating functions you can use in your validations via `this`.

 * `isNumber(value)` - Check if the `value` is a valid number. Returns `true`/`false`.
 * `contains(value, word)` - Check if the `value` contains `word`. Returns `true`/`false`.
 * `isEmail(value)` - Check if the `value` is a valid email. Returns `true`/`false`.
 * `isUrl(value)` - Check if the `value` is a valid URL. Returns `true`/`false`.
 * `isUsername(value)` - Check if the `value` is a valid username. Returns `true`/`false`.
 * `isDate(value)` - Check if the `value` is a valid date. Returns `true`/`false`.
 * `inputsWithName(form, el)` - Get all elements in the `form` with the name of `el`. Returns a jQuery object.
 * `inputsWithNameNotSelf(form, el)` - Get all elements in the `form` with the name of `el` but not itself. Returns a jQuery object.
 * `getKetchupEvents(el)` - Get all events Ketchup has used on the `el`. Returns a String.
 * `bindBrothers(form, el)` - Bind all elements in the `form` with `el`'s name to `el`'s Ketchup events. This is helpful on checkboxes and co. Returns `undefined`.

### Your HTML

    <form id="validation-helper" action="index.html">
      <ul>
        <li>
          <label for="vh-email">Your E-Mail (must contain 'ketchup')</label>
          <input type="text" id="vh-email" data-validate="validate(ketchupEmail)" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $.ketchup.validation('ketchupEmail', 'Must be a valid e-mail and contain "ketchup"', function(form, el, value) {
      if(this.isEmail(value) && this.contains(value.toLowerCase(), 'ketchup')) {
        return true;
      } else {
        return false;
      }
    });
    
    $('#validation-helper').ketchup();


Write your own helpers
----------------------

Of course you can extend helpers too. Pass a helper name and the actual helper function with the arguments
to `helper()`.

### Your HTML

    <form id="own-helper" action="index.html">
      <ul>
        <li>
          <label for="oh-rand1">This field is validated randomly</label>
          <input type="text" id="oh-rand1" data-validate="validate(random)" />
        </li>
        <li>
          <label for="oh-rand2">Words are validated randomly: ketchup, mustard</label>
          <input type="text" id="oh-rand2" data-validate="validate(randomWord(ketchup, mustard))" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $.ketchup.helper('randomNumber', function(min, max) {
      return (min + parseInt(Math.random() * (max - min + 1)));
    });
    
    $.ketchup.validation('random', 'Not this time...', function(form, el, value) {
      return (this.randomNumber(0, 1) ? true : false);
    });
    
    $.ketchup.validation('randomWord', 'Try the other word', function(form, el, value, word1, word2) {      
      return (this.randomNumber(0, 1) ? word1 : word2) == value;
    });

    $('#own-helper').ketchup();
    

Set the messages for your validations
-------------------------------------

In the examples above we set the message for the validations directly as second argument in the `validate()`
function. This is not necessary. If you want to seperate the messages from the validation code you have
two choices.

Either overwrite single messages:

    $.ketchup.message('word', 'Guess the word!');

Or pass in an object to the messages method (You can copy and paste them from the last version of Ketchup).
Note that only declared validation messages gets overwritten, the others are still set.

    $.ketchup.messages({
      required : 'Something?',
      minlength: '>= {arg1}'
    });


Control the behavior of the error container
-------------------------------------------

Time to control the behavior and the style of the error container. Several functions can be overwritten leaving
creating, showing and hiding the error container and add error messages completely up to you.

 * `createErrorContainer(function(form, el) {})`
 
   This function creates the error container one time. `form` is the form we are currently in and `el` the element
   we are currently validating. It must return a jQuery object of the error container.
   
 * `showErrorContainer(function(form, el, container) {})`
 
   This function shows the error container every time the field `el` fails to validate.
   `form` is the form we are currently in and `el` the element we are currently validating.
   `container` is the jQuery object of the error container, you created it with `createErrorContainer()`.
   Must not return anything
 
 * `hideErrorContainer(function(form, el, container) {})`
 
   As opposite to `showErrorContainer()` this function hides the error container when the field `el` validates fine.
   It pass in the same arguments as `showErrorContainer()` and must not return anything.
 
 * `addErrorMessages(function(form, el, container, messages) {})`
 
   If the field `el` fails to validate you need to update the error messages via this function. `form`, `el` and `container`
   are the same arguments as in `showErrorContainer()` and `hideErrorContainer()`. `messages` is a Array containing strings
   of all error messages the field fails to validate.

### Your CSS

    .ketchup-custom {
      line-height: 1em;
    }

    .ketchup-custom li {
      font-size: 10px;
      text-transform: uppercase;
      text-shadow: 1px 1px 0 #9F4631;
      border: 0;
      color: white;
      background: #F46644;
      padding: 1px 10px;
      margin-top: 1px;
    }

### Your HTML

    <form id="custom-behavior" action="index.html">
      <ul>
        <li>
          <label for="cb-mail">E-Mail</label>
          <input type="text" id="cb-mail" data-validate="validate(required, email)" />
        </li>
        <li>
          <label for="cb-username">Username</label>
          <input type="text" id="cb-username" data-validate="validate(required, minlength(3))" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $.ketchup
    
    .createErrorContainer(function(form, el) {
      return $('<ul/>', {
               'class': 'ketchup-custom'
             }).insertAfter(el);
    })
    
    .addErrorMessages(function(form, el, container, messages) {
      container.html('');
      
      for(i = 0; i < messages.length; i++) {
        $('<li/>', {
          text: messages[i]
        }).appendTo(container);
      }
    })
    
    .showErrorContainer(function(form, el, container) {
      container.slideDown('fast');
    })
    
    .hideErrorContainer(function(form, el, container) {
      container.slideUp('fast');
    });

    $('#custom-behavior').ketchup({
      validateEvents: 'blur focus keyup'
    });


Check if the form and fields are valid from outside
---------------------------------------------------

### Your HTML

    <form id="from-outside" action="index.html">
      <ul>
        <li>
          <label for="fo-mail">E-Mail</label>
          <input type="text" id="fo-mail" data-validate="validate(required, email)" />
        </li>
        <li>
          <label for="fo-username">Username</label>
          <input type="text" id="fo-username" data-validate="validate(required, username, minlength(5))" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript
     
    var form     = $('#from-outside'),
        mail     = $('#fo-mail', form),
        username = $('#fo-username', form),
        result   = $('<ul/>', { id: 'fo-errors' }).appendTo(form);
    
    form
      .ketchup({
        validateEvents: 'none'
      })
      .find('input').keyup(function() {
        result.html('');
      
        $.each([form, mail, username], function(index, el) {
          var valid = el.ketchup('isValid') ? 'valid' : 'invalid';
        
          $('<li/>', {
            'class': valid,
            text   : '#' + el.attr('id') + ' is ' + valid
          }).appendTo(result);
        });
      })
      .last().keyup();


To-Do
-----
 * Rewrite fieldsFrom* methods
 * Trigger events (fieldIsInvalid fieldIsValid formIs...)
 * Docs about validation init callback
 * Get rid of validate() indicator, events in extra attribute
 * About checkboxes


Default Options
---------------

    attribute           : 'data-validate',                //look in that attribute for an validation string
    validateIndicator   : 'validate',                     //in the validation string this indicates the validations eg validate(required)
    eventIndicator      : 'on',                           //in the validation string this indicates the events when validations get fired eg on(blur)
    validateEvents      : 'blur',                         //the default event when validations get fired on every field
    validateElements    : ['input', 'textarea', 'select'],//check this fields in the form for a validation string on the attribute
    createErrorContainer: null,                           //function to create the error container (can also be set via $.ketchup.createErrorContainer(fn))
    showErrorContainer  : null,                           //function to show the error container (can also be set via $.ketchup.showErrorContainer(fn))
    hideErrorContainer  : null,                           //function to hide the error container (can also be set via $.ketchup.hideErrorContainer(fn))
    addErrorMessages    : null                            //function to add error messages to the error container (can also be set via $.ketchup.addErrorMessages(fn))