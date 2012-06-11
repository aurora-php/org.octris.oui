/**
 * Handles layer objects with z-index -- moving objects between foreground and background.
 *
 * @octdoc      dom/layer
 * @copyright   copyright (c) 2010-2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('layer' in oui.dom) return;

    var stack = {};
    var min   = 50000;

    /*
     * rearrange layers by manipulating z-index
     */
    function rearrange() {
        var z = min;

        for (var s in stack) {
            for (var i = 0, len = stack[s].nodes.length; i < len; ++i) {
                stack[s].nodes[i].css('z-index', z++);
            }
        }
    }

    /**
     * Constructor.
     *
     * @octdoc      layer/
     */
    oui.dom.layer = function()
    /**/
    {
        this.id = oui.getUUID();
    }

    /**
     * Register a set of layers.
     *
     * @octdoc      layer/push
     * @param       Array       nodes           Array of nodes to register.
     */
    oui.dom.layer.prototype.push = function(nodes)
    /**/
    {
        var me = this;

        stack[this.id] = {'id': this.id, 'nodes': nodes};

        rearrange();

        this.up = function() {
            // overwrite this.up to get nodes into moved stack position
            delete(stack[me.id]);

            stack[me.id] = {'id': me.id, 'nodes': nodes};

            rearrange();
        }
    }

    /**
     * Push layers up in stack.
     *
     * @octdoc      layer/up
     */
    oui.dom.layer.prototype.up = function()
    /**/
    {
        // dummy method, get's implemented on instance creation in constructor
    }

    /**
     * Remove layers from stack.
     *
     * @octdoc      layer/pop
     */
    oui.dom.layer.prototype.pop = function()
    /**/
    {
        delete(stack[this.id]);

        rearrange();

        for (var i in this) delete(this[i]);
    }
})();

