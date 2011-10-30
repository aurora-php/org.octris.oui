/**
 * Handles layer objects with z-index. Moving object between fore and
 * background.
 *
 * @octdoc      c:dom/layer
 * @copyright   copyright (c) 2011 by Harald Lapp
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
                stack[s].nodes[i].setStyle('zIndex', z++);
            }
        }
    }

    /**
     * Constructor.
     *
     * @octdoc  m:layer/construct
     */
    oui.dom.layer = function()
    /**/
    {
        this.id = oui.getUniqID('layer_');
    }

    /**
     * Register a set of layers.
     *
     * @octdoc  m:layer/push
     * @param   array       nodes       Array of oui.dom.node instances to register.
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
            stack[me.id] = {'id': me.id, 'nodes': nodes};; 
            
            rearrange(); 
        }
    }
    
    /**
     * Push layers up in stack.
     *
     * @octdoc  m:layer/up
     */
    oui.dom.layer.prototype.up = function()
    /**/
    {
    }

    /**
     * Remove layers from stack.
     *
     * @octdoc  m:layer/pop
     */
    oui.dom.layer.prototype.pop = function()
    /**/
    {
        delete(stack[this.id]); 
        
        rearrange(); 
        
        for (var i in this) delete(this[i]); 
    }
})();
