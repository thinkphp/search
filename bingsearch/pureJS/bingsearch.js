  //show me love to the Module Pattern
  //Create a Namespace Object
  //Assign the return value of an anonymous function to your namespace object.
  var bingsearch = function(){

      //private vars
      var f, 
          resultscontainer, 
          send, 
          q, 
          appid = 'B59F3913692A46D75ED39BA8F472DF267E24B611';

      //@private method
      function init() {

          //get element form
          f    = document.getElementById('bingform'),
          //get send button
          send = document.getElementById('send'),
          //get input element
          q    = document.getElementById('q'),
          //get container element
          resultscontainer = document.getElementById('results');

          //attach listener to the click event
          addEvent(resultscontainer,'click', bingsearch.related, false);

          //if the form exists then attach listener to the submit event
          if(f && resultscontainer && send && q) {
             addEvent(f,'submit', bingsearch.get, false); 
          }
      }

      //@private method
      //@param (Event Object) event
      function get(event) {

          //prevent propagation
          cancelClick(event);
          
          send.value = "Loading...";
          var searchterm = q.value;
          var url = 'http://api.bing.net/json.aspx?' + 
                    'AppId=' + appid +
                    '&Query=' + encodeURIComponent(searchterm) + 
                    '&Version=2.0' + 
                    '&Sources=Web+RelatedSearch' + 
                    '&JsonType=callback' + 
                    '&JsonCallback=bingsearch.success';

          var s = document.createElement('script');
              s.setAttribute('type','text/javascript');  
              s.setAttribute('src',url);
              s.setAttribute('id','leach');
              document.getElementsByTagName('head')[0].appendChild(s);           
      };

      //@private method
      //@param Object o - the response from BING service JSON
      function bingresults(o) {

              send.value = 'Go!';
              var out = '';
              var old = document.getElementById('leach');
              if(old) {
                  old.parentNode.removeChild(old); 
              } 

              if(o.SearchResponse.Errors === undefined) {

                out = '<h2>Results</h2>' + 
                      '<div class="yui-gc">' + 
                       '<div class="yui-u first">'+
                         renderWeb(o) +  
                       '</div>' +
                       '<div class="yui-u" id="related">' + 
                         renderRelated(o) + 
                       '</div>' + 
                      '</div>'; 

              } else {

                out = '<div class="error"><h2>Error</h2>' +
                      '<p>'+ o.SearchResponse.Errors[0].Message +'</p>' +
                      '</div>';
              }

              resultscontainer.innerHTML = out;

              if(undefined !== resultscontainer.getElementsByTagName("a")[0]) {
                 resultscontainer.getElementsByTagName("a")[0].focus();
              } 
      };

      //@private method
      function renderWeb(o) {

             var out = '';
             var results = o.SearchResponse.Web.Results;
             if(undefined !== results) {
                var all = results.length;
                out += '<h3>Web Results</h3><ol>';

                   for(var i=0;i<all;i++) {
                       out += '<li><h4><a href="' + results[i].Url + '">' + results[i].Title + '</a></h4>' + 
                              '<p>' + results[i].Description +  '<span>(' + results[i].DisplayUrl + ')</span></p>';
                   }  
                out += '</ol>';
             }  
         return out;
      };

      //@private method
      //@param Object o - response data from BING service json       
      function renderRelated(o) {

            var out = '';

            if(undefined !== o.SearchResponse.RelatedSearch) {

               var related = o.SearchResponse.RelatedSearch.Results,
                   all = related.length;

                   out += '<h3>Related Searches:</h3><ul>';  

               for(var i=0;i<all;i++) {
                   out += '<li><a href="'+ related[i].Url +'">'+ related[i].Title +'</a></li>'; 
               }

                   out += '</ul>';   
            } 

        return out;
      };

      //@private method
      //@param Event event - the event click 
      function callRelatedSearch(event) {

            var target = getTarget(event);

            var fs = 'http://www.bing.com/search?q=';

            if(target.nodeName.toLowerCase() === 'a' && 
                  target.getAttribute('href').indexOf(fs) !== -1) {
                  q.value = target.getAttribute('href').replace(fs,''); 
                  get(event);
                  cancelClick(event);
            }
      };

           /**           
            *  @private
            *  This method allows the registration of event listeners on the event target
            *
            *  @param elem      (HTMLElement)   - HTML Element DOM
            *  @param evType    (DOMString)     - The Event Type for which the user is registering => ex:'click|mouseover|mouseout|resize'.
            *  @param fn        (Function)      - Listener takes an interface implemented by the user whick contains the method to be called when the event occurs. 
            *  @param useCapture(Boolean)       - If true, useCapture indicates that the user wishes to initiate capture.
            *  @return void.
            */  
           var addEvent = (function(){

               if(window.addEventListener) {

                  return function(elem,evType,fn,useCapture) {

                         if(elem && elem.nodeName || elem == window) {
                            return elem.addEventListener(evType, fn, useCapture);
                         } else if(elem && elem.length) {
                            for(var i=0;i<elem.length;i++) {
                                addEvent(elem[i],evType, fn, useCapture);
                            }
                         }
                  }

               } else if(window.attachEvent) {

                  return function(elem, evType, fn) {

                         if(elem && elem.nodeName || elem == window) {

                            return elem.attachEvent('on' + evType, function(){ return fn.call(elem, window.event) });

                         } else if(elem && elem.length) {

                            for(var i=0;i<elem.length;i++) {

                                addEvent(elem[i],evType,fn,useCapture);
                            }
                         }
                  }  
               }

           }());

           /*
            * @private method
            * @param event (Event) 
            */
           var cancelClick = function(event) {

               if(window.event) {
                  window.event.returnValue = false;
                  window.event.cancelBubble = true; 
               }

               if(event && event.stopPropagation && event.preventDefault) {
                  event.stopPropagation();
                  event.preventDefault();
               }
           };

           /*
            * @private method
            * @param event (Event) 
            */
           var getTarget = function(event) {

               var target = window.event ? window.event.srcElement : event ? event.target : null;

                   while(target.nodeType != 1 && target.nodeName.toLowerCase() != 'body') {
                         target = target.parentNode;
                   }
                   if(!target) {
                       return
                   } 
              return target;  
           }          

      //return an object with (property: value[function]); 
      return {init   : init,
              get    : get,
              success: bingresults,
              related: callRelatedSearch};

  }();//the parens here cause the anonymous function to execute and return;

  bingsearch.init();