/**
 * OUI DOM library.
 *
 * @octdoc      oui/dom
 * @copyright   copyright (c) 2010-2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('dom' in oui) return;

    oui.dom = {};

    /**
     * Create DOM construct.
     *
     * @octdoc      dom/create
     * @param       string          tag             Name of tag to create.
     * @param       object          def             Definition of DOM construct to create.
     * @return      DOMElement                      Created DOM Node.
     */
    oui.dom.create = function(tag, def) {
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

        function _set_properties(node, def) {
            var trigger = null;
            var name, evt;

            for (var attr in def) {
                console.log(attr, def);

                switch (attr) {
                    case 'children':
                        continue;
                    case '#trigger':
                        if (typeof def[attr] == 'function') {
                            trigger = def[attr];
                        }
                        break;
                    case '#html':
                        node.append(def[attr]);
                        break;
                    case '#text':
                        node.append(document.createTextNode(def[attr]));
                        break;
                    case '#data':
                        for (name in def[attr]) {
                            node.data(name, def[attr][name]);
                        }
                        break;
                    case 'class':
                    case 'className':
                        node.attr('className', def[attr]);
                        break;
                    case 'styles':
                    case 'css':
                        node.css(def[attr]);
                        break;
                    default:
                        if (attr.substr(0, 2) == 'on') {
                            evt = attr.substr(2);

                            if (typeof def[attr] == 'string') {
                                node.bind(evt, (function(js) {
                                    var cb = function() {
                                        eval(js);
                                    };

                                    cb.apply(node);
                                })(def[attr]));
                            } else if (typeof def[attr] == 'function') {
                                node.bind(evt, def[attr]);
                            }
                        } else {
                            node.attr(attr, def[attr]);
                        }
                }
            }

            if (trigger != null) {
                trigger(node);
            }
        }

        function _build(tag, def) {
            var i, len, tmp;

            var node = oui.$(document.createElement(tag));
            _set_properties(node, def);

            if ('children' in def && def['children'] instanceof Array) {
                for (i = 0, len = def['children'].length; i < len; ++i) {
                    if ((tmp = _get_tag(def['children'][i])) !== '') {
                        node.append(_build(tmp, def['children'][i][tmp]));
                    }
                }
            }

            return node;
        }

        return _build(tag, def);
    }
})();

