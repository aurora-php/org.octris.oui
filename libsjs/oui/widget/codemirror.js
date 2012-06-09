/**
 * CodeMirror integration.
 * 
 * @octdoc      c:widget/codemirror
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('codemirror' in oui) return;

    /**
     * Constructor.
     *
     * @octdoc      codemirror/
     * @public
     * @param       string      name            Name to set for widget.
     * @param       object      options         Optional options for widget.
     * @return      oui.button                  Widget instance.
     */
    oui.codemirror = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);

        /**
         * Return value of the widget.
         *
         * @octdoc      codemirror/getValue
         * @public
         * @return      null|mixed
         */
        this.getValue = function()
        /**/
        {
            return this.editor.getValue();
        }

        /**
         * Set value for the widget.
         *
         * @octdoc      codemirror/setValue
         * @public
         * @param       mixed           value               Value to set.
         */
        this.setValue = function(value)
        /**/
        {
            this.editor.setValue(value);
        }
    }

    oui.codemirror.prototype = new oui.widget();

    oui.widget.register('codemirror', oui.codemirror);

    /**
     * CSS class of codemirror.
     *
     * @octdoc      codemirror/cssclass
     * @public
     * @var         string
     */
    oui.codemirror.prototype.cssclass = 'oui_codemirror';
    /**/

    /**
     * Event handler for cursor activity.
     * 
     * @octdoc      codemirror/onClick
     */
    oui.codemirror.prototype.onCursorActivity = function(node) {
        return true;
    }

    /**
     * Build codemirror widget and attach it to a parent node.
     *
     * @octdoc      codemirror/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.codemirror.prototype.attach = function(parent, def)
    /**/
    {
        var node = this.create(parent, def);
    
        // build additional components
        var dia = this.getDialog();
        var me  = this;
    
        this.editor = new CodeMirror(node.get(0), {
            indentUnit:      4,
            tabMode:         'default',
            enterMode:       'keep',
            indentUnit:      0,
            autoMatchParens: false,
            cursorActivity:  function(node) {
                return me.onCursorActivity(node);
            }
        });
    }
})();
