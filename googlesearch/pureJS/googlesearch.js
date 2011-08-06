    /*     
    Using REST to invoke the API: http://code.google.com/apis/customsearch/v1/using_rest.html#intro
    ----------------------------------------------------------------------------------------------- 
    This module pattern is intended to write application that can interact with the JSON Custom Search API.
    You can use the JSON to retrieve Google Custom Search results programmatically.
    You can retrieve results for a particular search by sending an HTTP GET request to its URL. The URI for a search
    has the following format:
                  https://www.googleapis.com/customsearch/v1?parameters
            key - API KEY. Use the key query parameter to identify your application.
            q   - use the q query parameter to specify your query. the search expression. 
            
            All other query parameters are optinal: 
                callback   : A JS function to run when the response is received. You can specify a JS function to handle query results for pure client-side implementations.
                             define the callback function in <script> tag.
                cref       : 
                alt        : if you don't specify an alt parameter, the API returns data in the JSON format. This is equivalent to alt=json
                lr         : the language restriction for the search results. This list contains the permissible set of values: http://www.google.com/cse/docs/resultsxml.html#languageCollections
                start      : the index of the first result to return.You can set the start index of the first search result returned. If start is not used, a value of 1 is assumed.
                filter     : controls turning on or off the duplicate content filter.
                safe       : search safety level. You can specify the search safety level. Possible values are: high, medium , off.
                prettyprint: returns a response with indentations and line breaks.
                num        : number of search results to return. You can specify the how many results to return for the current search. Valid values are integers between 1 and 10, inclusive. If num is not used, a value of 10 is assumed.

   query-params: http://code.google.com/apis/customsearch/v1/using_rest.html#query-params              
      
   author : Adrian Statescu (http://thinkphp.github.com) 
   twitter: @thinkphp            
   */
  var googlesearch = function(){

      var f, 
          resultscontainer, 
          send, 
          q, 
          appid = 'B59F3913692A46D75ED39BA8F472DF267E24B611';

      function init() {

          f    = document.getElementById('bingform'),
          send = document.getElementById('send'),
          q    = document.getElementById('q'),
          resultscontainer = document.getElementById('results');
          if(f && resultscontainer && send && q) {
             addEvent(f,'submit', googlesearch.get, false);
          }
      }

      function get(event) {

          cancelClick(event);  
          
          send.value = "Loading...";
          var searchterm = q.value;
          var url = 'http://ajax.googleapis.com/ajax/services/search/web?gl=en'+
                    '&userip=&'+
                    'hl=en&'+
                    'v=1.0&'+
                    'start=0&'+
                    'rsz=8&'+
                    'callback=googlesearch.incoming'+
                    '&q='+searchterm;

          loadScript(url, function(){});
      }

      function incoming(o) {

              if(window.console) { 
                 console.log(o);//for debug
              }

              send.value = 'Go!';
              var out = '';

              if(o.responseStatus == 200) {

                out = '<h2>Results</h2>' + 
                          '<div>' + 
                          renderWeb(o) +  
                          '</div>'; 

              } else {

                out = '<div class="error"><h2>Error</h2>' +
                      '<p>'+ o.responseDetails +'</p>' +
                      '</div>';
              }

              resultscontainer.innerHTML = out;

              if(undefined !== resultscontainer.getElementsByTagName("a")[0]) {
                 resultscontainer.getElementsByTagName("a")[0].focus();
              } 
      }

      function renderWeb(o) {

             var out = '';
             var results = o.responseData.results;
             if(undefined !== results) {
                var all = results.length;
                out += '<h3>Web Results</h3><ol>';
                   for(var i=0;i<all;i++) {
                       out += '<li><h4><a href="' + results[i].url + '">' + results[i].title + '</a></h4>' + 
                              '<p>' + results[i].content +  '<span>(' + results[i].url + ')</span></p>';
                   }  
                out += '</ol>';
             }  
         return out;
      }


      var addEvent = (function(){

          if(window.addEventListener) {
             return function(elem,evType,fn,useCapture) {
                    elem.addEventListener(evType,fn,useCapture);
             }
          } else if(window.attachEvent) {
             return function(elem,evType,fn) {
                    var r = elem.attachEvent('on'+evType,fn);
                return r;
             }
          } 
      })();

      var cancelClick = function(event) {

          if(window.event) {
             window.event.returnValue = false;
             window.event.cancelBubble = true;   
          }

          if(event && event.preventDefault && event.stopPropagation) {
             event.preventDefault();
             event.stopPropagation();
          }
      }

      function loadScript(url, callback) {

            var s = document.createElement('script');
                s.setAttribute('type','text/javascript');
                s.setAttribute('src',url);
                s.setAttribute('id','leach');

                if(s.readyState) {

                   s.onreadystatechange = function() {
                     if(s.readyState == "loaded" || 
                              s.readyState == "complete") {
                        s.onreadystatechange = null;
                        callback(s); 
                        var old = document.getElementById('leach');
                        if(old) {
                           old.parentNode.removeChild(old); 
                        } 
                     }
                   }

                } else {

                  s.onload = function(){
                    callback(s);
                        var old = document.getElementById('leach');
                        if(old) {
                           old.parentNode.removeChild(old); 
                        } 
                  } 
                } 

                document.getElementsByTagName("head")[0].appendChild(s);
      }

      return {init   : init,
              get    : get,
              incoming: incoming};
  }();
  googlesearch.init();