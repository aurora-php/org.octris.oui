/**
 * Checkbox group.
 * 
 * @octdoc      c:widget/checkbox
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('checkbox' in oui) return;
    
    /**
     * Constructor.
     *
     * @octdoc      checkbox/
     * @public
     * @param       string      name            Name to set for widget.
     * @param       object      options         Optional options for widget.
     * @return      oui.checkbox                Widget instance.
     */
    oui.checkbox = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);

        this.items = {};
    }

    oui.checkbox.prototype = new oui.widget();

    oui.widget.register('checkbox', oui.checkbox);

    /**
     * CSS class of a checkbox.
     *
     * @octdoc      checkbox/cssclass
     * @public
     * @var         string
     */
    oui.checkbox.prototype.cssclass = 'oui_checkbox';
    /**/

    /**
     * Build checkbox widget and attach it to a parent node.
     *
     * @octdoc      checkbox/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.checkbox.prototype.attach = function(parent, def)
    /**/
    {
        if (!('items' in def)) return;
    
        var node = this.create(parent, def);

        var id = oui.getUUID();
        var me = this;
    }
})();
