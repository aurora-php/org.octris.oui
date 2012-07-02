/**
 * Spinner widget.
 *
 * @octdoc      widget/spinner
 * @copyright   copyright (c) 2012 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('spinner' in oui.widget) return;

    /*
     * tags to consider when re-ordering tab index
     */
    var tab_tags = [
        'A', 'BUTTON', 'TEXTAREA', 'INPUT', 'IFRAME'
    ];

    /*
     * show / hide select boxes (to use as IE hack, if positioning layer above form elements
     */
    function toggleFormElements(show) {
        oui.$('SELECT').each(function() {
            this.style.visibility = (show ? 'visible' : 'hidden');
        });
    }

    /*
     * workaround for an IE bug where it's necessary to disable tab indexes
     */
    function toggleTabIndexes(enable, tab_indexes) {
        if (!document.all) return;

        if (enable) {
            if (tab_indexes.length == 0) return;

            for (var i = 0, len = tab_indexes.length; i < len; ++i) {
                tab_indexes[i].ref.tabIndex = tab_indexes[i].idx;
            }
        } else {
            var me  = this;
            var idx = 0;

            tab_indexes = [];

            oui.$(tab_tags.join(',')).each(function() {
                tab_indexes[idx++] = {
                    'ref': this,
                    'idx': this.tabIndex
                }

                this.tabIndex = '-1';
            });
        }

        return tab_indexes;
    }

    /**
     * Constructor.
     *
     * @octdoc      spinner/
     * @public
     * @param       string              name            Name to set for widget.
     * @param       object              options         Optional options for widget.
     * @return      oui.widget.spinner                  Widget instance.
     */
    oui.widget.spinner = function(name, options)
    /**/
    {
        this.overlay = null;
        this.parent  = null;
        this.layer   = new oui.dom.layer();

        oui.widget.call(this, name, options);
    }

    oui.widget.spinner.prototype = new oui.widget();

    /**
     * Container type of a spinner.
     *
     * @octdoc      spinner/container
     * @public
     * @var         string
     */
    oui.widget.spinner.prototype.container = 'DIV';
    /**/

    /**
     * CSS class of a spinner.
     *
     * @octdoc      spinner/cssclass
     * @public
     * @var         string
     */
    oui.widget.spinner.prototype.cssclass = 'oui_spinner';
    /**/

    /**
     * Show spinner widget.
     * 
     * @octdoc      spinner/show
     * @public
     */
    oui.widget.spinner.prototype.show = function()
    /**/
    {
        /*@cc_on toggleFormElements(false); @*/

        var width  = this.parent.node.offsetWidth;
        var height = this.parent.node.offsetHeight;

        this.overlay.css({
            'top':        '0',
            'left':       '0',
            'width':      width + 'px',
            'height':     height + 'px',
            'visibility': 'visible'
        });

        this.widget.css({
            'top':        '0',
            'left':       '0',
            'width':      width + 'px',
            'height':     height + 'px',
            'visibility': 'visible'
        });

        this.layer.up();
    }

    /**
     * Hide spinner widget.
     * 
     * @octdoc      spinner/hide
     * @public
     */
    oui.widget.spinner.prototype.hide = function()
    /**/
    {
        this.overlay.css('visibility', 'hidden');
        this.widget.css('visibility', 'hidden');

        /*@cc_on toggleFormElements(true); @*/
    }

    /**
     * Toggle visibility of spinner widget.
     * 
     * @octdoc      spinner/toggle
     * @public
     * @param       state           bool            Whether to show or hide spinner widget.
     */
    oui.widget.spinner.prototype.toggle = function(state)
    /**/
    {
        if (state) {
            this.show();
        } else {
            this.hide();
        }
    }
    /**
     * Build spinner widget and attach it to a parent node.
     *
     * @octdoc      spinner/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.spinner.prototype.attach = function(parent, def)
    /**/
    {
        parent.css('position', 'relative');

        this.parent  = parent;
        this.widget  = parent.append(oui.$(document.createElement(this.container)));
        this.overlay = parent.append(oui.dom.create('DIV', {
            'class': 'oui_spinner_overlay'
        }));

        this.layer.push([this.overlay, this.widget]);
    }
})();

