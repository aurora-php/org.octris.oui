/**
 * Single line input widget.
 * 
 * @octdoc      c:widget/textline
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('textline' in oui) return;
    
    /**
     * Constructor.
     *
     * @octdoc      textline/
     * @public
     * @param       string          name            Name to set for widget.
     * @param       object          options         Optional options for widget.
     * @return      oui.textline                    Widget instance.
     */
    oui.textline = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);
        
        /**
         * Return value of a widget.
         *
         * @octdoc      widget/getValue
         * @public
         * @return      null|mixed
         */
        this.getValue = function()
        /**/
        {
            return this.getNode().attr('value');
        }

        /**
         * Set value for a widget.
         *
         * @octdoc      widget/setValue
         * @public
         * @param       mixed           value               Value to set.
         */
        this.setValue = function(value)
        /**/
        {
            this.getNode().attr('value', value);
        }
    }

    oui.textline.prototype = new oui.widget();

    oui.widget.register('textline', oui.textline);

    /**
     * Container type of a textline.
     *
     * @octdoc      textline/container
     * @public
     * @var         string
     */
    oui.textline.prototype.container = 'INPUT';
    /**/

    /**
     * CSS class of a textline.
     *
     * @octdoc      textline/cssclass
     * @public
     * @var         string
     */
    oui.textline.prototype.cssclass = 'oui_textline';
    /**/

    /**
     * Disable textline widget.
     *
     * @octdoc      textline/onDisable
     */
    oui.textline.prototype.onDisable = function() {
        this.getNode().attr('disabled', true);
    }

    /**
     * Called when value of textline changes.
     *
     * @octdoc      textline/onChange
     */
    oui.textline.prototype.onChange = function() {
    }

    /**
     * Build textline widget and attach it to a parent node.
     *
     * @octdoc      textline/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.textline.prototype.attach = function(parent, def)
    /**/
    {
        if (!('type' in def)) {
            def['type'] = 'text';
        } else if (def['type'] != 'text' && def['type'] != 'hidden' && def['type'] != 'password') {
            def['type'] = 'text';
        }

        if (!('value' in def)) {
            def['value'] = '';
        }

        var node = this.create(parent, def);

        var me = this;

        node.on('change', function() {
            me.onChange(node.attr('value'));
        });
        node.on('click', function() {
            me.onClick();
        })
    }
})();
