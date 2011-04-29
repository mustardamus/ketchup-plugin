/*
  jQuery Ketchup Plugin - Tasty Form Validation
  ---------------------------------------------
  
  Version 0.3.2 - 31. Jan 2011
    - Fixed another IE problem (by https://github.com/philippbosch)
  Version 0.3.1 - 12. Jan 2011
    - Check if error-container exists (by Emil Marashliev)
    - Make it work in IE6/7 (by https://github.com/hellokingdom)
  Version 0.3   - 06. Jan 2011
    - Rewritten from scratch
  Version 0.1   - 12. Feb 2010
    - Initial release
  
  Copyright (c) 2011 by Sebastian Senf:
    http://mustardamus.com/
    http://usejquery.com/
    http://twitter.com/mustardamus

  Dual licensed under the MIT and GPL licenses:
    http://www.opensource.org/licenses/mit-license.php
    http://www.gnu.org/licenses/gpl.html

  Demo: http://demos.usejquery.com/ketchup-plugin/
  Repo: http://github.com/mustardamus/ketchup-plugin
*/

(function($) {
  $.ketchup = {
    defaults: {
      attribute           : 'data-validate',                //look in that attribute for an validation string
      validateIndicator   : 'validate',                     //in the validation string this indicates the validations eg validate(required)
      eventIndicator      : 'on',                           //in the validation string this indicates the events when validations get fired eg on(blur)
      validateEvents      : 'blur',                         //the default event when validations get fired on every field
      validateElements    : ['input', 'textarea', 'select'],//check this fields in the form for a validation string on the attribute
      createErrorContainer: null,                           //function to create the error container (can also be set via $.ketchup.createErrorContainer(fn))
      showErrorContainer  : null,                           //function to show the error container (can also be set via $.ketchup.showErrorContainer(fn))
      hideErrorContainer  : null,                           //function to hide the error container (can also be set via $.ketchup.hideErrorContainer(fn))
      addErrorMessages    : null                            //function to add error messages to the error container (can also be set via $.ketchup.addErrorMessages(fn))
    },
    dataNames: {
      validationString    : 'ketchup-validation-string',
      validations         : 'ketchup-validations',
      events              : 'ketchup-events',
      elements            : 'ketchup-validation-elements',
      container           : 'ketchup-container'
    },
    validations           : {},
    helpers               : {},
    
    
    validation: function() {
      var message, func,
          arg1 = arguments[1];
      
      if(typeof arg1 == 'function') {
        func    = arg1;
      } else {
        message = arg1;
        func    = arguments[2];
      }
          
      this.validations[arguments[0]] = {
        message: message,
        func   : func,
        init   : arguments[3] || function(form, el) {}
      };
      
      return this;
    },
    
    
    message: function(name, message) {
      this.addMessage(name, message);
      return this;
    },
    
    
    messages: function(messages) {
      for(name in messages) {
        this.addMessage(name, messages[name]);
      }
      
      return this;
    },
    
    
    addMessage: function(name, message) {
      if(this.validations[name]) {
        this.validations[name].message = message;
      }
    },
    
    
    helper: function(name, func) {
      this.helpers[name] = func;
      return this;
    },
    
    
    init: function(form, options, fields) {      
          this.options = options;
      var self         = this,
          valEls       = this.initFunctions().initFields(form, fields);
      
      valEls.each(function() {
        var el = $(this);
        
        self.bindValidationEvent(form, el)
            .callInitFunctions(form, el);
      });
          
      form.data(this.dataNames.elements, valEls);
      this.bindFormSubmit(form);
    },
    
    
    initFunctions: function() {
      var opt       = this.options,
          initFuncs = [
                        'createErrorContainer',
                        'showErrorContainer',
                        'hideErrorContainer',
                        'addErrorMessages'
                      ];

      for(f = 0; f < initFuncs.length; f++) {
        var funcName = initFuncs[f];
    
        if(!opt[funcName]) {
          opt[funcName] = this[funcName];
        }
      }
      
      return this;
    },
    
    
    initFields: function(form, fields) {
      var self      = this,
          dataNames = this.dataNames,
          valEls    = $(!fields ? this.fieldsFromForm(form) : this.fieldsFromObject(form, fields));
      
      valEls.each(function() {
        var el   = $(this),
            vals = self.extractValidations(el.data(dataNames.validationString), self.options.validateIndicator);
        
        el.data(dataNames.validations, vals);
      });
      
      return valEls;
    },
    
    
    callInitFunctions: function(form, el) {
      var vals = el.data(this.dataNames.validations);
      
      for(i = 0; i < vals.length; i++) {
        vals[i].init.apply(this.helpers, [form, el]);
      }
    },
    
    
    fieldsFromForm: function(form) {
      var self      = this,
          opt       = this.options,
          dataNames = this.dataNames,
          valEls    = opt.validateElements,
          retArr    = [];
          valEls    = typeof valEls == 'string' ? [valEls] : valEls;
      
      for(i = 0; i < valEls.length; i++) {
        var els = form.find(valEls[i] + '[' + opt.attribute + '*=' + opt.validateIndicator + ']');
        
        els.each(function() {
          var el     = $(this),
              attr   = el.attr(opt.attribute),
              events = self.extractEvents(attr, opt.eventIndicator);

          el.data(dataNames.validationString, attr).data(dataNames.events, events ? events : opt.validateEvents);
        });
        
        retArr.push(els.get());
      } 
      
      return this.normalizeArray(retArr);
    },
    
    
    fieldsFromObject: function(form, fields) {
      var opt       = this.options,
          dataNames = this.dataNames,
          retArr    = [];
      
      for(s in fields) {
        var valString, events;
        
        if(typeof fields[s] == 'string') {
          valString = fields[s];
          events    = opt.validateEvents;
        } else {
          valString = fields[s][0];
          events    = fields[s][1];
        }
        
        var valEls    = form.find(s);
            valString = this.mergeValidationString(valEls, valString);
            events    = this.mergeEventsString(valEls, events);
        
        valEls.data(dataNames.validationString, opt.validateIndicator + '(' + valString + ')')
              .data(dataNames.events, events);

        retArr.push(valEls.get());
      }
      
      return this.normalizeArray(retArr);
    },
    
    
    mergeEventsString: function(valEls, events) {
      var oldEvents = valEls.data(this.dataNames.events),
          newEvents = '';
      
      if(oldEvents) {
        var eveArr = oldEvents.split(' ');
        
        for(i = 0; i < eveArr.length; i++) {
          if(events.indexOf(eveArr[i]) == -1) {
            newEvents += ' ' + eveArr[i];
          }
        }
      }
      
      return $.trim(events + newEvents);
    },
    
    
    mergeValidationString: function(valEls, newValString) {
      var opt          = this.options,
          valString    = valEls.data(this.dataNames.validationString),
          buildValFunc = function(validation) {
                           var ret = validation.name;
                           
                           if(validation.arguments.length) {
                             ret = ret + '(' + validation.arguments.join(',') + ')';
                           }
                           
                           return ret;
                         },
          inVals       = function(valsToCheck, val) {
                           for(i = 0; i < valsToCheck.length; i++) {
                             if(valsToCheck[i].name == val.name) {
                               return true;
                             }
                           }
                         };
      
      if(valString) {
        var newVals      = this.extractValidations(opt.validateIndicator + '(' + newValString + ')', opt.validateIndicator),
            oldVals      = this.extractValidations(valString, opt.validateIndicator);
            newValString = '';
        
        for(o = 0; o < oldVals.length; o++) {
          newValString += buildValFunc(oldVals[o]) + ',';
        }
        
        for(n = 0; n < newVals.length; n++) {
          if(!inVals(oldVals, newVals[n])) {
            newValString += buildValFunc(newVals[n]) + ',';
          }
        }
      }
      
      return newValString;
    },
    
    
    bindFormSubmit: function(form) {
      var self = this,
          opt  = this.options;
      
      form.submit(function() {
        return self.allFieldsValid(form, true);
      });
    },
    
    
    allFieldsValid: function(form, triggerEvents) {
      var self  = this,
          tasty = true;
      
      form.data(this.dataNames.elements).each(function() {          
        var el = $(this);
        
        if(self.validateElement(el, form) != true) {
          if(triggerEvents == true) {
            self.triggerValidationEvents(el);
          }
          
          tasty = false;
        }
      });

      form.trigger('formIs' + (tasty ? 'Valid' : 'Invalid'), [form]);
      
      return tasty;
    },
    
    
    bindValidationEvent: function(form, el) {      
      var self      = this,
          opt       = this.options,
          dataNames = this.dataNames,
          events    = el.data(dataNames.events).split(' ');
      
      for(i = 0; i < events.length; i++) {
        el.bind('ketchup.' + events[i], function() {
          var tasty     = self.validateElement(el, form),
              container = el.data(dataNames.container);

          if(tasty != true) {
            if(!container) {
              container = opt.createErrorContainer(form, el);
              el.data(dataNames.container, container);
            }

            opt.addErrorMessages(form, el, container, tasty);	        
            opt.showErrorContainer(form, el, container);
          } else {
            if(container){
              opt.hideErrorContainer(form, el, container);
            }
          }
        });
        
        this.bindValidationEventBridge(el, events[i]);
      }
      
      return this;
    },
    
    
    bindValidationEventBridge: function(el, event) {
      el.bind(event, function() {
        el.trigger('ketchup.' + event);
      });
    },
    
    
    validateElement: function(el, form) {
      var tasty = [],
          vals  = el.data(this.dataNames.validations),
          args  = [form, el, el.val()];

      for(i = 0; i < vals.length; i++) {
        if(!vals[i].func.apply(this.helpers, args.concat(vals[i].arguments))) {
          tasty.push(vals[i].message);
        }
      }
      
      form.trigger('fieldIs' + (tasty.length ? 'Invalid' : 'Valid'), [form, el]);
      
      return tasty.length ? tasty : true;
    },
    
    
    elementIsValid: function(el) {
      var dataNames = this.dataNames;
      
      if(el.data(dataNames.validations)) {
        var form = el.parentsUntil('form').last().parent();
        
        return (this.validateElement(el, form) == true ? true : false);
      } else if(el.data(dataNames.elements)) {
        return this.allFieldsValid(el);
      }
      
      return null;
    },
    
    
    triggerValidationEvents: function(el) {
      var events = el.data(this.dataNames.events).split(' ');
      
      for(var e = 0; e < events.length; e++) {
        el.trigger('ketchup.' + events[e]);
      }
    },
    
    
    extractValidations: function(toExtract, indicator) { //I still don't know regex
      var fullString   = toExtract.substr(toExtract.indexOf(indicator) + indicator.length + 1),
          tempStr      = '',
          tempArr      = [],
          openBrackets = 0,
          validations  = [];
      
      for(var i = 0; i < fullString.length; i++) {
        switch(fullString.charAt(i)) {
          case '(':
            tempStr += '(';
            openBrackets++;
            break;
          case ')':
            if(openBrackets) {
              tempStr += ')';
              openBrackets--;
            } else {
              tempArr.push($.trim(tempStr));
            }
            break;
          case ',':
            if(openBrackets) {
              tempStr += ',';
            } else {
              tempArr.push($.trim(tempStr));
              tempStr = '';
            }
            break;
          default:
            tempStr += fullString.charAt(i);
            break;
        }
      }
      
      for(v = 0; v < tempArr.length; v++) {
        var hasArgs = tempArr[v].indexOf('('),
            valName = tempArr[v],
            valArgs = [];
            
        if(hasArgs != -1) {
          valName = $.trim(tempArr[v].substr(0, hasArgs));          
          valArgs = $.map(tempArr[v].substr(valName.length).split(','), function(n) {
            return $.trim(n.replace('(', '').replace(')', ''));
          });
        }

        var valFunc = this.validations[valName];
        
        if(valFunc && valFunc.message) {
          var message = valFunc.message;
          
          for(a = 1; a <= valArgs.length; a++) {
            message = message.replace('{arg' + a + '}', valArgs[a - 1]);
          }
          
          validations.push({
            name     : valName,
            arguments: valArgs,
            func     : valFunc.func,
            message  : message,
            init     : valFunc.init
          });
        }
      }
      
      return validations;
    },
    
    
    extractEvents: function(toExtract, indicator) {
      var events = false,
          pos    = toExtract.indexOf(indicator + '(');
      
      if(pos != -1) {
        events = toExtract.substr(pos + indicator.length + 1).split(')')[0];
      }

      return events;
    },
    
    
    normalizeArray: function(array) {
      var returnArr = [];
      
      for(i = 0; i < array.length; i++) {
        for(e = 0; e < array[i].length; e++) {
          if(array[i][e]) {
            returnArr.push(array[i][e]);
          }
        }
      }
      
      return returnArr;
    },
    
    
    createErrorContainer: function(form, el) {      
      if(typeof form == 'function') {
        this.defaults.createErrorContainer = form;
        return this;
      } else {
        var elOffset = el.offset();
            
        return $('<div/>', {
                 html   : '<ul></ul><span></span>',
                 'class': 'ketchup-error',
                 css    : {
                            top : elOffset.top,
                            left: elOffset.left + el.outerWidth() - 20
                          }
               }).appendTo('body');
      }
    },
    
    
    showErrorContainer: function(form, el, container) {
      if(typeof form == 'function') {
        this.defaults.showErrorContainer = form;
        return this;
      } else {        
        container.show().animate({
          top    : el.offset().top - container.height(),
          opacity: 1
        }, 'fast');
      }
    },
    
    
    hideErrorContainer: function(form, el, container) {
      if(typeof form == 'function') {
        this.defaults.hideErrorContainer = form;
        return this;
      } else {
        container.animate({
          top    : el.offset().top,
          opacity: 0
        }, 'fast', function() {
          container.hide();
        });
      }
    },
    
    
    addErrorMessages: function(form, el, container, messages) {
      if(typeof form == 'function') {
        this.defaults.addErrorMessages = form;
        return this;
      } else {
        var list = container.children('ul');
        
        list.html('');
        
        for(i = 0; i < messages.length; i++) {
          $('<li/>', {
            text: messages[i]
          }).appendTo(list);
        }
      }
    }
  };
  
  
  $.fn.ketchup = function(options, fields) {
    var el = $(this);
    
    if(typeof options == 'string') {
      switch(options) {
        case 'validate':
          $.ketchup.triggerValidationEvents(el);
          break;
        case 'isValid':
          return $.ketchup.elementIsValid(el);
          break;
      }
    } else {
      this.each(function() {
        $.ketchup.init(el, $.extend({}, $.ketchup.defaults, options), fields);
      });
    }
    
    return this;
  };
})(jQuery);