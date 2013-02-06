/**
 * Vbox widget.
 *
 * @octdoc      widget/vbox
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('vbox' in oui) return;
    
    /**
     * Constructor.
     *
     * @octdoc      vbox/
     * @public
     * @param       string      name            Name to set for widget.
     * @param       object      options         Optional options for widget.
     * @return      oui.widget.vbox                  	Widget instance.
     */
    oui.widget.vbox = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);
    }

    oui.widget.vbox.prototype = new oui.widget();

    oui.widget.register('vbox', oui.widget.vbox);

    /**
     * CSS class of a vbox.
     *
     * @octdoc      vbox/cssclass
     * @public
     * @var         string
     */
    oui.widget.vbox.prototype.cssclass = 'oui_vbox';
    /**/

    /**
     * Build vbox widget and attach it to a parent node.
     *
     * @octdoc      vbox/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.vbox.prototype.attach = function(parent, def)
    /**/
    {
        var node = this.create(parent, def);

        this.processChildren(def, function(parent, instance, def) {
            var row = parent.appendChild(oui.dom.create('div'));
        
            instance.attach(row, def);
        }, node);
    }
})();
