/**
 * Base oui widget class.
 *
 * @octdoc      c:oui/widget
 * @copyright   copyright (c) 2008-2011 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('widget' in oui) return;

    /*
     * remove handlers for attached events
     */
    var evt_remove = {};
    
    /*
     * Widget registry.
     */
    var registry = {};
    
    /*
     * Helper function to dissect tag into namespace and widget type
     */
    function dissectTag(tag) {
        var dissected = {'ns': 'oui', 'type': tag};
        var pos;
    
        if ((pos = tag.indexOf(':')) >= 0) {
            dissected.ns   = tag.substr(0, pos);
            dissected.type = tag.substr(pos + 1);
        }
    
        return dissected;
    }

    /**
     * Constructor.
     *
     * @octdoc  m:widget/construct
     */
    oui.widget = function()
    /**/
    {
        this.disabled = false;
        this.bgcolor  = null;
    
        this.children = [];
        this.options  = {};
    }

    /**
     * Register a widget identified by a classname.
     *
     * @octdoc  m:widget/register
     * @param   string      classname   Name of widget to register in the
     *                                  form of: optional namespace + ':' +
     *                                  name of class of widget.
     * @param   object      obj         Object of widget.
     */
    oui.widget.register = function(classname, obj)
    /**/
    {
        var dissected = dissectTag(classname);
        
        var ns   = dissected.ns;
        var type = dissected.type;
    
        if (!(ns in registry)) {
            registry[ns] = {};
        }
    
        if (!(type in registry[ns])) {
            registry[ns][type] = obj;
        } else {
            throw 'widget was registered before!';
        }
    }
    
    /**
     * Check if a widget is registered.
     *
     * @octdoc  m:widget/isRegistered
     * @param   string      classname   Name of widget to register in the
     *                                  form of: optional namespace + ':' +
     *                                  name of class of widget.
     * @return  bool
     */
    oui.widget.isRegistered = function(classname)
    /**/
    {
        var dissected = dissectTag(classname);
        var ns        = dissected.ns;
        var type      = dissected.type;

        return (ns in registry && type in registry[ns]
                ? registry[ns][type]
                : false);
    }
    
    /**
     * Default container tag for widget.
     *
     * @octdoc  m:widget/container
     */
    oui.widget.prototype.container = 'DIV';
    /**/

    /**
     * Default classname for widget.
     *
     * @octdoc  m:widget/classname
     */
    oui.widget.prototype.classname = 'oui_widget';
    /**/

    /**
     * Widget container DOM node.
     *
     * @octdoc  m:widget/widget
     */
    oui.widget.prototype.widget = null;
    /**/

    /**
     * Name of widget.
     *
     * @octdoc  m:widget/name
     */
    oui.widget.prototype.name = '';
    /**/

    /**
     * Destructor is called, when widget is destroyed using the destroy
     * method.
     *
     * @octdoc  m:widget/destruct
     */
    oui.widget.prototype.destruct = function()
    /**/
    {
    }

    /**
     * Return instance of dialog the widget is bound to, or false, if the
     * dialog instance could not be determined or the widget is not bound to
     * any dialog.
     *
     * @octdoc  m:widget/getDialog
     * @return  bool
     */
    oui.widget.prototype.getDialog = function()
    /**/
    {
        return false;
    }

    /**
     * Return node of widget.
     *
     * @octdoc  m:widget/getNode
     * @return  oui.dom.node            Node of widget.
     */
    oui.widget.prototype.getNode = function()
    /**/
    {
        return this.widget;
    }

    /**
     * Check whether the widget has a name or id attribute assigned. If yes,
     * the widget can be referenced from a dialog by using this name.
     *
     * @octdoc  m:widget/isReferenceable
     * @return  bool
     */
    oui.widget.prototype.isReferenceable = function()
    /**/
    {
        return (this.widget.getAttribute('name') ||
                this.widget.getAttribute('id'));
    }

    /**
     * Add an event handler for the widget.
     *
     * @octdoc  m:widget/addEvent
     * @param   string      type            Type of event to attach.
     * @param   callback    cb              Callback to call if event is triggered.
     * @param   string                      ID the event is registered as.
     */
    oui.widget.prototype.addEvent = function(type, cb)
    /**/
    {
        var id;
        
        if (typeof this['on' + type] == 'function') {
            // attach to custom event of widget
            var me = this;
            id = oui.getUniqId('evt_');
            
            evt_remove[id] = (function(vec) {
                if (typeof vec != 'function') {
                    delete(me['on' + type]);
                } else {
                    me['on' + type] = vec;
                }
                
                delete(evt_remove[id]);
            })(this['on' + type]);
            this['on' + type] = (function(vec) {
                return function() {
                    var args = [].splice.call(arguments, 0);
                    
                    cb.apply(me, args);
                    vec.apply(me, args);
                }
            })(this['on' + type]);
        } else {
            id = oui.evt.addEvent(this.widget, type, cb);
        }
        
        return id;
    }
    
    /**
     * Remove a previous installed event listener with specified ID.
     *
     * @octdoc  m:widget/removeEvent
     * @param   string      id          ID of event listener to remove.
     */
    oui.widget.prototype.removeEvent = function(id)
    /**/
    {
        if (id in evt_remove) {
            evt_remove[id]();
        } else {
            oui.evt.removeEvent(id);
        }
    }

    /**
     * Return value or array of value(s) (data) assigned to the widget, for
     * example if widget represents an editable form element.
     *
     * @octdoc  m:widget/getData
     * @return  mixed
     */
    oui.widget.prototype.getData = function()
    /**/
    {
        return null;
    }

    /**
     * Set data for the widget, for example if widget represents an editable
     * form element.
     *
     * @octdoc  m:widget/setData
     * @param   mixed       data                    Data to set.
     */
    oui.widget.prototype.setData = function(data)
    /**/
    {
    }

    /**
     * Create spinner as layer above the complete widget.
     *
     * @octdoc  m:widget/getSpinner
     */
    oui.widget.prototype.getSpinner = function()
    /**/
    {
        var spinner = null;
        var me      = this;

        this.getSpinner = (function() {
            spinner = new oui.spinner();
            spinner.attach(me.widget, {});

            return function() {
                return spinner;
            }
        })();

        return spinner;
    }

    /**
     * Initiate building of child widgets.
     *
     * @octdoc  m:widget/processChildren
     * @param   array           children        Child widgets.
     * @param   callback        processor       Callback method for processing
     *                                          child widgets.
     * @param   oui.dom.node    parent          Optional parent node to use 
     *                                          instead of node of the widget.
     */
    oui.widget.prototype.processChildren = function()
    /**/
    {
        var me = this;
    
        var _process = function(parent, def) {
            if (!('children' in def)) return;
        
            var j, child, widget, instance, dissected, tag;

            for (var i = 0, cnt = def['children'].length; i < cnt; ++i) {
                child = null;

                for (j in def['children'][i]) {
                    child = def['children'][i][j];
                    break;
                }

                if (child == null) {
                    // no child element
                    continue;
                }

                dissected = dissectTag(j);

                if (dissected.ns == 'html') {
                    // namespace html
                    tag = new oui.widget();
                    tag.widget = oui.dom.create(dissected.type);
                    tag.attach = function(parent, def){
                        parent.appendChild(this.widget);
                
                        this.widget.setProperties(def);
                    
                        if ('name' in def) {
                            me.getDialog().addReference(def['name'], this.widget);
                        }
                
                        // me.processChildren(def, function(parent, instance, def) {
                        this.processChildren(def, function(parent, instance, def) {
                            instance.attach(parent, def);
                        });
                    }

                    processor(parent, tag, child);
                    
                    continue;
                }

                // oui or other namespace
                if (!(dissected.ns in registry)) {
                    throw 'unknwon namespace "' + dissected.ns + '"';
                } else if (!(dissected.type in registry[dissected.ns])) {
                    throw 'unknown widget type "' + dissected.type + '" in namespace "' + dissected.ns + '"';
                }

                widget   = registry[dissected.ns][dissected.type];
                instance = me.addChild(new widget());
    
                if ('name' in child) {
                    instance.setName(child['name']);
                }

                processor(parent, instance, child);
            }
        }
    
        if (typeof parent == 'undefined') {
            parent = this.widget;
        }
    
        _process(parent, def);
    }

    /**
     * Append DOM children.
     *
     * @octdoc  m:widget/appendChild
     * @param   oui.dom.node    parent      Parent node to attach to.
     * @param   string          tag         Tag to append.
     * @param   object          def         Child definition.
     */
    oui.widget.prototype.appendChild = function(parent, tag, def)
    /**/
    {
        var e = oui.dom.create(tag);
        var c = this.cssclass;
    
        for (var p in def) {
            switch (p) {
            case 'class':
                // css classes
                c = c + (c != '' ? ' ' : '') + def[p];
                break;
            case 'styles':
                // additional css styles
                if (typeof def[p] == 'object') {
                    e.setStyles(def[p]);
                }
                break;
            case 'id':
                // element ID
                e.setAttribute('id', def[p]);
                break;
            case 'type':
                // change type attribute must be done _before!_ appending it to the DOM
                e.setAttribute('type', def[p]);
                break;
            default:
                // event handler
                if (p.substr(0, 2) == 'on') {
                    if (p in this) {
                        // custom event
                        this[p] = def[p];
                    } else {
                        // node event
                        e.node[p] = def[p];
                    }
                }
            }
        }
    
        e.node.className = c;

        parent.appendChild(e);

        return e;
    }

    /**
     * Assimilate HTML tags into oui widget.
     *
     * @octdoc  m:widget/assimilate
     * @param   oui.dom.node    node        Node to assimilate.
     */
    oui.widget.prototype.assimilate = function(node)
    /**/
    {
        var me = this;

        (function _assimilate(node) {
            node.childNodes().forEach(function(node) {
                var attr, name, widget;
            
                if ((attr = oui.string.trim(node.getAttribute('oui:data'))) != '') {
                    // node has custom data assigned
                    var data = eval('(' + attr + ')');
                    
                    for (var i in data) node.setData(i, data[i]);
                }

                if ((attr = node.getAttribute('oui')) && (widget = oui.widget.isRegistered(attr))) {
                    // registered oui widget -> assimilate!!!
                    var instance = me.addChild(new widget());
                    instance.widget = node;
                    instance.assimilate(node);

                    if ((name = node.getAttribute('name'))) {
                        instance.setName(name);
                    }
                } else {
                    // not registered or misc node
                    _assimilate(node);
                }
            });
        })(node);
    }

    /**
     * Build widget.
     *
     * @octdoc  m:widget/attach
     * @param   oui.dom.node    parent      Parent node to attach widget to.
     * @param   array           def         Widget definition.
     */
    oui.widget.prototype.attach = function(parent, def)
    /**/
    {
        this.widget = this.appendChild(
            parent, 
            this.container, 
            def
        );    
    
        // process children
        var me = this;
    
        this.processChildren(def, function(parent, instance, def) {
            instance.attach(parent, def);
        });
    }

    /**
     * Add child widget.
     *
     * @octdoc  m:widget/addChild
     * @param   oui.widget      instance        Instance of child widget.
     * @return  oui.widget                      The instance specified as parameter.
     */
    oui.widget.prototype.addChild = function(instance)
    /**/
    {
        // add child widget instance
        this.children.push(instance);
    
        // overwrite getDialog of child widget to return correct dialog instance
        var me = this;
    
        instance.getDialog = function() {
            return me.getDialog();
        }
    
        // return instance to further use it
        return instance;
    }

    /**
     * Set miscallenous options for widget.
     *
     * @octdoc  m:widget/setOptions
     * @param   object      options
     */
    oui.widget.prototype.setOptions = function(options)
    /**/
    {
        this.options = oui.extend(
            this.options, 
            options
        );
    }

    /**
     * Set the name of the widget and add named reference to the dialog the
     * widget is part of, if a dialog exists. If setName changes a previous
     * name, the reference will be renamed, too.
     *
     * @octdoc  m:widget/setName
     * @param   string      name            Name of widget.
     */
    oui.widget.prototype.setName = function(name)
    /**/
    {
        this.name = name;

        // set/change reference
        var dia = this.getDialog();
    
        if (dia == false) {
            return;
        }
    
        if (this.name != '') {
            dia.removeReference(this.name);
        }

        dia.addReference(name, this);
    }

    /**
     * Set widget and all child widgets to be disabled or enabled.
     *
     * @octdoc  m:widget/setDisabled
     * @param   bool        disable     Whether to disable or enable widget.
     */
    oui.widget.prototype.setDisabled = function(disabled)
    /**/
    {
        disabled = !!disabled;
    
        if (this.disabled == disabled) {
            return;
        }
    
        this.disabled = disabled;
    
        for (var i = 0, cnt = this.children.length; i < cnt; ++i) {
            this.children[i].setDisabled(disabled);
        }
    }

    /**
     * Destroy widget and child widgets.
     *
     * @octdoc  m:widget/destroy
     */
    oui.widget.prototype.destroy = function()
    /**/
    {
        for (var i = 0, cnt = this.children.length; i < cnt; ++i) {
            this.children[i].destroy();
        }

        this.destruct();
    }
})();
