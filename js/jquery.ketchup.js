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
  
  var function_stack = new Array();
  
  function squeeze(form) {
    var fields = fieldsToValidate(form);
    var fl = fields.length;
    for(var i = 0; i < fl; i++) {
      bindField(fields[i]);
    };
    var form_id = form.attr('id');
    if(!function_stack[form_id])
      function_stack[form_id] = new Array();
    if(function_stack[form_id]['submit_function'])
      form.unbind('submit', function_stack[form_id]['submit_function']);
    var submit_function = function() {
      var tasty = true;
    
      for(var i = 0; i < fields.length; i++) {
        if(buildErrorList(extractValidations(fields[i].blur()), fields[i]).length) tasty = false;
      };
    
      if(!tasty){
        //get the top offset of the target anchor
        var target_offset = $('div.ketchup-error-container:visible:first').offset();
        var target_top = target_offset.top - 30;
        //goto that anchor by setting the body scroll top to anchor top
        $('html, body').animate({scrollTop:target_top}, 500);
        return false;
      };
    };
    function_stack[form_id]['submit_function'] = submit_function;
    form.bind('submit', function_stack[form_id]['submit_function']);
  }
  
  
  function fieldsToValidate(form) {
    var tags = 'input textarea select'.split(' ');
    var fields = new Array();
    
    for(var i = 0; i < tags.length; i++) {
      form.find(tags[i]+'['+options.validationAttribute+'*='+validate+']').each(function() {
        fields.push($(this));
      });
    }
    
    return fields;
  }
  
  
  
  function bindField(field) {
    var form = field.parents('form');
    var form_id = form.attr('id')+'_'+form.attr('action');
    var field_id = form_id+'_'+field.attr('id')+'_'+field.attr('name');
    
    var validations = extractValidations(field);
    var existingContainer = field.next();
    if(existingContainer.hasClass('ketchup-error-container'))
      existingContainer.remove();
    
    var errorContainer = field.after(options.errorContainer).next();
    var contOl = errorContainer.find('ol');
    var visibleContainer = false;
    if(!function_stack[form_id])
      function_stack[form_id] = new Array();
    if(!function_stack[form_id][field_id])
      function_stack[form_id][field_id] = new Array();
    if(function_stack[form_id][field_id]['bind_function'])
      field.unbind('blur', function_stack[form_id][field_id]['bind_function']);
      
    var bind_function = function() {
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
    };
    function_stack[form_id][field_id]['bind_function'] = bind_function;
    
    if(function_stack[form_id][field_id]['resize_function'])
      $(window).unbind('resize', function_stack[form_id][field_id]['resize_function']);
    
    var resize_function = function() {
      options.initialPositionContainer(errorContainer, field);
    };
    
    function_stack[form_id][field_id]['resize_function'] = resize_function;
    $(window).bind('resize', function_stack[form_id][field_id]['resize_function']).trigger('resize');
    
    field.bind('blur', function_stack[form_id][field_id]['bind_function']);
    if(field.attr('type') == 'checkbox') {
      var cb = function() { //chrome dont fire blur on checkboxes, but change
        $(this).blur(); //so just simulate a blur
      };
      field.unbind('change', cb);
      field.bind('change', cb);
    }
  }
  
  
  function extractValidations(field) {
    var valStr = field.attr(options.validationAttribute);
        valStr = valStr.substr(valStr.indexOf(validate) + validate.length + 1);
    var validations = [];
    var tempStr = '';
    var openBrackets = 0;
    
    for(var i = 0; i < valStr.length; i++) {
      switch(valStr.charAt(i)) {
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
          tempStr += valStr.charAt(i);
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
      
      for(var i = 0; i < arr.length; i++){
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
  
  
  function formatMessage(message, params) {
    var args = message.split('$arg').length - 1;
    
    if(args) {
      var parArr = params.split(',');
      
      for(var i = 1; i < parArr.length; i++){
        message = message.replace('$arg'+i, parArr[i]);
      }
    }
    
    return message;
  }
  
  
  function buildErrorList(validations, field) {
    var list = '';
    
    for(var i = 0; i < validations.length; i++){
      var funcName = getFunctionName(validations[i]);
      var params = buildParams(validations[i]);
      
      if(!eval('$.fn.ketchup.validations["'+funcName+'"](field, field.val()'+params+')')) {
        list += '<li>'+formatMessage($.fn.ketchup.messages[funcName], params)+'</li>';
      } 
    }
    
    return list;
  }
  
  
  var errorContainer = '<div class="ketchup-error-container"><ol></ol><span></span></div>';
  
  
  var initialPositionContainer = function(errorContainer, field) {
    var fOffset = field.offset();

    errorContainer.css({
      left: fOffset.left + field.width() - 10,
      top: fOffset.top - errorContainer.height()
    });
  };
  
  
  var positionContainer = function(errorContainer, field) {
    errorContainer.animate({
      top: field.offset().top - errorContainer.height()
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
  
  
  $.fn.ketchup.messages = {};
  $.fn.ketchup.validations = [];
  var options;

  $.fn.ketchup.defaults = {
    validationAttribute:      'class',
    errorContainer:           errorContainer,
    initialPositionContainer: initialPositionContainer,
    positionContainer:        positionContainer,
    showContainer:            showContainer,
    hideContainer:            hideContainer
  };
})(jQuery);