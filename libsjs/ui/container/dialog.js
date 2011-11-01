/**
 * Dialog container widget.
 *
 * @octdoc      c:oui/dialog
 * @copyright   copyright (c) 2011 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('dialog' in oui) return;
    
    /**
     * Constructor.
     *
     * @octdoc  m:dialog/construct
     */
    oui.dialog = function()
    /**/
    {
        this.refs     = {};     // named references to widgets
        this.children = [];
    
        this.label    = null;   // label node
    
        this.options  = {
            'label': false      // whether dialog has a label
        };   
    }

    oui.widget.register('oui:dialog', oui.dialog);

    oui.dialog.prototype = new oui.widget();

    /**
     * Classname to apply to widget container.
     *
     * @octdoc  m:dialog/cssclass
     */
    oui.dialog.prototype.cssclass = 'oui_dialog';
    /**/

    /**
     * Destroy and remove cnild widgets.
     *
     * @octdoc  m:dialog/destroy
     */
    oui.dialog.prototype.destroy = function()
    /**/
    {
        oui.widget.prototype.destroy.call(this);
    
        this.widget.removeChild();
    }

    /**
     * Return instance of dialog.
     *
     * @octdoc  m:dialog/getDialog
     */
    oui.dialog.prototype.getDialog = function()
    /**/
    {
        return this;
    }

    /**
     * Adds named reference to a widget to dialog instance.
     *
     * @octdoc  m:dialog/addReference
     * @param   string      name        Name the widget should be referenced by.
     * @param   object      widget      Instance of widget to reference.
     */
    oui.dialog.prototype.addReference = function(name, widget)
    /**/
    {
        this.refs[name] = widget;
    }

    /**
     * Remove named reference.
     *
     * @octdoc  m:dialog/removeReference
     * @param   string      name        Name of the widget to remove the reference of.
     */
    oui.dialog.prototype.removeReference = function(name)
    /**/
    {
        if (name in this.refs) {
            delete(this.refs[name]);
        }
    }

    /**
     * Return reference to a widget specified by name.
     *
     * @octdoc  m:dialog/getWidget
     * @param   string      name        Name the widget is referenced by.
     * @return  oui.widget              Widget instance.
     */
    oui.dialog.prototype.getWidget = function(name)
    /**/
    {
        var ret = null;
    
        if (name in this.refs) {
            ret = this.refs[name];
        } else {
            throw 'unable to reference widget identified by name "' + name + '"!';
        }
    
        return ret;
    }

    /**
     * Collect all values of the dialog / form / widgets and return them.
     *
     * @octdoc  m:dialog/getData
     * @return  object
     */
    oui.dialog.prototype.getValue = function()
    /**/
    {
        var ret = {};
        var tmp;
    
        for (var i in this.refs) {
            if (this.refs[i] == this) {
                continue;
            }

            tmp = this.refs[i].getValue();
        
            if (tmp != null) {
                ret[i] = tmp;
            }
        }
    
        return ret;
    }

    /**
     * Populate dialog with data.
     *
     * @octdoc  m:dialog/setData
     * @param   object      data        Data to set for dialog.
     */
    oui.dialog.prototype.setData = function(data)
    /**/
    {
        for (var i in data) {
            if (i in this.refs && this.refs[i] != this) {
                if ('innerHTML' in this.refs[i]) {
                    this.refs[i].innerHTML = data[i];
                } else if ('populate' in this.refs[i]) {
                    this.refs[i].populate(data[i]);
                }
            }
        }
    }

    /**
     * Clear all elements in a dialog from data.
     *
     * @octdoc  m:dialog/resetData
     */
    oui.dialog.prototype.resetData = function()
    /**/
    {
        for (var i in this.refs) {
            if ('innerHTML' in this.refs[i]) {
                this.refs[i].innerHTML = '';
            } else {
                this.refs[i].populate('');
            }
        }
    }

    /**
     * Show / hide dialog.
     *
     * @octdoc  m:dialog/setVisible
     * @param   bool        visible         Whether to show / hide dialog.
     */
    oui.dialog.prototype.setVisible = function(visible)
    /**/
    {
        this.widget.node.style.display = (!!visible ? 'block' : 'none');
    }

    /**
     * Get visibility of dialog.
     *
     * @octdoc  m:dialog/isVisible
     * @return  bool
     */
    oui.dialog.prototype.isVisible = function()
    /**/
    {
        var display = this.widget.node.style.display;
        
        return !(display == 'none');
    }

    /**
     * Change label of dialog, if a label is defined.
     *
     * @octdoc  m:dialog/setLabel
     * @param   string      label           New label to set.
     */
    oui.dialog.prototype.setLabel = function(label)
    /**/
    {
        var r = '';
    
        if (this.options.label) {
            r = this.label.node.innerHTML;
            this.label.node.innerHTML = label;
        }
    
        return r;
    }

    /**
     * Assimilate node as dialog.
     *
     * @octdoc  m:dialog/assimilate
     * @param   oui.dom.node    node        Node to assimilate.
     */
    oui.dialog.prototype.assimilate = function(node)
    /**/
    {
        this.widget = node;
        
        // assimilate children
        oui.widget.prototype.assimilate.call(this, node);
    }
    
    /**
     * Attach dialog to node.
     *
     * @octdoc  m:dialog/attach
     * @param   oui.dom.node    parent      Node to attach dialog to.
     * @param   object          def         Dialog definition.
     */
    oui.dialog.prototype.attach = function(parent, def)
    /**/
    {
        this.widget = this.appendChild(
            parent, 
            this.container, 
            def
        );    
    
        if ('rounded' in def && def['rounded']) {
            this.widget.addClass('oui_dialog_rounded');
        }
    
        if ('visible' in def && !def['visible']) {
            this.widget.setStyle('display', 'none');
        }
    
        if ('shadow' in def && def['shadow']) {
            this.widget.addClass('oui_dialog_shadow');
        }
    
        if ((this.options.label && 'label' in def)) {
            this.label = this.widget.appendChild(oui.dom.create('label', {
                'class': 'oui_dialog_label',
                '#html': 'label'
            }));
        }
    
        var div = oui.dom.create('div');
        div.node.className = 'oui_dialog_container';
        this.widget.appendChild(div);
    
        this.processChildren(def, function(parent, instance, def) {
            instance.attach(parent, def);
        }, div);
    
        this.onLoad();
    }
    
    /* events */
    
    /**
     * Get's called after dialog was built.
     *
     * @octdoc  m:dialog/onLoad
     */
    oui.dialog.prototype.onLoad = function()
    /**/
    {
    }
})();
