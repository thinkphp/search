var BingSearch = new Class({

    //implements
    Implements: [Options,Events],

    //options
    options: {
         form   : 'bingform',
         submit : 'send',
         q      : 'q',
         results: 'results',
         appid: 'B59F3913692A46D75ED39BA8F472DF267E24B611'
       /*onRequest: $empty,
         onComplete: $empty*/ 
    },
    //constructor of class initialize
    initialize: function(options) {

          //if options then mixin
          if(options) {this.setOptions(options);}
           
          //hold in property 'f' the form Element
          this.f    = document.id(this.options.form);

          //hold in property 'send' the submit Element
          this.send = document.id(this.options.submit);

          //hold in property 'q' the input Element
          this.q    = document.id(this.options.q);

          //retains in property 'resutlscontainer' the result Element div
          this.resultscontainer = document.id(this.options.results);

          //attach event handlers
          this.attachListener();

          //focus on input element
          this.q.focus();  
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
          if(event) event.stop(); 

          this.send.set("value", "Loading...");

          var searchterm = this.q.get("value"); 

          window.bingResults = this.bingResults.bind(this);

          var url = 'http://api.bing.net/json.aspx?' + 
                    'AppId=' + this.options.appid +
                    '&Query=' + encodeURIComponent(searchterm) + 
                    '&Version=2.0' + 
                    '&Sources=Web+RelatedSearch' + 
                    '&JsonType=callback' + 
                    //'&JsonCallback=BingSearch.request.bs';
                    '&JsonCallback=bingResults';

          this.fireEvent('request',[searchterm,url]);

          this.loadScript(url, function(){});
    },

    bingResults: function(o) {

              if(window.console) {
                 console.log(o);
              } 

              this.send.set('value','Go!');

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

               var related = o.SearchResponse.RelatedSearch.Results;

               var all = related.length;

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
    },

    loadScript: function(url, callback) {
 
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
});

var bs = new BingSearch();

//BingSearch.request = {bs: bs.bingResults.bind(bs)};

bs.addEvent('request', function(){
   if(window.console && console.log) console.log('Requesting...');
});
bs.addEvent('complete', function(){
   if(window.console && console.log) console.log('The request has been completed');
});


 