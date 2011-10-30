/**
 * Core Javascript Library.
 *
 * @octdoc      c:core/oui
 * @copyright   copyright (c) 2011 by Harald Lapp
 * @author      Harald Lapp <harald.lapp@gmail.com>
 */
/**/

window.oui = window.oui || {};

;(function() {
    if (oui && '_oui_version' in oui) return

    var userAgent = navigator.userAgent.toLowerCase();          // useragent identification

    oui = {
        /**
         * Version information of oui library.
         *
         * @octdoc      c:oui/_oui_version
         */
        _oui_version: '0.1',
        /**/

        /**
         * Simple browser detection.
         *
         * @octdoc      c:oui/browser
         */
        browser: {
            'version':  (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
            'safari':   (/webkit/.test(userAgent)),
            'opera':    (/opera/.test(userAgent)),
            'msie':     (/msie/.test(userAgent) && !(/opera/.test(userAgent))),
            'msie6':    false /*@cc_on || @_jscript_version < 5.7 @*/,
            'mozilla':  (/mozilla/.test(userAgent) && !(/(compatible|webkit)/.test(userAgent)))
        },
        /**/

        /**
         * Generate a "uniq" Id in the form of 'oui_[prefix]n' where 'prefix' is the optionally specified
         * string and 'n' is a increasing number.
         *
         * Example:
         *
         *      oui.getUniqId('test_')    ->      'oui_test_1'
         *
         * @octdoc  m:oui/getUniqId
         * @param   string              prefix              Optional prefix to add before the number.
         * @return  string                                  Generated uniq Id.
         */
        getUniqId: (function()
        /**/
        {
            var id = 0;

            return function(prefix) {
                prefix = prefix || '';

                return 'oui_' + prefix + (++id);
            }
        })(),

        /**
         * Builds a proxy for a callback. A proxy is a construct which wraps a specified callback inside
         * a caller function. The caller function calls the wrapped callback only the first time, the caller
         * function is called. At the next call, the caller function will return always only the result of
         * the first call the the specified callback.
         *
         * Examples:
         *
         *      var t1 = oui.proxy(function() {
         *      return new function() {
         *          console.log('t1 build');
         *          this.test = function() {
         *              console.log('t1 test');
         *          }
         *      };
         *      });
         *      var t2 = oui.proxy(function() {
         *      return new function() {
         *          console.log('t2 build');
         *          this.test = function() {
         *              console.log('t2 test');
         *          }
         *      };
         *      });
         *
         *      t1().test(); t1().test();
         *      t2().test(); t2().test();
         *
         * @octdoc  m:oui/proxy
         * @param   callback            cb                  A valid callback to wrap.
         */
        proxy: function(cb)
        /**/
        {
            return (function() {
                var stored = null;

                return function() {
                    if (stored === null) {
                        var args = [].splice.call(arguments, 0);    // hack, because 'arguments' is not a _real_ javascript array

                        stored = cb.apply(window, args);
                    }

                    return stored;
                }
            })();
        },
        
        /**
         * Extends an object by the properties of some other object.
         *
         * @octdoc  m:oui/extend
         * @param   object      dst         Object to extend.
         * @param   object      src         Properties to extend object with.
         * @return  object                  Extended object.
         */
        extend: function(dst, src)
        /**/
        {
            dst = (typeof dst != 'object'
                    ? {}
                    : dst);
            
            if (typeof src != undefined) {
                for (var i in src) {
                    dst[i] = src[i];
                }
            }

            return dst;
        }
    }
})();