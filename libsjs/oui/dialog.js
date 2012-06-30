/**
 * Dialog widget.
 *
 * @octdoc      oui/dialog
 * @copyright   copyright (c) 2010-2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */

;(function() {
    if ('dialog' in oui) return;

    /**
     * Constructor.
     *
     * @octdoc      dialog/
     * @public
     * @param       string      name            Name to set for widget.
     * @param       object      options         Optional options for widget.
     * @return      oui.button                  Widget instance.
     */
    oui.dialog = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);

        /**
         * Holds references to named widgets inside of dialog.
         *
         * @octdoc      dialog/references
         * @private
         * @var         object
         */
        var references = {};
        /**/

        /**
         * Instance of label node, if dialog has a label.
         *
         * @octdoc      dialog/label
         * @private
         * @var         null|DOMElement
         */
        var label = null;
        /**/

        /**
         * Whether dialog is hidden.
         *
         * @octdoc      dialog/hidden
         * @private
         * @var         bool
         */
        var hidden = false;
        /**/

        /**
         * Adds named reference to a widget.
         *
         * @octdoc      dialog/addReference
         * @public
         * @param       string          name            Name of widget.
         * @param       oui.widget      widget          Instance of widget.
         */
        this.addReference = function(name, widget)
        /**/
        {
            references[name] = widget;
        }

        /**
         * Remove a named reference to a widget.
         *
         * @octdoc      dialog/removeReference
         * @public
         * @param       string          name            Name of widget to remove reference of.
         */
        this.removeReference = function(name)
        /**/
        {
            if (name in references) {
                delete(references[name]);
            }
        }

        /**
         * Returns a widget instance specified by the name.
         *
         * @octdoc      dialog/getWidget
         * @public
         * @param       string          name            Name of widget to return instance of.
         * @return      null|oui.widget                 Widget instance or null, if no widget is available.
         */
        this.getWidget = function(name)
        /**/
        {
            var ret = null;

            if (name in references) {
                ret = references[name]
            }

            return ret;
        }

        /**
         * Collect values of all widgets known to the dialog and return them.
         *
         * @octdoc      dialog/getValue
         * @public
         * @return      object                          Collected values.
         */
        this.getValue = function()
        /**/
        {
            var ret = {};
            var tmp;

            for (var i in references) {
                if (references[i] == this) {
                    // ommit own reference
                    continue;
                }

                if ((tmp = references[i].getValue()) !== null) {
                    ret[i] = tmp;
                }
            }

            return ret;
        }

        /**
         * Hide or show dialog.
         *
         * @octdoc      dialog/setVisible
         * @public
         * @param       bool            visible         Whether to hide or to show dialog.
         */
        this.setVisible = function(visible)
        /**/
        {
            if ((hidden = !visible)) {
                this.onHide();
            } else {
                this.onShow();
            }
        }

        /**
         * Test if dialog is visible.
         *
         * @octdoc      dialog/isVisible
         * @public
         * @return      bool                            Returns true if dialog is visible otherwise false.
         */
        this.isVisible = function()
        /**/
        {
            return !hidden;
        }
    }

    oui.dialog.prototype = new oui.widget();

    /**
     * Container for dialog widget.
     *
     * @octdoc      dialog/container
     * @public
     * @var         string
     */
    oui.dialog.prototype.container = 'FORM';
    /**/

    /**
     * CSS class of dialog widget.
     *
     * @octdoc      dialog/cssclass
     * @public
     * @var         string
     */
    oui.dialog.prototype.cssclass = 'oui_dialog';
    /**/

    /**
     * Return instance of dialog.
     *
     * @octdoc      dialog/getDialog
     * @public
     * @return      oui.dialog
     */
    oui.dialog.prototype.dialog = function getDialog()
    /**/
    {
        return this;
    }
})();
