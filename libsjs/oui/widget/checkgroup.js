/**
 * checkgroup group.
 * 
 * @octdoc      c:widget/checkgroup
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('checkgroup' in oui) return;
    
    /**
     * Constructor.
     *
     * @octdoc      checkgroup/
     * @public
     * @param       string          name            Name to set for widget.
     * @param       object          options         Optional options for widget.
     * @return      oui.checkgroup                  Widget instance.
     */
    oui.checkgroup = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);

        this.items = {};
    }

    oui.checkgroup.prototype = new oui.widget();

    oui.widget.register('checkgroup', oui.checkgroup);

    /**
     * CSS class of a checkgroup.
     *
     * @octdoc      checkgroup/cssclass
     * @public
     * @var         string
     */
    oui.checkgroup.prototype.cssclass = 'oui_checkgroup';
    /**/

    /**
     * Build checkgroup widget and attach it to a parent node.
     *
     * @octdoc      checkgroup/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.checkgroup.prototype.attach = function(parent, def)
    /**/
    {
        if (!('items' in def)) return;
    
        var node = this.create(parent, def);

        var id;
        var me = this;

        for (var i = 0, len = def['items'].length; i < len; ++i) {
            id = oui.getUUID();

            node.append(oui.dom.create('input', {
                'id':    id,
                'type':  'checkbox',
                'name':  def['items'][i]['name'],
                'value': def['items'][i]['value']
            }));
            node.append(oui.dom.create('label', {
                'for':   id,
                '#html': def['items'][i]['label']
            }));
            node.append(oui.dom.create('br'));
        }
    }
})();