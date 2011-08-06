/**
 *
 *  Plugin GoogleSearch MooTools
 *  @author Adrian Statescu (http://thinkphp.ro) @thinkphp
 *
 */
var GoogleSearch = new Class({

    Implements: [Options,Events],

    options: {
       form: 'googleform',
       submit: 'send',
       q: 'q',
       results:'results'  
    }, 

    initialize: function(options) {

          //if options then mixin
          if(options) {this.setOptions(options);}

          //get form element
          this.f    = document.id(this.options.form);
          //get submit element
          this.send = document.id(this.options.submit);
          //get query element
          this.q    = document.id(this.options.q);

          //focus on input element
          this.q.focus();

          //get container element result
          this.resultscontainer = document.id(this.options.results);

          //registering event handlers
          this.attachListeners();
    },

    attachListeners: function() {

          //if the form exists and the box results and send and query then 
          if(this.f && this.resultscontainer && this.send && this.q) {

             //attach event submit handler
             this.f.addEvent('submit', this.get.bind(this));
          }
    },

    get: function(event) {

          //stop propagation
          if(event) event.stop(); 

          //set attribute value with loading
          this.send.set("value", "Loading...");

          //get value from input text
          var searchterm = this.q.get("value"); 

          //assign var incoming to private method
          window.incoming = this.googleResults.bind(this);

          //assemble the URL for call REST
          var url = 'http://ajax.googleapis.com/ajax/services/search/web?gl=en'+
                    '&userip=&'+
                    'hl=en&'+
                    'v=1.0&'+
                    'start=0&'+
                    'rsz=8&'+
                    'callback=incoming'+
                    '&q='+searchterm;

          //fire event request
          this.fireEvent('request',[searchterm,url]);

          //call script loaded node
          this.loadScript(url, function(){});
    },

    /**
     *  @private method 
     *  callback function - incoming the data from Google REST.
     *  @param Object - the data from Google Search Web Service 
     */
    googleResults: function(o) {

          if(window.console && console.log) {
             console.log(o);  
          } 

          this.send.set('value','Go!');

                     var resultsOutput = $('results'),
                         liTemplate    = "<li><a href=\"{url}\">{title}</a><p>{content}</p></li>", 
                         markup        = '',
                         i;

                     if(o.responseStatus == 403) {

                          markup = '<ul>';
                          markup += '<li>' + o.responseDetails + '</li>';
                          markup += '</ul>'; 

                     } else {

                     if(o.responseStatus == 200 && (o.responseData.results.length == 1)) {

                          markup = '<ul>';
                          markup += liTemplate.substitute(o.responseData.results);
                          markup += '</ul>';
 
                     } else 

                     // show the results if we have them
                     if(o.responseStatus == 200 && (o.responseData.results.length > 0)) {

                          var all = o.responseData.results.length;

                          markup += '<ol>';

                          for(var i=0;i<all;i++) {

                                  markup += liTemplate.substitute(o.responseData.results[i]);
                          }

                          markup += '</ol>';

                     } else {

                          markup = "<p>No results returned.</p>";
                     }

                    }//endifelse

                 // hook the markup on the DOM now that it's complete
                 resultsOutput.set("html", markup);

                 if(resultsOutput.getElementsByTagName('a')[0]) {
                    resultsOutput.getElements('a')[0].focus(); 
                 }

                 this.fireEvent('complete',[o]);
    },

    /**
     *  @private method
     *  @param String   url      - url for REST.
     *  @param Function callback - function to execute when the data are received.
     */
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

});//end class GoogleSearch