/**
 * Makes UI elements draggable.
 *
 * @octdoc      c:evt/draggable
 * @copyright   copyright (c) 2011 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('draggable' in oui.evt) return;
    
    var drag = false;       // drag mode

    /**
     * Constructor.
     *
     * @octdoc  m:draggable/construct
     * @param   oui.dom.node    target      Target node to make draggable.
     * @param   int             raster      Width of pixel raster to use.
     * @param   oui.dom.node    handle      Optional handle to use for dragging.
     * @param   int             direction   Optional allowed dragging direction.
     */
    oui.evt.draggable = function(target, raster, handle, direction)
    /**/
    {
        // setup new drag handle
        handle    = handle || target;
        raster    = raster || 1;
        range     = {'x1': null, 'y1': null, 'x2': null, 'y2': null};
        direction = direction || (oui.evt.draggable.T_DIR_Y | oui.evt.draggable.T_DIR_X);

        var me       = this;
        var startXY  = {'x': 0, 'y': 0};
        var offsetXY = {'x': 0, 'y': 0};
    
        // optionally disable either direction to drag to
        if ((direction & oui.evt.draggable.T_DIR_Y) != oui.evt.draggable.T_DIR_Y) {
            range['y1'] = false;
            range['y2'] = false;
        }
        if ((direction & oui.evt.draggable.T_DIR_X) != oui.evt.draggable.T_DIR_X) {
            range['x1'] = false;
            range['x2'] = false;
        }

        /**
         * Start dragging on mouse down.
         *
         * @octdoc  m:draggable/onmousedown
         * @access  private
         */
        function onmousedown(e)
        /**/
        {
            if (drag) return;
    
            drag = true;
    
            var node = target.toDOMNode();
    
            startXY  = oui.evt.getMousePos();
            offsetXY = {
                'x': node.offsetLeft,
                'y': node.offsetTop
            };

            var evnet_target = new oui.dom.node(document);
            var event_id     = oui.evt.addEvent(
                event_target,
                'mousemove',
                function(e) {
                    if (!drag) return;
                    
                    var pos = oui.evt.getMousePos();
                    var y   = (offsetXY.y + pos.y - startXY.y);
                    var x   = (offsetXY.x + pos.x - startXY.x);

                    y = Math.floor(y / raster) * raster;
                    x = Math.floor(x / raster) * raster;

                    if (range.y1 !== false && range.y2 !== false) {
                        if (range.y1 === null || range.y2 === null) {
                            node.style.top = y + 'px';
                        } else if (y >= range.y1 && y <= range.y2) {
                            node.style.top = y + 'px';
                        } else if (y < range.y1) {
                            node.style.top = range.y1 + 'px';
                        } else if (y > range.y2) {
                            node.style.top = range.y2 + 'px';
                        }
                    }
                    if (range.x1 !== false && range.x2 !== false) {
                        if (range.x1 === null || range.x2 === null) {
                            node.style.left = x + 'px';
                        } else if (x >= 0 && x <= range.rx) {
                            node.style.left = x + 'px';
                        } else if (x < 0) {
                            node.style.left = '0px';
                        } else if (x > range.rx) {
                            node.style.left = range.rx + 'px';
                        }
                    }
                    
                    me.onMouseMove();
                }
            );
            var event_id2 = oui.evt.addEvent(
                event_target,
                'mouseup',
                function(e) {
                    if (!drag) return;
                    
                    drag = false;
                    
                    oui.evt.removeEvent(event_id);
                    oui.evt.removeEvent(event_id2);
                    
                    me.onMouseUp();
                }
            );
    
            me.onMouseDown();
        };

        // attach events
        oui.evt.addEvent(
            handle, 
            'mousedown', 
            onmousedown,
            {'propagate': false, 'default': false}
        );

        /**
         * Set draggable range.
         *
         * @octdoc  m:draggable/setRange
         * @param   int     x1
         * @param   int     y1
         * @param   int     x2
         * @param   int     y2
         */
        this.setRange = function(x1, y1, x2, y2)
        /**/
        {
            range = {
                'x1': (x1 === null ? range['x1'] : x1), 
                'y1': (y1 === null ? range['y1'] : y1), 
                'x2': (x2 === null ? range['x2'] : x2), 
                'y2': (y2 === null ? range['y2'] : y2)
            };
            
            range.rx = range.x2 - range.x1;
            range.ry = range.y2 - range.y1;
        };

        /**
         * Get's called when mouse button is pressed when mouse is above
         * drag target or drag handle.
         *
         * @octdoc  m:draggable/onMouseDown
         */
        this.onMouseDown = function()
        /**/
        {
        }

        /**
         * Get's called when mouse button is released after a dragging event.
         *
         * @octdoc  m:draggable/onMouseUp
         */
        this.onMouseUp = function()
        /**/
        {
        }
        
        /**
         * Get's called when mouse is moved during a dragging event.
         *
         * @octdoc  m:draggable/onMouseMove
         */
        this.onMouseMove = function()
        /**/
        {
        }
    }

    /**
     * Dragging directions
     *
     * @octdoc  d:T_DIR_X, T_DIR_Y
     */
    oui.evt.draggable.T_DIR_Y = 1;
    oui.evt.draggable.T_DIR_X = 2;
    /**/
})();
