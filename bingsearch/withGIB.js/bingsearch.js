var bingsearch = (function($,$$){

      var f, 
          resultscontainer, 
          send, 
          q, 
          appid = 'B59F3913692A46D75ED39BA8F472DF267E24B611';

      function init() {

        $.domReady(function(){
          f    = $.ID('bingform'),
          send = $.ID('send'),
          q    = $.ID('q'),
          resultscontainer = $.ID('results');
          $.addListener(resultscontainer,'click', bingsearch.related, false);
          if(f && resultscontainer && send && q) {
             $.addListener(f,'submit', bingsearch.get, false);
          }
        });
      }

      function get(event) {

          $.cancelClick(event);  
          
          send.value = "Loading...";
          var searchterm = q.value;
          var url = 'http://api.bing.net/json.aspx?' + 
                    'AppId=' + appid +
                    '&Query=' + encodeURIComponent(searchterm) + 
                    '&Version=2.0' + 
                    '&Sources=Web+RelatedSearch' + 
                    '&JsonType=callback' + 
                    '&JsonCallback=bingsearch.success';

          $$.Script(url,function(){});
      }

      function bingresults(o) {

              if(window.console) {
                 console.log(o);
              }


              send.value = 'Go!';
              var out = '';

              if(o.SearchResponse.Errors === undefined) {

                out = '<h2>Results</h2>' + 
                          '<div class="yui-gc">' + 
                          '<div class="yui-u first">' + 
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
      }

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
      }

      function renderRelated(o) {

            var out = '';

            if(undefined !== o.SearchResponse.RelatedSearch) {

               var related = o.SearchResponse.RelatedSearch.Results;
                   all = related.length;

                   out += '<h3>Related Searches:</h3><ul>';  
               for(var i=0;i<all;i++) {
                   out += '<li><a href="'+ related[i].Url +'">'+ related[i].Title +'</a></li>'; 
               }
               out += '</ul>';   
            } 

        return out;
      }

      function callRelatedSearch(event) {

            var target = $.getTarget(event);
            var fs = 'http://www.bing.com/search?q=';

            if(target.nodeName.toLowerCase() === 'a' && 
                  target.getAttribute('href').indexOf(fs) !== -1) {
                  q.value = target.getAttribute('href').replace(fs,''); 
                  get(event);
                  $.cancelClick(event);
            }
      }

      return {init   : init,
              get    : get,
              success: bingresults,
              related: callRelatedSearch};

  })(GIB.util.Event,GIB.util.Script);
    
  bingsearch.init();