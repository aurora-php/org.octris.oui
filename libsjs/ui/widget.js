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
     * Widget registry.
     */
    var registry = {};
    
    /*
     * Helper function to dissect tag into namespace and widget type
     */
    function dissectTag(tag) {
        var dissected = {'ns': 'ltk', 'type': tag};
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
     * @param   object      obj         Instance of the widget.
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
})();
