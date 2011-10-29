/**
 * oui-DOM-node object.
 *
 * @octdoc      c:dom/node
 * @copyright   copyright (c) 2011 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

(function() {
    if ('node' in oui.dom) return;

    /*
     * helper stuff for storing node data
     */
    var data_disabled = {
        'embed': true, 'object': true, 'applet': true
    };
    var data_store = {};

    /*
     * Garbage collector to prevent circular references when removing DOM nodes:
     * reference: http://blog.xing.com/2009/06/memory_leaks_internet_explorer/
     */
    function cleanup(e) {
        var i, len, tmp = e.attributes;

        if (tmp) {
            for (i = 0, len = tmp.length; i < len; ++i) {
                if (typeof e[tmp[i].name] === 'function') {
                    e[tmp[i].name] = null;
                }
            }
        }

        if ((tmp = e.childNodes)) {
            for (i = 0, len = tmp.length; i < len; ++i) {
                cleanup(tmp[i]);
            }
        }
    }

    /*
     * Helper function to determine computed style of a nodes' property.
     */
    function getComputedStyle(node, property)
        var value = '';
        var style, i;

        if (window.getComputedStyle) {
            // mozilla, opera, etc.
            style = window.getComputedStyle(node, null);
            value = style.getPropertyValue(property);
        } else if (node.currentStyle && property.substr(0, 1) != '-') {
            // IE
            var tmp = property.split('-');
            property = tmp[0];

            for (i = 1; i < tmp.length; i++) {
                property += tmp[i].substr(0, 1).toUpperCase() + tmp[i].substr(1, tmp[i].length);
            }

            value = node.currentStyle[property];
        } else if (document.defaultView) {
            // safari, konqueror
            style = document.defaultView.getComputedStyle(node, null);
            value = style.getPropertyValue(property);
        }

        if (typeof value === 'undefined') {
            value = '';
        } else if (typeof value === 'number') {
            value = toString(value);
        }

        if (value.indexOf('rgb') > -1 && value.indexOf('rgba') < 0) {
            // convert (firefox') rgb values to #xxxxxx notation
            value = value.split('(')[1].split(')')[0].split(',');

            for (i = 0; i < 3; i++) {
                value[i] = ('0' + parseInt(value[i], 10).toString(16)).substr(-2);
            }

            value = '#' + value.join('');
        }

        if (value.substr(0, 1) == '#' && value.length == 4) {
            // handle 3-digit color notation
            value = '#' + value.substr(1, 1) + value.substr(1, 1) +
                          value.substr(2, 1) + value.substr(2, 1) +
                          value.substr(3, 1) + value.substr(3, 1);
        }

        return value;
    }

    /**
     * Constructor.
     *
     * @octdoc  m:node/construct
     * @param   DOMNode|oui.dom.node        p_node      Node to initialize
     */
    oui.dom.node = function(p_node)
    /**/
    {
        var node;

        if (p_node instanceof DOMNode) {
            node = p_node;
        } else if (p_node instanceof oui.dom.node) {
            node = oui.dom.node.toDOMNode();
        } else {
            throw "wrong parameter type";
        }

        /**
         * Redurn DOMNode stored in this instance.
         *
         * @octdoc  m:node/toDOMNode
         * @return  DOMNode                             DOMNode.
         */
        this.toDOMNode = function()
        /**/
        {
            return node;
        }

        /**
         * Cross browser implementation to return text content of a node.
         *
         * @octdoc  m:node/getTextContent
         * @return  string                              Textual content of node.
         */
        this.getTextContent = function()
        /**/
        {
            var ret = '';

            if ('textContent' in node) {
                // Gecko; Safari Nightly (Webkit)
                ret = node.textContent;
            } else if ('text' in node) {
                // IE
                ret = node.text;
            } else if (node.childNodes.length > 0 && node.firstChild.nodeType == 3) {
                // Safari v1.x, Safari v2
                ret = node.firstChild.nodeValue;
            }

            return ret;
        }

        /**
         * Return reference to iframe document root object.
         *
         * @octdoc  m:node/getContentDocument
         * @return  oui.dom.node|null                   Instance of oui-DOM-node.
         */
        this.getContentDocument = function()
        /**/
        {
            var docroot = null;

            if (node.contentDocument) {
                // mozilla
                docroot = node.contentDocument;
            } else if (node.contentWindow) {
                // IE 5.5 and up
                docroot = node.contentWindow;
            } else if (node.document) {
                // IE 5
                docroot = node.document;
            }

            return (docroot ? new oui.dom.node(docroot) : null);
        }

        /**
         * Cross browser compatible implementation of getComputedStyle.
         *
         * @octdoc  m:node/getComputedStyle
         * @param   string              property        Name of property to return computed style for.
         * @return  mixed                               Computed style.
         */
        this.getComputedStyle = function(property)
        /**/
        {
            return getComputedStyle(node, property);
        }

        /**
         * Try to determine the background color of current node. Walks up the tree from current node
         * to parents until a background color could be detected. Returns white (#ffffff) or transparent,
         * if no other background could be determined.
         *
         * @octdoc  m:node/getBackgroundColor
         * @param   bool            transparent             Return transparent instead of white in case
         *                                                  no other color could be determined.
         * @return  string                                  Determined color.
         */
        this.getBackgroundColor = function(transparent)
        /**/
        {
            transparent = (typeof transparent != 'undefined' ? !!transparent : false);

            var color       = '#ffffff';
            var obj         = node;

            do {
                tmp = getComputedStyle(obj, 'background-color');

                if (tmp.substr(0, 1) == '#') {
                    color = tmp;
                    break;
                } else if (tmp == 'transparent' && transparent) {
                    color = tmp;
                    break;
                }
            } while ((obj = obj.parentNode));

            return color;
        }

        /**
         * Return opacity of node.
         *
         * @octdoc  m:node/getOpacity
         * @return  int                                     Opactiy.
         */
        this.getOpacity = function()
        /**/
        {
            var opacity = this.getComputedStyle('opacity');

            if (opacity.indexOf('%') >= 0) {
                opacity = parseInt(opacity, 10);
            } else if (opacity.substr(0, 1) == '.' || opacity.substr(0, 2) == '0.') {
                opacity *= 100;
            }

            return opacity;
        }

        /**
         * Return absolute x/y position of a node.
         *
         * @octdoc  m:node/getPos
         * @return  object                                  Object with properties .x and .y
         */
        this.getPos = function()
        /**/
        {
            var curleft = 0;
            var curtop  = 0;
            var obj     = node;

            if (obj.offsetParent) {
                while (obj.offsetParent) {
                    curleft += obj.offsetLeft;
                    curtop  += obj.offsetTop;

                    obj = obj.offsetParent;
                }
            } else {
                if (obj.x) curleft += obj.x;
                if (obj.y) curtop += obj.y;
            }

            return {'x': curleft, 'y': curtop};
        }

        /**
         * Check if node has a specified class assigned.
         *
         * @octdoc  m:node/hasClass
         * @param   string      classname           Name of class to check.
         * @return  bool
         */
        this.hasClass = function(classname)
        /**/
        {
            var pattern = new RegExp('\\b' + classname + '\\b', '');

            return ('className' in node && node.className.match(pattern));
        }

        /**
         * Remove specified class from node.
         *
         * @octdoc  m:node/removeClass
         * @param   string      classname           Name of class to remove.
         */
        this.removeClass = function(classname)
        /**/
        {
            if (!('className' in node)) return;

            var pattern = new RegExp('\\b' + classname + '\\b', '');

            node.className = node.className.replace(pattern, '');
        }

        /**
         * Add specified class to node but only, if it's not already assigned.
         *
         * @octdoc  m:node/addClass
         * @param   string      classname           Name of class to add.
         */
        this.addClass = function(classname)
        /**/
        {
            if (!('className' in node)) {
                node.className = classname;
            } else {
                var pattern = new RegExp('\\b' + classname + '\\b', '');

                if (!node.className.match(pattern)) {
                    node.className = (node.className !== ''
                                           ? node.className + ' ' + classname
                                           : classname);
                }
            }
        }

        /**
         * Replace a class with some other class.
         *
         * @octdoc  m:node/replaceClass
         * @param   string      classname1          Name of class to replace.
         * @param   string      classname2          Name of class to replace with.
         */
        this.replaceClass = function(classname1, classname2)
        /**/
        {
            if (!('className' in node)) return;

            var pattern = new RegExp('\\b' + classname1 + '\\b', '');

            node.className = node.className.replace(pattern, classname2);
        }

        /**
         * Set various properties of node like attributes, styles, etc.
         *
         * @octdoc  m:node/setProperties
         * @param   object      def                 Properties to set for node.
         */
        this.setProperties = function(def)
        /**/
        {
            var me = this;
            var i;

            var trigger = null;

            for (var attr in def) {
                switch (attr) {
                case '#trigger':
                    if (typeof def['#trigger'] == 'function') {
                        trigger = def['#trigger'];
                    }
                    break;
                case '#data':
                    for (i in def['#data']) {
                        this.setData(i, def['#data'][i]);
                    }
                    break;
                case '#text':
                    node.appendChild(document.createTextNode(def['#text']));
                    break;
                case '#html':
                    node.innerHTML = def['#html'];
                    break;
                case 'class':
                    // IE doesn't apply styles, if class attribute is applied through setAttribute
                    node.className = def['class'];
                    break;
                case 'styles':
                    if (typeof def['styles'] == 'object') {
                        this.setStyles(def['styles']);
                    }
                    break;
                case 'disabled':
                    node['disabled'] = !!def['disabled'];
                    break;
                case 'checked':
                    node['checked']        = !!def['checked'];
                    node['defaultChecked'] = !!def['checked']; // IE6/IE7 HACK
                    break;
                default:
                    if (attr.substr(0, 2) == 'on') {
                        // apply event handler
                        if (typeof def[attr] == 'string') {
                            // IE workaround, because setAttribute doesn't work with
                            node[attr] = (function(js) {
                                (function() {
                                    eval(js);
                                }).apply(me.node);
                            })(def[attr]);
                        } else {
                            node[attr] = def[attr];
                        }
                    } else if (typeof def[attr] != 'object') {
                        // other attributes
                        this.setAttribute(attr, def[attr], 0);
                    }
                    break;
                }
            }

            if (trigger !== null) {
                trigger(this);
            }
        }

        /**
         * Set styles for node.
         *
         * @octdoc  m:node/setStyle
         * @param   object      styles          Style definitions to set.
         */
        this.setStyles = function(styles)
        /**/
        {
            for (var i in styles) {
                this.setStyle(i, styles[i]);
            }
        }

        /**
         * Set a single style for node.
         *
         * @octdoc  m:node/setStyle
         * @param   string      name            Name of style to set.
         * @param   mixed       value           Value to set style to.
         */
        this.setStyle = function(name, value)
        /**/
        {
            switch (name) {
            case 'float':
                this.setFloat(value);
                break;
            case 'opacity':
                this.setOpacity(value);
                break;
            case 'textShadow':
                this.setTextShadow();
                break;
            default:
                node.style[name] = value;
                break;
            }
        }

        /**
         * Alias for getComputedStyle.
         *
         * @octdoc  m:node/getStyle
         * @param   string      name            Name of style to get.
         * @return  mixed                       Computed style.
         */
        this.getStyle = function(name)
        /**/
        {
            return this.getComputedStyle(name);
        }

        /**
         * Set opacity for node.
         *
         * @octdoc  m:node/setOpacity
         * @param   int         value           Opacity to set in percent.
         */
        this.setOpacity = function(value)
        /**/
        {
            var _setOpacity = [
                function() {
                    node.filter.alpha.opacity = value;
                },
                function () {
                    node.style.filter = 'alpha(opacity:' + value + ')';
                },
                function () {
                    node.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + value + ');';
                },
                function () {
                    node.style.KHTMLOpacity = (value / 100);
                },
                function () {
                    node.style.MozOpacity = (value / 100);
                },
                function () {
                    node.style.opacity = (value / 100);
                }
            ];

            for (var i = 0, len = _setOpacity.length; i < len; ++i) {
                try { _setOpacity[i](); } catch(e) {}
            }
        }

        /**
         * Add arbitrary data to node.
         *
         * @octdoc  m:node/setData
         * @param   string      name            Name to store data as.
         * @param   mixed       data            Data to store in node.
         */
        this.setData = function(name, data)
        /**/
        {
            if (node.nodeName in data_disabled) return;

            var id = '';

            if (!this.hasAttribute('_oui_node_id')) {
                id = oui.getUniqID('ouinid_');
                this.setAttribute('_oui_node_id', id);
            } else {
                id = this.getAttribute('_oui_node_id');
            }

            if (!(id in data_store)) data_store[id] = {};

            data_store[id][name] = data;
        }

        /**
         * Retrieve data assigned to node.
         *
         * @octdoc  m:node/getData
         * @param   string      name            Name of data to retrieve.
         * @return  mixed                       Data stored for node with specified name.
         */
        this.getData = function(name)
        /**/
        {
            var id;

            if (node.nodeName in data_disabled || (!(id = this.getAttribute('_oui_node_id'))) || !(id in data_store) || !(name in data_store[id])) return undefined;

            return data_store[id][name];
        }

        /**
         * Remove data from node.
         *
         * @octdoc  m:node/removeData
         * @param   string      name                Name of data to remove.
         */
        this.removeData = function(name)
        /**/
        {
            var id;

            if (node.nodeName in data_disabled || (!(id = this.getAttribute('_oui_node_id'))) || !(id in data_store) || !(name in data_store[id])) return;

            delete data_store[id][name];
        }

        /**
         * Cross browser implementation to set position float on node.
         *
         * @octdoc  m:node/setFloat
         * @param   string      value               Type of float to set.
         */
        this.setFloat = function(value)
        /**/
        {
            node.style.cssFloat   = value;
            node.style.styleFloat = value;
        }

        /**
         * Set attribute for DOM node.
         *
         * @octdoc  m:node/setAttribute
         * @param   string      name                Name of attribute to set.
         * @param   mixed       value               Value to set for attribute.
         */
        this.setAttribute = function(name, value)
        /**/
        {
            try {
                node.setAttribute(name, value);
            } catch(e) {
                if (oui.browser.msie && node.tagName.toUpperCase() == 'INPUT') {
                    switch (name.toLowerCase()) {
                    case 'name':
                        node.outerHTML = node.outerHTML.replace(/name=[a-zA-Z]+/, ' ').replace('>', ' name=' + value + '>');
                        break;
                    case 'type':
                        node.outerHTML = node.outerHTML.replace(/type=[a-zA-Z]+/, ' ').replace('>', ' type=' + value + '>');
                        break;
                    default:
                        break;
                    }
                }
            }
        }

        /**
         * Return value of attribute.
         *
         * @octdoc  m:node/getAttribute
         * @param   string      name                Name of attribute to return value of.
         * @return  mixed                           Attribute value.
         */
        this.getAttribute = function(name)
        /**/
        {
            try {
                return node.getAttribute(name);
            } catch(e) {
                return null;
            }
        }

        /**
         * Check if node has the specified attribute set.
         *
         * @octdoc  m:node/hasAttribute
         * @param   string      name                Name of attribute to check.
         * @return  bool
         */
        this.hasAttribute = function(name)
        /**/
        {
            return ('hasAttribute' in node ? node.hasAttribute(name) : this.getAttribute(name) !== null);
        }

        /**
         * Remove attribute from node.
         *
         * @octdoc  m:node/removeAttribute
         * @param   string      name                Name of attribute to remove.
         */
        this.removeAttribute = function(name)
        /**/
        {
            node.removeAttribute(name);
        }

        /**
         * Return childnodes of current node.
         *
         * @octdoc  m:node/childNodes
         * @return  oui.dom.nodelist                Nodelist of child nodes.
         */
        this.childNodes = function()
        /**/
        {
            return new oui.dom.nodelist(('children' in node && node.children.length > 0 ? node.children : []));
        }

        /**
         * Return parent node of current node.
         *
         * @octdoc  m:node/parentNode
         * @return  oui.dom.node
         */
        this.parentNode = function()
        /**/
        {
            return new oui.dom.node(node.parentNode);
        }

        /**
         * Get closest parent node with specified tag.
         *
         * @octdoc  m:node/closestNode
         * @param   string      tag             Tag of closest node to get.
         * @return  null|oui.dom.node
         */
        this.closestNode = function(tag)
        /**/
        {
            var parent;
            tag = tag.toLowerCase();

            do {
                parent = node.parentNode;
            } while (parent.tagName.toLowerCase() != tag && parent);

            return (parent ? new oui.dom.node(parent) : null);
        }

        /**
         * Return first child of current node.
         *
         * @octdoc  m:node/firstChild
         * @return  null|oui.dom.node
         */
        this.firstChild = function()
        /**/
        {
            return (node.firstChild
                    ? new oui.dom.node(node.firstChild)
                    : null);
        }

        /**
         * Swap position of nodes.
         *
         * @octdoc  m:node/swap
         * @param   DOMNode|oui.dom.node        s_node          Node to swap position with.
         */
        this.swap = function(s_node)
        /**/
        {
            var node2 = (s_node instanceof oui.dom.node
                         ? s_node.toDOMNode()
                         : s_node);

            var node3 = node.parentNode.insertBefore(document.createTextNode(''), node);
            node2.parentNode.insertBefore(node, node2);
            tmp.parentNode.insertBefore(node2, tmp);
            tmp.parentNode.removeChild(tmp);
        }

        /**
         * Move node up in DOM tree on the same nesting level.
         *
         * @octdoc  m:node/moveUp
         */
        this.moveUp = function()
        /**/
        {
            if (node.previousSibling) {
                node.parentNode.insertBefore(node, node.previousSibling);
            }
        }

        /**
         * Move node down in DOM tree on the same nesting level.
         *
         * @octdoc  m:node/moveDown
         */
        this.moveDown = function()
        /**/
        {
            var tmp = node.nextSibling;

            if (tmp && tmp.nextSibling) {
                node.parentNode.insertBefore(node, tmp.nextSibling);
            }
        }

        /**
         * Insert new node before current node.
         *
         * @octdoc  m:node/insertBefore
         * @param   DOMNode|oui.dom.node    n_node          Node to insert.
         * @return  oui.dom.node                            Instance of current node.
         */
        this.insertBefore = function(n_node)
        /**/
        {
            var node2 = (n_node instanceof oui.dom.node
                         ? n_node.toDOMNode()
                         : n_node);

            node.parentNode.insertBefore(node2, node);

            return node;
        }

        /**
         * Insert new node after current node.
         *
         * @octdoc  m:node/insertAfter
         * @param   DOMNode|oui.dom.node    n_node          Node to insert.
         * @return  oui.dom.node                            Instance of current node.
         */
        this.insertAfter = function(n_node)
        /**/
        {
            var node2 = (n_node instanceof oui.dom.node
                         ? n_node.toDOMNode()
                         : n_node);

            node.parentNode.insertBefore(node2, node.nextSibling);

            return node;
        }

        /**
         * Returns next sibling of current node.
         *
         * @octdoc  m:node/nextSibling
         * @return  oui.dom.node
         */
        this.nextSibling = function()
        /**/
        {
            return new oui.dom.node(node.nextSibling);
        }

        /**
         * Returns previous sibling of current node.
         *
         * @octdoc  m:node/previousSibling
         * @return  oui.dom.node
         */
        this.previousSibling = function()
        /**/
        {
            return new oui.dom.node(node.previousSibling);
        }

        /**
         * Returns last sibling.
         *
         * @octdoc  m:node/lastSibling
         * @return  oui.dom.node
         */
        this.lastSibling = function()
        /**/
        {
            var tmp = node.parentNode.lastChild;

            while (tmp.nodeType != 1 && tmp.previousSibling !== null) {
                tmp = tmp.previousSibling;
            }

            return (tmp.nodeType == 1 ? new oui.dom.node(tmp) : false);
        }

        /**
         * Remove node from DOM including all child nodes.
         *
         * @octdoc  m:node/removeNode
         */
        this.removeNode = function()
        /**/
        {
            cleanup(node);

            node.parentNode.removeChild(node);
        }

        /**
         * Replace node with an other node, returns old DOM node.
         *
         * @octdoc  m:node/replaceNode
         * @param   DOMNode|oui.dom.node    node        Node to replace current node with.
         * @return  DOMNode
         */
        this.replaceNode = function(n_node)
        /**/
        {
            var node2 = (n_node instanceof oui.dom.node
                         ? n_node.toDOMNode()
                         : n_node);

            node.parentNode.replaceChild(node2, node);

            return node;
        }

        /**
         * Remove all child nodes from node.
         *
         * @octdoc  m:node/removeChildren
         */
        this.removeChildren = function()
        /**/
        {
            while (node.firstChild) {
                cleanup(node.firstChild);

                node.removeChild(node.firstChild);
            }
        }

        /**
         * Append child node to current node.
         *
         * @octdoc  m:node/appendChild
         * @param   DOMNode|oui.dom.node    n_node      Node to append.
         */
        this.appendChild = function(n_node)
        /**/
        {
            var node2 = (n_node instanceof oui.dom.node
                         ? n_node.toDOMNode()
                         : n_node);

            node.appendChild(node2);

            return this;
        }
    }
})();
