/**
 * Button widget.
 *
 * @octdoc      widget/button
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('button' in oui) return;

    /**
     * Constructor.
     *
     * @octdoc      button/
     * @public
     * @param       string      name            Name to set for widget.
     * @param       object      options         Optional options for widget.
     * @return      oui.button                  Widget instance.
     */
    oui.button = function(name, options)
    /**/
    {
        oui.widget.call(this, name, options);
    }

    oui.button.prototype = new oui.widget();

    oui.widget.register('button', oui.button);

    /**
     * Container type of a button.
     *
     * @octdoc      widget/container
     * @public
     * @var         string
     */
    oui.button.prototype.container = 'BUTTON';
    /**/

    /**
     * CSS class of a button.
     *
     * @octdoc      button/cssclass
     * @public
     * @var         string
     */
    oui.button.prototype.cssclass = 'oui_button';
    /**/

    /**
     * Enable button widget.
     *
     * @octdoc      button/onEnable
     */
    oui.button.prototype.onEnable = function() {
        this.getNode().attr('disabled', false);
    }

    /**
     * Disable button widget.
     *
     * @octdoc      button/onDisable
     */
    oui.button.prototype.onDisable = function() {
        this.getNode().attr('disabled', true);
    }
})();
