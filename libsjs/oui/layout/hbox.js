/**
 * Hbox layout container.
 *
 * @octdoc      widget/hbox
 * @copyright   copyright (c) 2014 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('hbox' in oui) return;
    
    /**
     * Constructor.
     *
     * @octdoc      hbox/
     * @public
     * @param       string      name            Name to set for widget.
     * @param       object      options         Optional options for widget.
     * @return      oui.widget.hbox             Widget instance.
     */
    oui.widget.hbox = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);
    }

    oui.widget.hbox.prototype = new oui.widget();

    oui.widget.register('hbox', oui.widget.hbox);

    /**
     * CSS class of a hbox.
     *
     * @octdoc      hbox/cssclass
     * @public
     * @type        string
     */
    oui.widget.hbox.prototype.cssclass = 'oui_hbox';
    /**/

    /**
     * Build hbox widget and attach it to a parent node.
     *
     * @octdoc      hbox/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.hbox.prototype.attach = function(parent, def)
    /**/
    {
        var node = this.create(parent, def);

        this.processChildren(def, function(parent, instance, def) {
            var row;
            
            parent.append(row = oui.dom.create('div'));

            row.css('box-flex', 1);

            console.log('blox-flex');
        
            instance.attach(row, def);
        }, node);
    }
})();
