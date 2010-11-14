jQuery Ketchup Plugin - Tasty Form Validation
=============================================

> This is still in development. Anyway, feel free to test it and tell me what you think at twitter `@mustardamus`
> or `@usejquery`. This doc has live demos in `docs/index.html` Have fun!

Ketchup is a small (xxx minified) jQuery Plugin that helps you to validate your forms.
Out of the box it has (many) basic validations and a nice little bubble style. But truly this
Plugin wants to be hacked to fit your needs. Easily write your own validations and overwrite
the default behaviour. Bubbles are not for everyone...


Default Behavior
----------------

If you like the style of the bubbles and all validations you need are already written
you can get this Plugin up and running in a minute.

### Your HTML Header

    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>Yammie</title>

        <link rel="stylesheet" type="text/css" media="screen" href="css/jquery.ketchup.css" />

        <script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
        <script type="text/javascript" src="js/jquery.ketchup.js"></script>
        <script type="text/javascript" src="js/jquery.ketchup.validations.js"></script>
      </head>

      <body>
        ... form stuff ...

### Your HTML

By default Ketchup checks the data-validate attribute of form fields if it can find matching and
existing validations. The default indicator for validations is validate(), all validations
go in there and are seperated by comma. Validations can have arguments, also seperated by comma.

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

Just call ketchup() on your form, voilà. Form validation baby!

    $('#default-behavior').ketchup();


Declare fields to validate in the call
--------------------------------------

The last version of Ketchup looked in class attributes for validations. Some people said that
this is abusive and they would never stick (pseudo) code in their classes. With the HTML5
data- attributes we don't have that problem. We can set whatever we want and be total valid.
However, if you still want to seperate the validations declarations from our markup you can do so
by passing an object with jQuery selectors as key and validations as value to Ketchup.

### Your HTML

Note that required is not a validation declaration but an actual class name. We use that to
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

Right after the options (empty here) we pass in an object. Use the key to declare the jQuery
selector on which fields the validations in the value are processed.
If you declare fields like this you can left out the validations indicator.

    $('#fields-in-call').ketchup({}, {
      '.required'    : 'required',    //all fields in the form with the class 'required'
      '#fic-username': 'minlength(3)' //one field in the form with the id 'fic-username'
    });


Validate on different events
----------------------------

By default Ketchup listens to the blur event on form fields. You can overwrite that behaviour
for every fields in the options, or you can overwrite it per form field.

### Your HTML

In the data-validate attribute (you can choose which attribute can contain validations via the
options) you have the on() indicator. Events go in there and are seperated by a space. These
are strings jQuery's bind() accepts.

    <form id="validation-events" action="index.html">
      <ul>
        <li>
          <label for="ve-username">Username</label>
          <input type="text" id="ve-username" data-validate="huha(required, minlength(3)) on(keyup focus)" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript

    $('#validation-events').ketchup({
      validateEvents: 'dblclick',
      validateIndicator:'huha'
    });

    /*if you set the fields to validate in the call
      you simply passin a array as value. First argument
      is the validations string and the second are the
      events. Like so:

    $('#validation-events').ketchup({}, {
      '#ve-username': ['required, minlength(3)', 'keyup focus']
    });*/
    
    
Write your own validation
-------------------------

Now to the real fun part, hacking instead of just calling! You can write your own validation
functions for Ketchup. A validation function must return a boolean, true if the field validates
fine and false if it fails to validate. Validations are called with at least three arguments:

 * form - the jQuery object for the form
 * el - the jQuery object for the form field

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

this in your validations represents helper methods you can declare.

 * list of
 * helpers here

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
      if(this.isEmail(value) && value.toLowerCase().indexOf('ketchup') != -1) {
        return true;
      } else {
        return false;
      }
    });
    
    $('#validation-helper').ketchup();


Write your own helpers
----------------------

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

As seen above the message can be set when you add the validaion. You can seperate the messages from the
validations in two ways.

Either overwrite single messages:

    $.ketchup.message('word', 'Guess the word!');

Or pass in an object to the messages method (You can copy and paste them if you changed them in the last version).
Note that only declared validation messages gets overwritten, the others are still set.

    $.ketchup.messages({
      required : 'Something?',
      minlength: '>= {arg1}'
    });


Control the behavior of the error container
-------------------------------------------

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
               css: {
                 display: 'none',
                 margin : 10,
               }
             }).insertAfter(el);
    })
    
    .addErrorMessages(function(form, el, container, messages) {
      container.html('');
      
      for(i = 0; i < messages.length; i++) {
        $('<li/>', {
          text: messages[i],
          css : {
            fontSize    : 10,
            textTransform: 'uppercase',
            background  : '#E44100',
            textShadow  : '1px 1px 0 #BF3600',
            color       : 'white',
            padding     : '3px 10px',
            marginBottom: 2
          }
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


To-Do
-----
 * Rewrite fieldsFrom* methods
 * Trigger events
 * Docs for Helpers
 * make dataName* not an option
 * Finish docs


Default Options
---------------

    attribute           : 'data-validate',                //look in that attribute for an validation string
    validateIndicator   : 'validate',                     //in the validation string this indicates the validations eg validate(required)
    eventIndicator      : 'on',                           //in the validation string this indicates the events when validations get fired eg on(blur)
    validateEvents      : 'blur',                         //the default event when validations get fired on every field
    validateElements    : ['input', 'textarea', 'select'],//check this fields in the form for a validation string on the attribute
    dataNameString      : 'ketchup-validation-string',    //data name to store the validation string
    dataNameValidations : 'ketchup-validations',          //data name to store the validations (names & functions)
    dataNameEvents      : 'ketchup-events',               //data name to store the events when validations get fired
    dataNameElements    : 'ketchup-validation-elements',  //data name for the fields to validate (set on the form)
    dataNameContainer   : 'ketchup-container',            //data name for the error container element
    createErrorContainer: null,                           //function to create the error container (can also be set via $.ketchup.createErrorContainer(fn))
    showErrorContainer  : null,                           //function to show the error container (can also be set via $.ketchup.showErrorContainer(fn))
    hideErrorContainer  : null,                           //function to hide the error container (can also be set via $.ketchup.hideErrorContainer(fn))
    addErrorMessages    : null                            //function to add error messages to the error container (can also be set via $.ketchup.addErrorMessages(fn))
    

All validations
---------------

### Your HTML

    <form id="all" action="index.html">
      <ul>
        <li>
          <label>required</label>
          <input type="text" data-validate="validate(required)" />
        </li>
        <li>
          <label>required</label>
          <textarea data-validate="validate(required)"></textarea>
        </li>
        <li>
          <label>required</label>
          <input type="checkbox" data-validate="validate(required)" />
        </li>
        <li>
          <label>minlength(min)</label>
          <input type="text" data-validate="validate(minlength(3))" />
        </li>
        <li>
          <label>maxlength(max)</label>
          <input type="text" data-validate="validate(maxlength(13))" />
        </li>
        <li>
          <label>rangelength(min, max)</label>
          <input type="text" data-validate="validate(rangelength(3, 13))" />
        </li>
        <li>
          <label>min(min)</label>
          <input type="text" data-validate="validate(min(3))" />
        </li>
        <li>
          <label>max(max)</label>
          <input type="text" data-validate="validate(max(13))" />
        </li>
        <li>
          <label>range(min, max)</label>
          <input type="text" data-validate="validate(range(3, 13))" />
        </li>
        <li>
          <label>number</label>
          <input type="text" data-validate="validate(number)" />
        </li>
        <li>
          <label>digits</label>
          <input type="text" data-validate="validate(digits)" />
        </li>
        <li>
          <label>email</label>
          <input type="text" data-validate="validate(email)" />
        </li>
        <li>
          <label>url</label>
          <input type="text" data-validate="validate(url)" />
        </li>
        <li>
          <label>username</label>
          <input type="text" data-validate="validate(username)" />
        </li>
        <li>
          <label>match(word)</label>
          <input type="text" data-validate="validate(match(ketchup))" />
        </li>
        <li>
          <label>contain(word)</label>
          <input type="text" data-validate="validate(contain(ketchup))" />
        </li>
        <li>
          <label>date</label>
          <input type="text" data-validate="validate(date)" />
        </li>
        <li>
          <label>minselect(min)</label>
          Ketchup
          <input type="checkbox" name="checkit" />
          Mustard
          <input type="checkbox" name="checkit" />
          Beer
          <input type="checkbox" name="checkit" data-validate="validate(minselect(2)) on(click change)" />
        </li>
        <li>
          <label>maxselect(max)</label>
          Ketchup
          <input type="checkbox" name="checkitmax" />
          Mustard
          <input type="checkbox" name="checkitmax" />
          Beer
          <input type="checkbox" name="checkitmax" data-validate="validate(maxselect(2)) on(click change)" />
        </li>
        <li>
          <label>rangeselect(max)</label>
          Ketchup
          <input type="checkbox" name="checkitrange" />
          Mustard
          <input type="checkbox" name="checkitrange" />
          Yammie
          <input type="checkbox" name="checkitrange" />
          Beer
          <input type="checkbox" name="checkitrange" data-validate="validate(rangeselect(2, 3)) on(click change)" />
        </li>
        <li>
          <input type="submit" value="Is Tasty?" />
        </li>
      </ul>
    </form>

### Your Javascript
    
    $('#all').ketchup({ validateEvents: 'keyup blur' }).submit();