/**
 * checkgroup group.
 * 
 * @octdoc      c:widget/checkgroup
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('checkgroup' in oui.widget) return;
    
    /**
     * Constructor.
     *
     * @octdoc      checkgroup/
     * @public
     * @param       string                  name            Name to set for widget.
     * @param       object                  options         Optional options for widget.
     * @return      oui.widget.checkgroup                   Widget instance.
     */
    oui.widget.checkgroup = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);

        this.items = {};
    }

    oui.widget.checkgroup.prototype = new oui.widget();

    oui.widget.register('checkgroup', oui.widget.checkgroup);

    /**
     * CSS class of a checkgroup.
     *
     * @octdoc      checkgroup/cssclass
     * @public
     * @type        string
     */
    oui.widget.checkgroup.prototype.cssclass = 'oui_checkgroup';
    /**/

    /**
     * Build checkgroup widget and attach it to a parent node.
     *
     * @octdoc      checkgroup/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.checkgroup.prototype.attach = function(parent, def)
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
                'for':      id,
                '#html':    def['items'][i]['label'],
                '#trigger': function(node) {
                    oui.$(node).disableSelection();
                }
            }));
            node.append(oui.dom.create('br'));
        }
    }
})();
