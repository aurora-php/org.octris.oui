/**
 * DOM processing library.
 *
 * @octdoc      c:oui/dom
 * @copyright   copyright (c) 2011 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('dom' in oui) return;

    oui.dom = {
        /**
         * Get oui DOM node by specified phrase or by browsers' DOM node.
         * Makes use of sizzle.
         *
         * @octdoc  dom/get
         * @param   array|string|DOMNode    obj     Search phrase or DOM node
         *                                          or array of these to
         *                                          return a nodelist for
         * @param   DOMNode|oui.dom.node            Optional parent node to
         *                                          search in
         * @return  oui.dom.nodelist                List of nodes found.
         */
        get: function(obj, parent)
        /**/
        {
            var ret = new oui.dom.nodelist([]);
            
            // convert to first parameter to an array, if it is not one
            if (!(obj instanceof Array)) {
                obj = [obj];
            }
            
            // decide what to do with parent parameter
            if (typeof parent == 'undefined') {
                parent = document;
            } else if (!(parent instanceof DOMNode)) {
                if (parent instanceof oui.dom.node) {
                    parent = parent.toDOMNode();
                } else {
                    parent = document;
                }
            }

            // process first parameter
            for (var i = 0, len = obj.length; i < len; ++i) {
                if (obj[i] instanceof DOMNode) {
                    ret.push(obj[i]);
                } else if (obj[i] instanceof oui.dom.node) {
                    ret.push(obj[i].toDOMNode);
                } else {
                    ret.concat(Sizzle(obj[i], parent));
                }
            }

            return ret;
        },

        /**
         * Alias oui.dom.first.
         *
         * @octdoc  m:dom/one
         * @see     oui.dom.get
         */
        one: function(obj, parent)
        /**/
        {
            return this.first(obj, parent);
        },

        /**
         * Same as _get_ but returns first found element.
         *
         * @octdoc  m:dom/first
         * @see     oui.dom.get
         */
        first: function(obj, parent)
        /**/
        {
            return this.get(obj, parent).first();
        },

        /**
         * Same as _get_ but returns last found element.
         *
         * @octdoc  m:dom/last
         * @see     oui.dom.get
         */
        last: function(obj, parent)
        /**/
        {
            return this.get(obj, parent).last();
        },

        /**
         * Create DOM and return instance of oui.dom.node for the created
         * construct.
         *
         * @octdoc  m:dom/create
         * @param   string      tag         Tag to create node for.
         * @param   object      def         Optional definition for created
         *                                  element and child elements using
         *                                  DOM helper.
         * @return  oui.dom.node
         */
        create: function(tag, def)
        /**/
        {
            def = def || {};
            
            function _get_tag(def) {
                var tag = '';
                
                if (typeof def == 'object') {
                    for (var i in def) {
                        tag = i;
                        break;
                    }
                }
                
                return tag;
            }
            
            function _build(tag, def) {
                var i, len, tmp;

                var node = new oui.dom.node(document.createElement(tag));
                node.setProperties(def);
                
                if ('children' in def && def['children'] instanceof Array) {
                    // iterate over children
                    for (i = 0, len = def['children'].length; i < len; ++i) {
                        if ((tmp = _get_tag(def['children'][i])) !== '') {
                            node.appendChild(_build(tmp, def['children'][i][tmp]));
                        }
                    }
                }

                return node;
            }

            return _build(tag, def);
        },
        
        /**
         * Calculate width of scrollbar.
         *
         * @octdoc  m:dom/getScrollbarWidth
         * @return  int                     Width of scrollbar.
         */
        getScrollbarWidth: (function()
        /**/
        {
            var width = null;

            return function() {
                if (width === null) {
                    var inner;
                    var outer = oui.dom.one('body').appendChild(
                        oui.dom.create('div', {
                            'styles':   {
                                'position':   'absolute',
                                'top':        '0',
                                'left':       '0',
                                'visibility': 'hidden',
                                'width':      '200px',
                                'height':     '150px',
                                'overflow':   'hidden'
                            },
                            'children': [
                                {'p': {
                                    '#trigger': function(node) {
                                        inner = node;
                                    },
                                    'styles':   {
                                        'width':  '100%',
                                        'height': '200px'
                                    }
                                }}
                            ]
                        })
                    );

                    var w1 = inner.node.offsetWidth;
                    
                    outer.setStyle('overflow', 'scroll');
                    
                    var w2 = inner.node.offsetWidth;
                    
                    if (w1 == w2) w2 = outer.node.clientWidth;

                    outer.removeNode();

                    width = (w1 - w2);
                }
                
                return width;
            };
        })(),
        
        /**
         * Calculate width/height of viewport.
         *
         * @octdoc  m:dom/getViewport
         * @return  object                  .w / .h of viewport.
         */
        getViewport: function()
        /**/
        {
            var viewport = {'w': null, 'h': null};

            if (window.innerHeight != window.undefined) {
                viewport.h = window.innerHeight;
                viewport.w = window.innerWidth;
            } else if (document.compatMode == 'CSS1Compat') {
                viewport.h = document.documentElement.clientHeight;
                viewport.w = document.documentElement.clientWidth;
            } else if (document.body) {
                viewport.h = document.body.clientHeight;
                viewport.w = document.body.clientWidth;
            }

            return viewport;
        }
    }
})();
