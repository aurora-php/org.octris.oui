/**
 * Label widget.
 * 
 * @octdoc      c:widget/label
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('label' in oui) return;
    
    /**
     * Constructor.
     *
     * @octdoc      label/
     * @public
     * @param       string      name            Name to set for widget.
     * @param       object      options         Optional options for widget.
     * @return      oui.label                   Widget instance.
     */
    oui.label = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);
    }

    oui.label.prototype = new oui.widget();

    oui.widget.register('label', oui.label);

    /**
     * Container type of a label.
     *
     * @octdoc      label/container
     * @public
     * @var         string
     */
    oui.label.prototype.container = 'LABEL';
    /**/

    /**
     * CSS class of a label.
     *
     * @octdoc      label/cssclass
     * @public
     * @var         string
     */
    oui.label.prototype.cssclass = 'oui_label';
    /**/

    /**
     * Build label widget and attach it to a parent node.
     *
     * @octdoc      label/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.label.prototype.attach = function(parent, def)
    /**/
    {
        var node = this.create(parent, def);

        node.get(0).innerHTML = ('label' in def ? def['label'] : '');
    }
})();
