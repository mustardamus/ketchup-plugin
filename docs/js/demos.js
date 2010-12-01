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
  
  
  $('<a/>', {
    'class': 'fork',
    href   : 'https://github.com/mustardamus/ketchup-plugin',
    html   : '<img src="images/forkme.png" alt="Fork Me!" />'
  }).appendTo('body');
});