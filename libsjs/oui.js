/**
 * OUI core library.
 *
 * @octdoc      core/oui
 * @copyright   copyright (c) 2012-2014 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function(window) {
    if ('oui' in window) return;

    var oui = {};
    oui.$ = jQuery.noConflict();

    window.oui = oui;

    /**
     * Create a "UUID".
     *
     * @octdoc  m:oui/getUUID
     * @see     http://stackoverflow.com/a/2117523/85582
     * @return  string                              The generated Id.
     */
    oui.getUUID = function()
    /**/
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    /**
     * Builds a proxy for a callback, see example for details.
     * 
     * @octdoc  m:oui/proxy
     * @param   callback                cb          Callback to create proxy for.
     * @return  callback                            Created proxy callback.
     * @example
     * 
     *          var t1 = proxy(function() {
     *              return new function() {
     *                  console.log('t1 build');
     *                  this.test = function() {
     *                      console.log('t1 test');
     *                  }
     *              };
     *          });
     *          var t2 = proxy(function() {
     *              return new function() {
     *                  console.log('t2 build');
     *                  this.test = function() {
     *                      console.log('t2 test');
     *                  }
     *              };
     *          });
     *
     *          t1().test(); t1().test();
     *          t2().test(); t2().test();
     */
    oui.proxy = function(cb)
    /**/
    {
        return (function() {
            var storage = null;

            return function() {
                if (storage === null) {
                    var args = [].splice.call(arguments, 0);        // hack, because 'arguments' is not a _real_ javascript array

                    storage = cb.apply(window, args);
                }

                return storage;
            }     
        })();
    }
    
    /*
     * misc jquery plugins
     */
    
    /**
     * Prevent text selection.
     */
    (function($){
        $.fn.disableSelection = function() {
            return this.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
        };
    })(oui.$);
})(window);
