/**
 * Button widget.
 *
 * @octdoc      widget/button
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('button' in oui.widget) return;

    /**
     * Constructor.
     *
     * @octdoc      button/
     * @public
     * @param       string              name            Name to set for widget.
     * @param       object              options         Optional options for widget.
     * @return      oui.widget.button                   Widget instance.
     */
    oui.widget.button = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);
    }

    oui.widget.button.prototype = new oui.widget();

    oui.widget.register('button', oui.widget.button);

    /**
     * Container type of a button.
     *
     * @octdoc      button/container
     * @public
     * @type        string
     */
    oui.widget.button.prototype.container = 'BUTTON';
    /**/

    /**
     * CSS class of a button.
     *
     * @octdoc      button/cssclass
     * @public
     * @type        string
     */
    oui.widget.button.prototype.cssclass = 'oui_button';
    /**/

    /**
     * Enable button widget.
     *
     * @octdoc      button/onEnable
     */
    oui.widget.button.prototype.onEnable = function() {
        this.getNode().attr('disabled', false);
    }

    /**
     * Disable button widget.
     *
     * @octdoc      button/onDisable
     */
    oui.widget.button.prototype.onDisable = function() {
        this.getNode().attr('disabled', true);
    }

    /**
     * Build button widget and attach it to a parent node.
     *
     * @octdoc      button/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.button.prototype.attach = function(parent, def)
    /**/
    {
        var node = this.create(parent, def);

        if ('label' in def) {
            node.append(def['label']);
        }

        var me = this;

        node.on('click', function() {
            me.onClick();
        });
    }
})();

