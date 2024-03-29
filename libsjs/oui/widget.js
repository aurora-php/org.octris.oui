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
         * @type        DOMElement
         */
        var node = null;
        /**/

        /**
         * Name of widget.
         *
         * @octdoc      widget/name
         * @private
         * @type        string
         */
        var name = name || '';
        /**/

        /**
         * Options of widget.
         *
         * @octdoc      widget/options
         * @private
         * @type        object
         */
        var options = options || {};
        /**/

        /**
         * Whether the widget is disabled.
         *
         * @octdoc      widget/disabled
         * @private
         * @type        bool
         */
        var disabled = false;
        /**/

        /**
         * Child widgets.
         *
         * @octdoc      widget/children
         * @private
         * @type        array
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
         * Set value for a widget.
         *
         * @octdoc      widget/setValue
         * @public
         * @param       mixed           value               Value to set.
         */
        this.setValue = function(value)
        /**/
        {
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

            if ((disabled = !enabled)) {
                this.onDisable();
            } else {
                this.onEnable();
            }

            for (var i = 0, cnt = children.length; i < cnt; ++i) {
                children[i].setEnabled(enabled);
            }
        }

        /**
         * Initiate building of child widgets.
         *
         * @octdoc  widget/processChildren
         * @param   array           def                 Widget definition.
         * @param   callback        processor           Callback method for processing 
         *                                              child widgets.
         * @param   parent          object              Optional parent DOM node.
         */
        this.processChildren = function(def, processor, parent)
        /**/
        {
            var me = this;
        
            (function process(parent, def) {
                if (!('children' in def)) return;
            
                var type, child, widget, instance, html_node;

                for (var i = 0, cnt = def['children'].length; i < cnt; ++i) {
                    child = null;

                    for (type in def['children'][i]) {
                        child = def['children'][i][type];
                        break;
                    }

                    console.log(child, type);
                
                    if (child == null) {
                        // no child element
                        continue;
                    } else if (typeof child != 'object') {
                        // wrong datatype
                        // TODO: output notice
                        continue;
                    }
                    
                    if (!(type in registry)) {
                        if (type.match(/^html:([a-z]+\d*)$/)) {
                            // html
                            node.append(html_node = oui.dom.create(RegExp.$1, child));
                            
                            processor(html_node, me, child);
                        } else {
                            throw 'Unknown widget type \'' + type + '\'!';
                        }
                    } else {
                        // registered oui widget
                        widget   = registry[type];
                        name     = ('name' in child ? child['name'] : '');
                        instance = me.addChild(new widget.widget(name, widget.options));
        
                        processor(parent, instance, child);
                    }
                }
            })(parent || node, def);
        }

        /**
         * Add child widget
         *
         * @octdoc      widget/addChild
         * @public
         * @param       oui.widget      instance            Instance of a widget.
         * @return      oui.widget                          The widget instance specified as parameter.
         */
        this.addChild = function(instance)
        /**/
        {
            if (!(instance instanceof oui.widget)) {
                throw 'The parameter specified is not an instance of \'oui.widget\'!';
            }

            // TODO: check, if instance is allowed to add (eg.: by checking options [eg.: container must not be
            //       a child of tile])

            var me = this;

            instance.getDialog = function() {
                return me.getDialog();
            }

            instance.getParent = function() {
                return me;
            }

            children.push(instance);

            return instance;
        }

        /**
         * Create widget. This method is normally called from within the attach method to create
         * the widget container.
         *
         * @octdoc      widget/create
         * @public
         * @param       DOMElement      parent              Parent node to create widget in.
         * @param       object          def                 Widget definition.
         * @return      DOMElement                          Node of new created widget.
         */
        this.create = function(parent, def)
        /**/
        {
            node = oui.$(document.createElement(this.container));
            node.addClass(
                this.cssclass + ('class' in def
                                 ? ' ' + def['class']
                                 : '')
            );

            parent.append(node);

            return node;
        }
    }

    /**
     * Default container type of a widget.
     *
     * @octdoc      widget/container
     * @public
     * @type        string
     */
    oui.widget.prototype.container = 'DIV';
    /**/

    /**
     * Default css class of a widget.
     *
     * @octdoc      widget/cssclass
     * @public
     * @type        string
     */
    oui.widget.prototype.cssclass = 'oui_widget';
    /**/

    /**
     * Return dialog, the widget is assigned to. Returns false, if the widget is not assigned
     * to any dialog.
     *
     * @octdoc      widget/getDialog
     * @public
     * @type        bool|oui.dialog
     */
    oui.widget.prototype.getDialog = function()
    /**/
    {
        return false;
    }

    /**
     * Return parent widget.
     *
     * @octdoc      widget/getParent
     * @public
     * @type        bool|oui.widget
     */
    oui.widget.prototype.getParent = function()
    /**/
    {
        return false;
    }

    /**
     * Build a widget and attach it to a parent node.
     *
     * @octdoc      widget/attach
     * @public
     * @param       DOMElement      parent          Parent node to attach widget to.
     * @param       object          def             Widget definitions.
     */
    oui.widget.prototype.attach = function(parent, def)
    /**/
    {
        this.create(parent, def);

        this.processChildren(def, function(parent, instance, def) {
            instance.attach(parent, def);
        });
    }

    /**
     * Assimilate a part of a page and try to wrap OUI functionality around page elements.
     *
     * @octdoc      widget/assimilate
     * @public
     * @param       DOMElement      node            Node to assimilate.
     */
    oui.widget.prototype.assimilate = function(node)
    /**/
    {
        var me = this;

        (function _assimilate(node) {
            // TODO: implementation
        })(node);
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

    /*
     * event handlers to be overwritten by children
     */

    /**
     * Event handler get's called, when widget get's enabled
     *
     * @octdoc      widget/onEnable
     * @public
     */
    oui.widget.prototype.onEnable = function()
    /**/
    {
    }

    /**
     * Event handler get's called, when widget get's disabled.
     *
     * @octdoc      widget/onDisable
     * @public
     */
    oui.widget.prototype.onDisable = function()
    /**/
    {
    }

    /**
     * Event handler get's called, after widget was populated with data.
     *
     * @octdoc      widget/onPopulate
     * @public
     */
    oui.widget.prototype.onPopulate = function()
    /**/
    {
    }

    /**
     * Event handler get's called, after widget's value get's updated/changed.
     *
     * @octdoc      widget/onChange
     * @public
     */
    oui.widget.prototype.onChange = function()
    /**/
    {
    }

    /**
     * Event handler get's called, when widget is clicked on.
     *
     * @octdoc      widget/onClick
     * @public
     */
    oui.widget.prototype.onClick = function()
    /**/
    {
    }

    /*
     * static methods
     */

    /**
     * Tests if something is registered with a specified widget name.
     *
     * @octdoc      widget/isRegistered
     * @static
     * @param       string          name            Name of widget to test if it's registered.
     */
    oui.widget.isRegistered = function(name)
    /**/
    {
        return (name in registry);
    }
})();
