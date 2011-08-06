var BingSearch = new Class({

    //implements
    Implements: [Options,Events],

    //options
    options: {

         appid: 'B59F3913692A46D75ED39BA8F472DF267E24B611'
       /*onRequest: $empty,
         onComplete: $empty*/ 
    },

    initialize: function(options) {

          this.setOptions(options); 
          this.f    = $('bingform'),
          this.send = $('send'),
          this.q    = $('q'),
          this.resultscontainer = $('results');

          //attach event handlers
          this.attachListener();
    },

    attachListener: function() {

          //add handler for event delegation
          this.resultscontainer.addEvent('click', this.callRelatedSearch.bind(this));

          //if the form exists and the box results and send and query then 
          if(this.f && this.resultscontainer && this.send && this.q) {

             //attach event submit handler
             this.f.addEvent('submit', this.get.bind(this));
          }

    }, 

    get: function(event) {

          //stop propagation
          event.stop(); 

          this.send.set("value", "Loading...");

          var searchterm = this.q.get("value");

          var url = 'http://api.bing.net/json.aspx?' + 
                    'AppId=' + this.options.appid +
                    '&Query=' + encodeURIComponent(searchterm) + 
                    '&Version=2.0' + 
                    '&Sources=Web+RelatedSearch' + 
                    '&JsonType=callback';

          new Request.JSONP({
              url: url,
              callbackKey: 'JsonCallback',
              onRequest: this.fireEvent('request',[searchterm,url]),
              onComplete: function(o) {
                  this.bingResults(o);
              }.bind(this)
          }).send();
    },

    bingResults: function(o) {

              this.send.value = 'Go!';
              var out = '';

              if(o.SearchResponse.Errors === undefined) {

                out = '<h2>Results</h2>' + 
                          '<div class="yui-gc">' + 
                          '<div class="yui-u first">' + 
                          this.renderWeb(o) +  
                          '</div>' +
                          '<div class="yui-u" id="related">' + 
                          this.renderRelated(o) + 
                          '</div>' + 
                          '</div>'; 

              } else {

                out = '<div class="error"><h2>Error</h2>' +
                      '<p>'+ o.SearchResponse.Errors[0].Message +'</p>' +
                      '</div>';
              }

              this.resultscontainer.innerHTML = out;

              if(undefined !== this.resultscontainer.getElementsByTagName("a")[0]) {
                 this.resultscontainer.getElementsByTagName("a")[0].focus();
              } 

              this.fireEvent('complete');
    },

    renderWeb: function(o) {

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

    },

    renderRelated: function(o) {

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
    },

    callRelatedSearch: function(event) {

            var target = event.target;
            var fs = 'http://www.bing.com/search?q=';

            if(target.nodeName.toLowerCase() === 'a' && 
                  target.getAttribute('href').indexOf(fs) !== -1) {
                  this.q.value = target.getAttribute('href').replace(fs,''); 
                  this.get(event);
                  event.stop();
            }
    }
});
 