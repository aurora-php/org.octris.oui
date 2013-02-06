/**
 * Grid widget.
 *
 * @octdoc      widget/grid
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('grid' in oui) return;
    
    /**
     * Constructor.
     *
     * @octdoc      grid/
     * @public
     * @param       string      name            Name to set for widget.
     * @param       object      options         Optional options for widget.
     * @return      oui.widget.grid                    Widget instance.
     */
    oui.widget.grid = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);
    }

    oui.widget.grid.prototype = new oui.widget();

    oui.widget.register('grid', oui.widget.grid);

    /**
     * Container type of a button.
     *
     * @octdoc      grid/container
     * @public
     * @var         string
     */
    oui.widget.grid.prototype.container = 'TABLE';
    /**/

    /**
     * CSS class of a grid.
     *
     * @octdoc      grid/cssclass
     * @public
     * @var         string
     */
    oui.widget.grid.prototype.cssclass = 'oui_grid';
    /**/

    /**
     * Method get's called for each row rendered.
     *
     * @octdoc      grid/onRenderRow
     * @public
     * @ 

    /**
     * Build grid widget and attach it to a parent node.
     *
     * @octdoc      grid/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.grid.prototype.attach = function(parent, def)
    /**/
    {
        var node = this.create(parent, def);

        var width = ('width' in def && def['width'] instanceof Array
                     ? def['width'] 
                     : []);
        var cols  = ('columns' in def
                     ? def['columns']
                     : 1);
           
        // render
        var part = node.append(oui.dom.create('TBODY'));
        var rows = Math.ceil(def['children'].length / cols);
        var row  = 0;
        var i    = 0;
        var me   = this;
        var tr;

        this.processChildren(def, function(parent, instance, def) {
            var cell = (i % cols);
            var td;
        
            if (cell == 0) {
                ++row;
                tr = oui.dom.create('TR');
            
                me.onRenderRow(row, tr);
            }
        
            td = oui.dom.create('TD', {
                'valign': 'top'
            });
        
            if (cell in width) {
                td.attr('width', width[cell] + '%');
            }
        
            me.onRenderCell(row, (cell + 1), td);
        
            tr.append(td);
        
            parent.append(tr);

            instance.attach(td, def);

            ++i;
        }, part);
    }
})();
