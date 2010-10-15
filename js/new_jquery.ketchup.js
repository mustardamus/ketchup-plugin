(function($) {
  $.ketchup = {
    defaults: {
      attribute           : 'class',
      validateIndicator   : 'validate',
      eventIndicator      : 'on',
      validateEvents      : 'blur',
      validateElements    : ['input', 'textarea'],
      dataNameString      : 'ketchup-validation-string',
      dataNameValidations : 'ketchup-validations',
      dataNameEvents      : 'ketchup-events',
      dataNameElements    : 'ketchup-validation-elements',
      dataNameContainer   : 'ketchup-container',
      createErrorContainer: null,
      showErrorContainer  : null,
      hideErrorContainer  : null,
      addErrorMessages    : null,
    },
    validations : {},
    
    
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
        func   : func
      };
      
      return this;
    },
    
    
    message: function(name, message) {
      if(this.validations[name]) {
        this.validations[name].message = message;
      }
      
      return this;
    },
    
    
    init: function(form, options, fields) {
      var self             = this,
          validateElements = [],
          opt              = options,
          oValInd          = opt.validateIndicator,
          oValEvents       = opt.validateEvents,
          oNameString      = opt.dataNameString,
          oNameEvents      = opt.dataNameEvents,
          oAttr            = opt.attribute;
      
      if(!options.createErrorContainer) options.createErrorContainer = this.createErrorContainer;
      if(!options.showErrorContainer)   options.showErrorContainer   = this.showErrorContainer;
      if(!options.hideErrorContainer)   options.hideErrorContainer   = this.hideErrorContainer;
      if(!options.addErrorMessages)     options.addErrorMessages     = this.addErrorMessages;

      if(!fields) {
        var oValEls = options.validateElements;
            oValEls = typeof oValEls == 'string' ? [oValEls] : oValEls;
        
        for(i = 0; i < oValEls.length; i++) {
          var els = form.find(oValEls[i] + '[' + oAttr + '*=' + oValInd + ']');
          
          els.each(function() {
            var el     = $(this),
                attr   = el.attr(oAttr),
                events = self.extractEvents(attr, options.eventIndicator);

            el.data(oNameString, attr).data(oNameEvents, events ? events : oValEvents);
          });
          
          validateElements.push(els.get());
        }
      } else {        
        for(s in fields) {
          var valString, events;
          
          if(typeof fields[s] == 'string') {
            valString = fields[s];
            events    = oValEvents;
          } else {
            valString = fields[s][0];
            events    = fields[s][1];
          }
          
          var els = form.find(s)
                        .data(oNameString, oValInd + '(' + valString + ')')
                        .data(oNameEvents, events);
          
          validateElements.push(els.get());
        }
      }

      var valEls = this.buildValidateElements(validateElements);
      
      form.data(options.dataNameElements, valEls);
      this.bindFormSubmit(form, options);
      
      valEls.each(function() {
        var el = $(this);
        
        el.data(
          options.dataNameValidations,
          self.extractValidations(el.data(oNameString), options.validateIndicator)
        );

        self.bindValidationEvent(el, form, options);
      });
    },
    
    
    bindFormSubmit: function(form, options) {
      var self = this;
      
      form.submit(function() {
        var tasty = true;
        
        form.data(options.dataNameElements).each(function() {          
          var el = $(this);
          
          if(self.validateElement(el, form, options) != true) {
            el.trigger(el.data(options.dataNameEvents));
            tasty = false;
          }
        });
        
        return tasty;
      });
    },
    
    
    bindValidationEvent: function(el, form, options) {      
      var self = this;
      
      el.bind(el.data(options.dataNameEvents), function() {
        var tasty     = self.validateElement(el, form, options),
            container = el.data(options.dataNameContainer);
        
	      if(tasty != true) {
	        if(!container) {
	          container = options.createErrorContainer(form, el);
	          el.data(options.dataNameContainer, container);
	        }
	        
	        options.addErrorMessages(form, el, container, tasty);	        
	        options.showErrorContainer(form, el, container);
	      } else {
	        options.hideErrorContainer(form, el, container);
	      }
      });
    },
    
    
    validateElement: function(el, form, options) {
      var tasty = [],
          vals  = el.data(options.dataNameValidations),
          args  = [form, el, el.val()];
      
      for(i = 0; i < vals.length; i++) {
        if(!vals[i].func.apply(null, [form, el, el.val()].concat(vals[i].arguments))) {
          tasty.push(vals[i].message);
        }
      }
      
      return tasty.length ? tasty : true;
    },
    
    
    extractValidations: function(toExtract, indicator) { //I still don't know regex
      var fullString   = toExtract.substr(toExtract.indexOf(indicator) + indicator.length + 1),
          tempStr      = '',
          tempArr      = [],
          openBrackets = 0,
          validations  = [];
      
      for(var i = 0; i < fullString.length; i++) {
        switch(fullString[i]) {
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
            tempStr += fullString[i];
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
            message  : message
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
    
    
    buildValidateElements: function(validateElements) {
      var returnArr = [];
      
      for(i = 0; i < validateElements.length; i++) {
        for(e = 0; e < validateElements[i].length; e++) {
          if(validateElements[i][e]) {
            returnArr.push(validateElements[i][e]);
          }
        }
      }
      
      return $(returnArr);
    },
    
    
    createErrorContainer: function(form, el) {      
      if(typeof form == 'function') {
        this.defaults.createErrorContainer = form;
        return this;
      } else {
        var elOffset = el.offset();
            
        return $('<div/>', {
                 html   : '<ul></ul>',
                 'class': 'ketchup-error',
                 css    : {
                            display : 'none',
                            position: 'absolute',
                            top     : elOffset.top,
                            left    : elOffset.left
                          }
               }).appendTo('body');
      }
    },
    
    
    showErrorContainer: function(form, el, container) {
      if(typeof form == 'function') {
        this.defaults.showErrorContainer = form;
        return this;
      } else {
        container.show();
      }
    },
    
    
    hideErrorContainer: function(form, el, container) {
      if(typeof form == 'function') {
        this.defaults.hideErrorContainer = form;
        return this;
      } else {
        container.hide();
      }
    },
    
    
    addErrorMessages: function(form, el, container, messages) {
      if(typeof form == 'function') {
        this.defaults.addErrorMessage = form;
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
    this.each(function() {
      $.ketchup.init($(this), $.extend({}, $.ketchup.defaults, options), fields);
    });
    
    return this;
  };
})(jQuery);