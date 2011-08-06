/*
 *
 * Sign-up for an API KEY
 * http://code.google.com/apis/loader/signup.html?url=http://thinkphp.ro&key=ABQIAAAAHFKkG2s1GKwMWvhsxH6UGhT31Sqdr1iMbgcfgd36_cHBTNb4GxTM-5GlCegdpzSsulvA2GKSzWJsmA
 *
 */
//when DOM is ready then begin
window.addEvent('domready', function(){

       var searchBox = $('q'),

           searchLoaded = false,

           handleSearch = function(){

                 if(!searchLoaded) {

                     searchLoaded = true;

                     //bulding elements

                     var container = new Element('div',{id: 'search-results',styles: {position: 'relative',width: 410}}).inject($('searchHolder','after'));

                     var wrapper = new Element('div',{
                         styles: {
                               position: 'relative'
                         }
                     }).inject(container);

                     new Element('div',{id: 'search-results-pointer'}).inject(wrapper);

                     var contentContainer = new Element('div',{id: 'search-results-content'}).inject(wrapper); 

                 }//endif


                 //create close button
                 var close = new Element('a',{
                     href: 'javascript:;',
                     text: 'Close',
                     styles: {
                          position: 'absolute',
                          bottom: 35,
                          right: 10
                     },
                     events: {
                         'click': function() {
                             container.fade(0);
                         } 
                     }  
                 }).inject(wrapper); 
                

                 //google interaction API

                 var search = new google.search.WebSearch(),
                     control = new google.search.SearchControl(),

                     options = new google.search.DrawOptions();    
                     options.setDrawMode(google.search.SearchControl.DRAW_MODE_TABBED);
                     options.setInput(searchBox);

                     search.setUserDefinedClassSuffix('siteSearch');
                     search.setSiteRestriction('davidwalsh.name');
                     search.setLinkTarget(google.search.Search.LINK_TARGET_SELF);

                     control.addSearcher(search); 
                     //inject the search google control in contentContainer
                     control.draw(contentContainer,options);
                     control.setNoResultsString('No results were found.');

                     //add listener
                     searchBox.addEvents({
                           keyup: function(event) {
                                  if(searchBox.value && searchBox.value != searchBox.get('placeholder')) {
                                    container.fade(0.9); 
                                    control.execute(searchBox.value);    
                                  } else {
                                    container.fade(0); 
                                  }
                           }  
                     });

                    searchBox.removeEvent('focus', handleSearch);
           };


          searchBox.addEvent('focus', handleSearch);
});