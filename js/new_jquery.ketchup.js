(function($) {
  $.ketchup = {
    defaults: {
      attribute          : 'class',
      validateIndicator  : 'validate',
      eventIndicator     : 'on',
      validateEvent      : 'blur',
      dataNameString     : 'ketchup-validation-string',
      dataNameValidations: 'ketchup-validations',
      dataNameEvents     : 'ketchup-event'
    },
    validations: {},
    
    
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
      var self = this;
      
      if(!fields) {
        //[input,textarea,select] as default .each
        fields = form.find('input[' + options.attribute + '*=' + options.validateIndicator + ']');
      } else {
        var fieldsTemp = [];
        
        for(s in fields) {
          var valString, events;
          
          if(typeof fields[s] == 'string') {
            valString = fields[s];
            events    = options.validateEvent;
          } else {
            valString = fields[s][0];
            events    = fields[s][1];
          }
          
          var els = form.find(s)
                        .data(options.dataNameString, options.validateIndicator + '(' + valString + ')')
                        .data(options.dataNameEvents, events);
          
          els.each(function() {
            fieldsTemp.push(this);
          });
        }
        
        fields = $(fieldsTemp);
      }
      
      fields.each(function() {
        var el = $(this);
        
        if(!el.data(options.dataNameString)) {
          el.data(options.dataNameString, el.attr(options.attribute));
        }
        
        el.data(
          options.dataNameValidations,
          self.extractValidations(el.data(options.dataNameString), options.validateIndicator)
        );

        if(!el.data(options.dataNameEvents)) {
          var events = self.extractEvents(el.attr(options.attribute), options.eventIndicator);
          
          el.data(
            options.dataNameEvents,
            events ? events : options.validateEvent
          );
        }
        
        self.bindValidationEvent(el);
      });
    },
    
    
    bindValidationEvent: function(el) {
      //console.log(el.data());
    },
    
    
    extractValidations: function(toExtract, indicator) { //I still don't know regex
      var fullString   = toExtract.substr(toExtract.indexOf(indicator) + indicator.length + 1),
          tempStr      = '',
          tempArr      = [];
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
    }
  };
  
  
  $.fn.ketchup = function(options, fields) {
    this.each(function() {
      $.ketchup.init($(this), $.extend({}, $.ketchup.defaults, options), fields);
    });
    
    return this;
  };
})(jQuery);