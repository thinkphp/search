/*
 * GIB.js: a Small, powerful JavaScript library
 * copyright Adrian Statescu 2011 (@thinphp)
 * http://thinkphp.ro
 * MIT License
 */

        if(typeof GIB === "undefined" || !GIB) {

           GIB = {};
        }

        GIB.util = {};

        GIB.util.Script = (function() {

          return {Script: function(url,callback){

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
           }} 
        })();
        

        GIB.util.Request = function(method, url, async) {

        }

        GIB.util.Dom = function() {

        }

        GIB.util.Event = (function() {

             return {    

                  addListener: function(elem,evType,fn,useCapture) {
                        if(elem.addEventListener) {
                           return elem.addEventListener(evType,fn,useCapture); 
                        } else if(elem.attachEvent) {
                          return elem.attachEvent('on'+evType,fn);   
                        } else {
                          elem['on'+evType] = fn;
                        } 
                  },
                  cancelClick: function(event) {
                      if(window.event) {
                         window.event.returnValue = false;
                         window.event.cancelBubble = true; 
                      }         
                      if(event && event.preventDefault && event.stopPropagation) {
                         event.stopPropagation();
                         event.preventDefault();
                      }
                  },
                  getTarget: function(event) {

                     var target = window.event ? window.event.srcElement : event ? event.target : null;
 
                     while(target.nodeType != 1 && target.nodeName.toLowerCase() !== 'body') {
                           target = target.parentNode;
                     }
                     if(!target) {
                         return;
                     } 
                     return target; 
                  },

                  domReady: function(foo) {
 
                        var onreadystatechange = 'onreadystatechange',
                            addEventListener = 'addEventListener',
                            attachEvent = 'attachEvent', 
                            domContentLoaded = 'DOMContentLoaded',
                            fn, f = false, fns = [], doc = document,i,
                            loaded = /^loade|c/.test(doc.readyState);

                        var flush = function() {
                            loaded = 1; 
                            while(i = fns.shift()) {
                                  i(); 
                            }
                        } 

                            doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function(){

                                   window.removeEventListener(domContentLoaded, fn, f);
                                   flush();
                            }, f);


                            doc[attachEvent] && doc[attachEvent](onreadystatechange, fn = function(){

                                   if(/^com/.test(doc.readyState)) { 
                                      window.detachEvent(domContentLoaded, fn);
                                      flush();
                                   }
                            });


                            (function(){
                              loaded ? foo() : fns.push(foo);  
                            })();
                  },

                  ID: function(id) {return document.getElementById(id);}
             }
        })();

