/**
 * oui-DOM nodelist.
 *
 * @octdoc      c:dom/nodelist
 * @copyright   copyright (c) 2011 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('nodelist' in oui.dom) return;

    /*
     * Helper function to cast differen object types to an array.
     */
    function cast_to_array(nodes) {
        var ret = []

        if (typeof nodes != 'undefined' nodes instanceof Object) {
            if (nodes instanceof Array) {
                ret = nodes;
            } else if (nodes instanceof oui.dom.nodelist) {
                ret = nodes.nodes;
            } else {
                throw "wrong parameter type";
            }
        }

        return ret;
    }

    /**
     * Constructor creates an empty nodelist or a list with elements specified as
     * parameter.
     *
     * @octdoc  m:nodelist/construct
     * @param   array|oui.dom.nodelist      nodes       Optional array of nodes.
     */
    oui.dom.nodelist = function(nodes)
    /**/
    {
        var nodelist = cast_to_array(nodes);

        /**
         * Return number of nodes in the nodelist.
         *
         * @octdoc  m:nodelist/count
         * @return  int                                     Number of nodes.
         */
        this.count = function()
        /**/
        {
            return nodelist.length;
        }

        /**
         * Returns oui-DOM-node specified with number.
         *
         * @octdoc  m:nodelist/item
         * @param   int                 item                Item to return.
         * @return  bool|oui.dom.node                       Instance of node object or false.
         */
        this.item = function(item)
        /**/
        {
            return (item >= 0 && nodelist.length > item
                    ? new oui.dom.node(nodes[item])
                    : false);
        }

        /**
         * Return first oui-DOM-node or false, if no nodes are stored.
         *
         * @octdoc  m:nodelist/first
         * @return  bool|oui.dom.node                       Instance of node object or false.
         */
        this.first = function()
        /**/
        {
            return this.item(0);
        }

        /**
         * Return last oui-DOM-node in list or false, if no nodes are stored.
         *
         * @octdoc  m:nodelist/last
         * @return  bool|oui.dom.node                       Instance of node object or false.
         */
        this.last = function()
        /**/
        {
            return this.item(nodelist.length - 1);
        }

        /**
         * Concat list of nodes with stored list of nodes.
         *
         * @octdoc  m:nodelist/concat
         * @param   array|oui.dom.nodelist      nodes       Optional array of nodes.
         */
        this.concat = function(nodes)
        /**/
        {
            nodelist = nodelist.concat(cast_to_array(nodes));
        }

        /**
         * Push node into list.
         *
         * @octdoc  m:nodelist/push
         * @param   DOMNode|oui.dom.node        node        Node to push into list.
         */
        this.push = function(node)
        /**/
        {
            if (node instanceof oui.dom.node) {
                nodelist.push(oui.dom.node.toDOMNode())
            } else if (node instanceof DOMNode) {
                nodelist.push(node);
            } else {
                throw "wrong parameter type";
            }
        }

        /**
         * Iterate nodelist and call a specified callback for each element in the list
         * The specified callback may break out from the loop by returning any other
         * value than _undefined_. The return value of the callback is returned. The
         * callback will be called with two parameters:
         *
         * * oui.dom.node -- The instance of the current node.
         * * pos -- The position of the node in the nodelist (0..n).
         *
         * @octdoc  m:nodelist/forEach
         * @param   callback                    cb          Callback to call for each node.
         * @return  mixed                                   Return value of the callback.
         */
        this.forEach = function(cb)
        /**/
        {
            var r = undefined;

            for (var i = 0, len = nodelist.length; i < len; ++i) {
                if ((r = cb(new oui.dom.node(nodelist[i]), i)) !== undefined) break;
            }

            return r;
        }
    }
})();
