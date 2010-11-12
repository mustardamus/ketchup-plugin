$(document).ready(function() {
  var extractCodeSegments = function(codeHeaders) {
    var headers = [
                    {
                      name: 'html',
                      text: 'Your HTML'
                    },
                    {
                      name: 'js',
                      text: 'Your Javascript'
                    }
                  ],
        ret     = {};
    
    for(i = 0; i < headers.length; i++) {
      var codeHeader = codeHeaders.filter(function() { return $(this).text() == headers[i].text; }),
          code       = codeHeader.next(),
          name       = headers[i].name;

      if(code.length) {
        if(code.get(0).nodeName.toLowerCase() == 'p') {
          code = code.next();
        }

        ret[name]         = {};
        ret[name].element = code;
        ret[name].code    = code.children().text();
      }
    }
    
    return ret;
  }, good = eval; //>;)
  
  $('h2').each(function() {
    var codeHeaders = $(this).nextUntil('h2').filter('h3'),
        codes       = extractCodeSegments(codeHeaders);
    
    if(codes.js && codes.html) {
      $('<div/>', {
        'class': 'demo',
        html: codes.html.code
      }).insertAfter(codes.js.element);

      good(codes.js.code);
    }
  });
  

/*  var hideAll = function() { $('#wrapper > *:not(h2, .demo)').hide(); };
  
  $(window).keyup(function(event) {
    switch(event.keyCode) {
      case 17: //hide all elements except h2 and .demo on ctrl
        hideAll();
        break;
      case 18: //hide elements and submit all forms on alt
        hideAll();
        $('form').submit();
        break;
    }
  });*/
});