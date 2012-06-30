/**
 * radiogroup group.
 * 
 * @octdoc      c:widget/radiogroup
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('radiogroup' in oui.widget) return;
    
    /**
     * Constructor.
     *
     * @octdoc      radiogroup/
     * @public
     * @param       string                  name            Name to set for widget.
     * @param       object                  options         Optional options for widget.
     * @return      oui.widget.radiogroup                   Widget instance.
     */
    oui.widget.radiogroup = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);

        this.items = {};
    }

    oui.widget.radiogroup.prototype = new oui.widget();

    oui.widget.register('radiogroup', oui.widget.radiogroup);

    /**
     * CSS class of a radiogroup.
     *
     * @octdoc      radiogroup/cssclass
     * @public
     * @var         string
     */
    oui.widget.radiogroup.prototype.cssclass = 'oui_radiogroup';
    /**/

    /**
     * Build radiogroup widget and attach it to a parent node.
     *
     * @octdoc      radiogroup/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.radiogroup.prototype.attach = function(parent, def)
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
                'type':  'radio',
                'name':  def['name'],
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
