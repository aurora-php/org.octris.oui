/**
 * OUI core library.
 *
 * @octdoc      core/oui
 * @copyright   copyright (c) 2012 by Harald Lapp
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
     * @see     http://stackoverflow.com/a/105074/85582
     * @return  string                              The generated Id.
     */
    oui.getUUID = (function()
    /**/
    {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        
        return function() {
            return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
        }
    })();
})(window);

