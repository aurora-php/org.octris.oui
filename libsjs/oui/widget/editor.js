/**
 * Editor widget. Provides integration for the CodeMirror editor component.
 * 
 * @octdoc      c:widget/editor
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('editor' in oui.widget) return;

    /**
     * Constructor.
     *
     * @octdoc      editor/
     * @public
     * @param       string                  name            Name to set for widget.
     * @param       object                  options         Optional options for widget.
     * @return      oui.widget.editor                       Widget instance.
     */
    oui.widget.editor = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);

        /**
         * Return value of the widget.
         *
         * @octdoc      editor/getValue
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
         * @octdoc      editor/setValue
         * @public
         * @param       mixed           value               Value to set.
         */
        this.setValue = function(value)
        /**/
        {
            this.editor.setValue(value);
        }
    }

    oui.widget.editor.prototype = new oui.widget();

    oui.widget.register('editor', oui.widget.editor);

    /**
     * CSS class of editor.
     *
     * @octdoc      editor/cssclass
     * @public
     * @var         string
     */
    oui.widget.editor.prototype.cssclass = 'oui_editor';
    /**/

    /**
     * Event handler for cursor activity.
     * 
     * @octdoc      editor/onClick
     */
    oui.widget.editor.prototype.onCursorActivity = function(node) {
        return true;
    }

    /**
     * Build editor widget and attach it to a parent node.
     *
     * @octdoc      editor/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.editor.prototype.attach = function(parent, def)
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
