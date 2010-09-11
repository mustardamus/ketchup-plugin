/*
   jQuery Ketchup Plugin
   =====================
   Tasty Form Validation
   
   Version 0.1 - 12. Feb 2010
   
   Copyright (c) 2010 by Sebastian Senf:
   http://mustardamus.com/
   http://usejquery.com/
   
   Dual licensed under the MIT and GPL licenses:
   http://www.opensource.org/licenses/mit-license.php
   http://www.gnu.org/licenses/gpl.html
   
   Demo:            http://demos.usejquery.com/ketchup-plugin/
   Source:          http://github.com/mustardamus/ketchup-plugin
*/

(function($) {
  var validate = 'validate';
  
  
  function squeeze(form) {
    var fields = fieldsToValidate(form);
    
    for(var i = 0; i < fields.length; i++) {
      bindField(fields[i]);
    }
    
    form.submit(function() {
      var tasty = true;
      
      for(var i = 0; i < fields.length; i++) {
        if(buildErrorList(extractValidations(fields[i].blur()), fields[i]).length) tasty = false;
      }
      
      if(!tasty) return false;
    });
  }
  
  
  function fieldsToValidate(form) {
    var tags = 'input textarea select'.split(' ');
    var fields = [];
    
    for(var i = 0; i < tags.length; i++) {
      form.find(tags[i]+'['+options.validationAttribute+'*='+validate+']').each(function() {
        fields.push($(this));
      });
    }
    
    return fields;
  }
  
  
  function bindField(field) {
    var validations = extractValidations(field);
    var errorContainer = (options.appendToBody) ? 
      options.errorContainer.clone().appendTo('body'):
      field.after(options.errorContainer.clone()).next();
    var contOl = errorContainer.find('ol');
    var visibleContainer = false;
    
    $(window).resize(function() {
      options.initialPositionContainer(errorContainer, field);
    }).trigger('resize');
    
    field.blur(function() {
      var errList = buildErrorList(validations, field);
      
      if(errList.length) {
        if(!visibleContainer) {
          contOl.html(errList);
          options.showContainer(errorContainer);
          visibleContainer = true;
        } else {
          contOl.html(errList);
        }
        
        options.positionContainer(errorContainer, field);
      } else {
        options.hideContainer(errorContainer);
        visibleContainer = false;
      }
    });
    
    if(field.attr('type') == 'checkbox') {
      field.change(function() { //chrome dont fire blur on checkboxes, but change
        $(this).blur(); //so just simulate a blur
      });
    }
  }
  
  
  function extractValidations(field) {
    var valStr = field.attr(options.validationAttribute);
        valStr = valStr.substr(valStr.indexOf(validate) + validate.length + 1);
    var validations = [];
    var tempStr = '';
    var openBrackets = 0;
    
    for(var i = 0; i < valStr.length; i++) {
      switch(valStr[i]) {
        case ',':
          if(openBrackets) {
            tempStr += ',';
          } else {
            validations.push(trim(tempStr));
            tempStr = '';
          }
          break;
        case '(':
          tempStr += '(';
          openBrackets++;
          break;
        case ')':
          if(openBrackets) {
            tempStr += ')';
            openBrackets--;
          } else {
            validations.push(trim(tempStr));
          }
          break;
        default:
          tempStr += valStr[i];
      }
    }

    return validations;    
  }
  
  
  function trim(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  }
  
  
  function getFunctionName(validation) {
    if(validation.indexOf('(') != -1) {
      return validation.substr(0, validation.indexOf('('));
    } else {
      return validation;
    }
  }
  
  
  function buildParams(validation) {
    if(validation.indexOf('(') != -1) {
      var arr = validation.substring(validation.indexOf('(') + 1, validation.length - 1).split(',');
      var tempStr = '';
      
      for(var i = 0; i < arr.length; i++) {
        var single = trim(arr[i]);
        
        if(parseInt(single)) {
          tempStr += ','+single;
        } else {
          tempStr += ',"'+single+'"'
        }
      }
      
      return tempStr;
    } else {
      return '';
    }
  }
  
  
  function formatMessage(message, params, field) {
    var args = message.split('$arg').length - 1;
    
    if(args) {
      var parArr = params.split(',');
      
      for(var i = 1; i < parArr.length; i++) {
        message = message.replace('$arg'+i, parArr[i]);
      }
    }
    
    var regex = /\$attr\(([a-z \|]+)\)/;
    while (message.match(regex)) {
      message = message.replace(regex, function(full, attr){
        var split = attr.split('|');
        return field.attr(split[0]) || split[1];
      });
    }
    
    return message;
  }
  
  
  function buildErrorList(validations, field) {
    var list = '';
    
    for(var i = 0; i < validations.length; i++) {
      var funcName = getFunctionName(validations[i]);
      var params = buildParams(validations[i]);
      
      if(!eval('$.fn.ketchup.validations["'+funcName+'"](field, field.val()'+params+')')) {
        list += '<li>'+formatMessage($.fn.ketchup.messages[funcName], params, field)+'</li>';
      } 
    }
    
    return list;
  }
  
  
  var errorContainer = $('<div>', {
    'class':  'ketchup-error-container',
    html:     '<ol></ol><span></span>'
  });
  

  var initialPositionContainer = function(errorContainer, field) {
    var fOffset = field.offset();
    var left = fOffset.left;
    var top = fOffset.top;

    // check if there's a 'relative' parent
    if(!options.appendToBody){
      field.parents().each(function(){
        var position = $(this).css('position');
        if (position == 'relative' || position == 'absolute') {
          fOffset = $(this).offset();
          left -= fOffset.left;
          top -= fOffset.top;
          return false
        }
     }); 
    }

    // back it up for later
    field.data('offset',{left:left,top:top});

    errorContainer.css({
      left: left + field.width() - 10,
      top: top
    });
  };


  var positionContainer = function(errorContainer, field) {
   // re-position the error, the height is correct here.
   errorContainer.css({top:field.data('offset').top - errorContainer.height() + field.innerHeight()});

   // animate
    errorContainer.animate({
      top: field.data('offset').top - errorContainer.height()
    });
  };

  
  var showContainer = function(errorContainer) {
    errorContainer.fadeIn();
  };
  
  
  var hideContainer = function(errorContainer) {
    errorContainer.fadeOut();
  };
  
  
  $.fn.ketchup = function(opt) {
    options = $.extend({}, $.fn.ketchup.defaults, opt);
    return this.each(function() {
      squeeze($(this));
    });
  };
  

  $.fn.ketchup.validation = function(name, func) {
    $.fn.ketchup.validations.push(name);
    $.fn.ketchup.validations[name] = func;
  };
  
  $.fn.ketchup.add = function(name, obj){
    $.fn.ketchup.validation(name, obj.test);
    $.fn.ketchup.messages[name] = obj.message;
  };
  
  $.fn.ketchup.addMultiple = function(validations){
    $.each(validations, function(index, validation){
      $.fn.ketchup.add(validation[0], validation[1]);
    });
  }
  
  $.fn.ketchup.messages = {};
  $.fn.ketchup.validations = [];
  var options;

  $.fn.ketchup.defaults = {
    validationAttribute:      'class',
    errorContainer:           errorContainer,
    initialPositionContainer: initialPositionContainer,
    positionContainer:        positionContainer,
    showContainer:            showContainer,
    hideContainer:            hideContainer,
    appendToBody:             false
  };
})(jQuery);