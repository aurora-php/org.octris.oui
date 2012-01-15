/**
 * Core widget library, every widget has to be derived from the widget.
 *
 * @octdoc      ui/widget
 * @copyright   copyright (c) 2010-2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('widget' in oui) return;

    var registry = {};      // Global widget registry.

    /**
     * Constructor.
     *
     * @octdoc      widget/
     * @public
     * @param       string      name            Name to set for widget.
     * @param       object      options         Optional options for widget.
     * @return      oui.widget                  Widget instance.
     */
    oui.widget = function(name, options)
    /**/
    {
        /**
         * Main DOM node of widget.
         *
         * @octdoc      widget/node
         * @private
         * @var         DOMElement
         */
        var node = null;
        /**/

        /**
         * Name of widget.
         *
         * @octdoc      widget/name
         * @private
         * @var         string
         */
        var name = name || '';
        /**/

        /**
         * Options of widget.
         *
         * @octdoc      widget/options
         * @private
         * @var         object
         */
        var options = options || {};
        /**/

        /**
         * Whether the widget is disabled.
         *
         * @octdoc      widget/disabled
         * @private
         * @var         bool
         */
        var disabled = false;
        /**/

        /**
         * Child widgets.
         *
         * @octdoc      widget/children
         * @private
         * @var         array
         */
        var children = [];
        /**/

        /**
         * Return name of the widget.
         *
         * @octdoc      widget/getName
         * @public
         * @return      string                  The name of the widget.
         */
        this.getName = function()
        /**/
        {
            return name;
        }

        /**
         * Return main DOM node of the widget.
         *
         * @octdoc      widget/getNode
         * @public
         * @return      DOMElement
         */
        this.getNode = function()
        /**/
        {
            return node;
        }

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
            return null;
        }

        /**
         * Enable or disable the widget and all it's child widgets.
         *
         * @octdoc      widget/setEnabled
         * @public
         * @param       bool            enabled             True enables the widget, false disables it.
         */
        this.setEnabled = function(enabled)
        /**/
        {
            if (disabled = !enabled) {
                return;
            }

            disabled = !enabled;

            for (var i = 0, cnt = children.length; i < cnt; ++i) {
                children[i].setEnabled(enabled);
            }
        }
    }

    /**
     * Default container type of a widget.
     *
     * @octdoc      widget/container
     * @public
     * @var         string
     */
    oui.widget.prototype.container = 'DIV';
    /**/

    /**
     * Default css class of a widget.
     *
     * @octdoc      widget/cssclass
     * @public
     * @var         string
     */
    oui.widget.prototype.cssclass = 'oui_widget';
    /**/

    /**
     * Return dialog, the widget is assigned to. Returns false, if the widget is not assigned
     * to any dialog.
     *
     * @octdoc      widget/getDialog
     * @public
     * @var         bool|oui.dialog
     */
    oui.widget.prototype.getDialog = function()
    /**/
    {
        return false;
    }

    /**
     * Add a widget object to the registry.
     *
     * @octdoc      widget/register
     * @static
     * @param       string          name            Name of widget to register.
     * @param       object          widget          Widget object.
     * @param       object          options         Optional options for widget creation.
     */
    oui.widget.register = function(name, widget, options)
    /**/
    {
        if (name in registry) {
            throw 'Widget was registered before!';
        } else if (name == 'widget') {
            throw 'A widget cannot have the name \'widget\'!';
        } else {
            registry[name] = {
                'widget':  widget,
                'options': options || {}
            }
        }
    }
})();
