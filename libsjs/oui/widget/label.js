/**
 * Label widget.
 * 
 * @octdoc      c:widget/label
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('label' in oui.widget) return;
    
    /**
     * Constructor.
     *
     * @octdoc      label/
     * @public
     * @param       string              name            Name to set for widget.
     * @param       object              options         Optional options for widget.
     * @return      oui.widget.label                    Widget instance.
     */
    oui.widget.label = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);
    }

    oui.widget.label.prototype = new oui.widget();

    oui.widget.register('label', oui.widget.label);

    /**
     * Container type of a label.
     *
     * @octdoc      label/container
     * @public
     * @var         string
     */
    oui.widget.label.prototype.container = 'LABEL';
    /**/

    /**
     * CSS class of a label.
     *
     * @octdoc      label/cssclass
     * @public
     * @var         string
     */
    oui.widget.label.prototype.cssclass = 'oui_label';
    /**/

    /**
     * Build label widget and attach it to a parent node.
     *
     * @octdoc      label/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.label.prototype.attach = function(parent, def)
    /**/
    {
        var node = this.create(parent, def);

        node.get(0).innerHTML = ('label' in def ? def['label'] : '');
    }
})();
