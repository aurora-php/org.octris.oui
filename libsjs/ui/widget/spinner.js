/**
 * Spinner widget.
 *
 * @octdoc      c:widget/spinner
 * @copyright   copyright (c) 2011 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('spinner' in oui) return;
    
    /*
     * Tags to consider when re-ordering tab index.
     */
    var tab_tags = [
        'A', 'BUTTON', 'TEXTAREA', 'INPUT', 'IFRAME'
    ];

    /*
     * Show / hide select boxes (to use as IE hack, if positioning layer 
     * above form elements.
     */
    function toggleFormElements(show) {
        oui.dom.get('SELECT').forEach(function(obj) {
            obj.node.style.visibility = (show ? 'visible' : 'hidden');
        });
    }

    /*
     * Workaround for an IE bug where it's necessary to disable tab indexes.
     */
    function toggleTabIndexes(enable, tab_indexes) {
        if (!document.all) return;

        if (enable) {
            if (tab_indexes.length == 0) return;

            for (var i = 0, len = tab_indexes.length; i < len; ++i) {
                tab_indexes[i].ref.tabIndex = tab_indexes[i].idx;
            }
        } else {
            var me = this;

            tab_indexes = [];

            oui.dom.get(tab_tags).forEach(function(obj) {
                tab_indexes[idx++] = {
                    'ref': obj[i],
                    'idx': obj[i].tabIndex
                }

                obj.tabIndex = '-1';
            });
        }

        return tab_indexes;
    }

    /**
     * Constructor.
     *
     * @octdoc  m:spinner/construct
     */
    oui.spinner = function()
    /**/
    {
        this.overlay = null;
        this.parent  = null;
        this.layer   = new oui.dom.layer();
    }

    oui.widget.register('oui:spinner', oui.spinner);

    oui.spinner.prototype = new oui.widget();

    /**
     * Classname to apply to widget container.
     *
     * @octdoc  m:spinner/cssclass
     */
    oui.spinner.prototype.cssclass = 'oui_spinner';
    /**/

    /**
     * Show spinner.
     *
     * @octdoc  m:spinner/show
     */
    oui.spinner.prototype.show = function()
    /**/
    {
        /*@cc_on toggleFormElements(false); @*/

        var width  = this.parent.node.offsetWidth;
        var height = this.parent.node.offsetHeight;

        this.overlay.setStyles({
            'top':        '0',
            'left':       '0',
            'width':      width + 'px',
            'height':     height + 'px',
            'visibility': 'visible'
        });

        this.widget.setStyles({
            'top':        '0',
            'left':       '0',
            'width':      width + 'px',
            'height':     height + 'px',
            'visibility': 'visible'
        });

        this.layer.up();
    }

    /**
     * Hide spinner.
     *
     * @octdoc  m:spinner/hide
     */
    oui.spinner.prototype.hide = function()
    /**/
    {
        this.overlay.setStyle('visibility', 'hidden');
        this.widget.setStyle('visibility', 'hidden');

        /*@cc_on toggleFormElements(true); @*/
    }

    /**
     * Toggle visibility of spinner.
     *
     * @octdoc  m:spinner/toggle
     * @param   bool        state           Toggle visibility.
     */
    oui.spinner.prototype.toggle = function(state)
    /**/
    {
        if (state) {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * Attach spinner widget.
     *
     * @octdoc  m:spinner/attach
     * @param   oui.dom.node    parent      Node to attach dialog to.
     * @param   object          def         Dialog definition.
     */
    oui.spinner.prototype.attach = function(parent, options)
    /**/
    {
        parent.setStyle('position', 'relative');

        this.parent  = parent;
        this.widget  = this.appendChild(parent, this.container, {});
        this.overlay = parent.appendChild(oui.dom.create('DIV', {
            'class': 'oui_spinner_overlay'    
        }));

        this.layer.push([this.overlay, this.widget]);
    }
})();
