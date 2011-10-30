/**
 * Event library.
 *
 * @octdoc      c:dom/evt
 * @copyright   copyright (c) 2011 by Harald Lapp
 * @author      Harald Lapp <harald@octris.org>
 */
/**/

;(function() {
    if ('evt' in oui) return;
    
    /*
     * remove handlers for attached events
     */
    var evt_remove = {};
    
    /*
     * keycodes
     */
    var keycodes = {
        'ESC':        27, 'TAB':      9, 'SPACE':     32, 'ENTER':    13,
        'BACKSPACE':   8, 'SCROLL': 145, 'CAPS':      20, 'NUM':     144,
        'PAUSE':      19, 'INSERT':  45, 'HOME':      36, 'DELETE':   46,
        'END':        35, 'PAGEUP':  33, 'PAGEDOWN':  34, 'LEFT':     37,
        'UP':         38, 'RIGHT':   39, 'DOWN':      40, 'COMMA':   188,
        'PERIOD':    190, 
        
        'F1':        112, 'F2':     113, 'F3':       114, 'F4':      115,
        'F5':        116, 'F6':     117, 'F7':       118, 'F8':      119,
        'F9':        120, 'F10':    121, 'F11':      122, 'F12':     123
    };

    /*
     * mouse coordinates determined by observation
     */
    var mouseX = 0;
    var mouseY = 0;

    /*
     * mouse movement direction indicator
     */
    var mouseDirX = 0;
    var mouseDirY = 0;

    /*
     * domready stuff
     */
    var addDomReady = (function() {
        var registry = {};
        var first    = true;
        
        return function(cb) {
            if (first) {
                // install domReady handler only the first time
                domReady(function() {
                    for (var i in registry) {
                        registry[i]();
                    }
                });
                
                first = false;
            }
            
            var id = oui.getUniqId('evt_');
            registry[id] = cb;
            
            evt_remove[id] = function() {
                delete(registry[id]);
                delete(evt_remove[id]);
            }
            
            return id;
        }
    })();

    /*
     * Helper function for updating various variables when mouse is moved
     */
    function captureMove(evt) {
        var x = 0;
        var y = 0;

        if (!evt) {
            var evt = window.event;
        }

        if (evt.pageX || evt.pageY)     {
            x = evt.pageX;
            y = evt.pageY;
        } else if (evt.clientX || evt.clientY) {
            x = evt.clientX + 
                document.body.scrollLeft + 
                document.documentElement.scrollLeft;
            y = evt.clientY + 
                document.body.scrollTop + 
                document.documentElement.scrollTop;
        }

        mouseDirX = (x > mouseX ? +1 : x < mouseX ? -1 : 0);
        mouseDirY = (y > mouseY ? +1 : y < mouseY ? -1 : 0);

        mouseX = x;
        mouseY = y;
    }

    oui.evt = {
        /**
         * Add event listener.
         *
         * @octdoc  m:evt/addEvent
         * @param   oui.dom.node    target  Target to attach event to.
         * @param   string          type    Type of event to attach.
         * @param   callback        cb      Callback to register for event.
         * @param   object          opt     Optional event options.
         * @param   string                  ID the event is registered as.
         */
        addEvent: function(target, type, cb, opt)
        /**/
        {
            if (!target.node) return;
            
            if (type == 'domready') {
                return addDomReady(cb);
            }
            
            opt = oui.extend({'propagate': false, 'default': false}, opt);

            // handle fake mouse events: on right click / on left click
            // we assume left click for normal click handler
            if (type == 'rgtclick' || type == 'lftclick' || type == 'midclick' || type == 'click' || type == 'mousedown') {
                cb = (function(type, cb) {
                    return function(type, e) {
                        e = e || window.event;
                    
                        var button = 'lftclick';
                    
                        if (!e.which) {
                            // IE
                            button = (e.button < 2 
                                        ? 'lftclick' 
                                        : (e.button == 4 
                                            ? 'midclick' 
                                            : 'rgtclick'));
                        } else {
                            button = (e.which < 2 
                                        ? 'lftclick' 
                                        : (e.which == 2 
                                            ? 'midclick' 
                                            : 'rgtclick'));
                        }
                    
                        if (button == type || (button == 'lftclick' && (type == 'click' || type == 'mousedown'))) {
                            cb(e);
                        }
                    }
                })(type, cb);

                if (type == 'rgtclick') {
                    type = 'mousedown';
                } else if (type == 'lftclick' || type == 'midclick') {
                    type = 'click';
                }
            }

            // handle propagation
            var me = this;

            cb = (function(cb) {
                return function(e) {
                    var ret;
                
                    cb(e);

                    if (!opt.propagate) { 
                        me.stopPropagation(e); ret = false; 
                    }
                    if (!opt['default']) { 
                        me.preventDefault(e); ret = false; 
                    }
                
                    return ret;
                }
            })(cb);

            // attach event handler and generate remove handler
            var id = oui.getUniqId('evt_');

            if (target.node.addEventListener) {
                type = (type == 'mousewheel' && window.gecko 
                        ? 'DOMMouseScroll' 
                        : type);

                target.node.addEventListener(type, cb, false);
                
                evt_remove[id] = function() {
                    target.node.removeEventListener(type, cb, false);
                    delete(evt_remove[id]);
                }
            } else if (target.node.attachEvent) {
                target.node.attachEvent('on' + type, cb);
                
                evt_remove[id] = function() {
                    target.node.detachEvent('on' + type, cb);
                    delete(evt_remove[id]);
                }
            } else {
                var vec = target.node['on' + type];
                
                if (typeof vec == 'function') {
                    cb = (function(cb) {
                        return function(e) {
                            vec(e);
                            cb(e);
                        }
                    })(cb);
                }
                
                target.node['on' + type] = cb;

                evt_remove[id] = function() {
                    target.node['on' + type] = vec;
                    delete(evt_remove[id]);
                }
            }

            return id;
        },

        /**
         * Remove a previous installed event listener with specified ID.
         *
         * @octdoc  m:evt/removeEvent
         * @param   string      id          ID of event listener to remove.
         */
        removeEvent: function(id)
        /**/
        {
            if (id in evt_remove) {
                evt_remove[id]();
            }
        },

        /**
         * Add keyboard event handler.
         *
         * @octdoc  m:evt/addKeyboardEvent
         * @param   oui.dom.node    target      Target to attach event to.
         * @param   string          shortcut    Keyboard shortcut to listen for.
         * @param   callback        cb          Callback to execute if event is triggered.
         * @param   object          opt         Optional event options.
         * @param   string                      ID the event is registered as.
         */
        addKeyboardEvent: function(target, shortcut, cb, opt)
        /**/
        {
            opt = oui.extend({'propagate': false, 'default': false, 'type': 'keydown'}, opt);

            var keys = shortcut.split('+');
            var me   = this;

            return this.addEvent(target, opt.type, function(e) {
                e = e || window.event;

                if (e.keyCode) {
                    code = e.keyCode;
                } else if (e.which) {
                    code = e.which;
                } else {
                    return;
                }

                var kchar = String.fromCharCode(code);
                var pressed = 0;

                for (var i = 0, len = keys.length; i < len; ++i) {
                    switch (keys[i]) {
                    case 'CTRL':
                        if (e.ctrlKey) {
                            ++pressed;
                        }
                        break;
                    case 'SHIFT':
                        if (e.shiftKey) {
                            ++pressed;
                        }
                        break;
                    case 'ALT':
                        if (e.altKey) {
                            ++pressed;
                        }
                        break;
                    default:
                        if (keys[i].length > 1) {
                            if (keycodes[keys[i]] == code) {
                                ++pressed;
                            }
                        } else if (keys[i] == kchar) {
                            ++pressed;
                        } else {
    //                        console.log(kchar + ' ' + code);
                        }
                        break;
                    }
                }

                if (pressed == keys.length) {
                    var ret = undefined;
                    
                    if (!opt.propagate) { me.stopPropagation(e); ret = false; }
                    if (!opt['default']) { me.preventDefault(e); ret = false; }

                    var result = cb();

                    if (typeof result != 'undefined' && !result) {
                        if (opt.propagate) { me.stopPropagation(e); ret = false; }
                        if (opt['default']) { me.preventDefault(e); ret = false; }
                    }
                    
                    return ret;
                }
            }, {'propagate': opt.propagate, 'default': opt['default']});
        },

        /**
         * Stops event propagation.
         *
         * @octdoc  m:evt/stopPropagation
         */
        stopPropagation: function(e)
        /**/
        {
            if (typeof e == 'undefined') {
                return;
            }
            
            if ('stopPropagation' in e) {
                e.stopPropagation();
            } else if ('cancelBubble' in e) {
                e.cancelBubble = true;
            }
        },

        /**
         * Prevents default event handler.
         *
         * @octdoc  m:evt/preventDefault
         */
        preventDefault: function(e)
        /**/
        {
            if (typeof e == 'undefined') {
                return;
            }
            
            if ('preventDefault' in e) {
                e.preventDefault();
            } else if ('returnValue' in e) {
                e.returnValue = false;
            }
        },

        /**
         * Disable enter key on specified target.
         *
         * @octdoc  m:evt/disableEnterKey
         * @param   oui.dom.node   targets  Target to disable enter key for.
         * @param   string                  ID the event is registered as.
         */
        disableEnterKey: function(target)
        /**/
        {
            return this.addEvent(target, 'keypress', function(e) {
                var key;
                
                if (window.event) {
                    key = window.event.keyCode;
                } else {
                    key = e.which;
                }
                
                return (key != 13);
            });
        },

        /**
         * Disable text-selection for specified target.
         *
         * @octdoc  m:evt/disableTextSelect
         * @param   oui.dom.node   targets  Target to disable enter key for.
         * @param   string                  ID the event is registered as.
         */
        disableTextSelect: function(target)
        /**/
        {
            var node = target.toDOMNode();
            var id   = oui.getUniqId('evt_');
            
            evt_remove[id] = (function(cb) {
                node.onselectstart = cb;
                delete(evt_remove[id]);
            })(node.onselectstart);
            evt_remove[id] = (function(cb)) {
                node.onmousedown = cb;
                delete(evt_remove[id]);
            })(node.onmousedown);
            
            node.onselectstart = function() { return false; }
            node.onmousedown   = function() { return false; }
        },

        /**
         * Simulate keyboard entries.
         *
         * @octdoc  m:evt/fireKeyboardEvent
         * @param   object      target      Target to fire event on.
         * @param   string      shortcut    Key combination to fire on target.
         */
        fireKeyboardEvent: function(target, shortcut)
        /**/
        {
            var evt_name = 'keypress';
            var evt      = document.createElement('KeyboardEvent');
            var keys     = shortcut.split('+')

            var modifiers = [];
            var options   = {
                'ctrl': false, 'shift': false, 'alt': false, 'meta': false, 'key': 0, 'char': 0
            }

            for (var i = 0, cnt = keys.length; i < cnt; ++i) {
                switch (keys[i]) {
                case 'CTRL':
                    options.ctrl = true;
                    modifiers.push('Control');
                    break;
                case 'SHIFT':
                    options.shift = true;
                    modifiers.push('Shift');
                    break;
                case 'ALT':
                    options.alt = true;
                    modifiers.push('Alt');
                    break;
                default:
                    if (keys[i].length > 1) {
                        if (keys[i] in keycodes) {
                            options.key = keycodes[keys[i]];
                        }
                    } else {
                        options.char = keys[i].charCodeAt(0);
                    }
                }
            }

            try {
                evt.initKeyEvent(
                    evt_name, true, true, window,             
                    options.ctrl, options.alt, options.shift, options.meta,
                    options.key, options.char
                );
            } catch(e) {
                var loc   = '0x00';
                var ident = 'U+00' + options.key.toString(16);

                evt.initKeyboardEvent(
                    evt_name, true, true, window, ident, loc, modifiers.join(' ')
                );
            }

            target.dispatchEvent(evt);
        },

        /**
         * Fire event on target.
         *
         * @octdoc  m:evt/fireEvent
         * @param   oui.dom.node    target      Target to fire event on.
         * @param   string          type        Type of event to fire.
         */
        fireEvent: function(target, type)
        /**/
        {
            var evt;

            if (document.createEventObject) {
                // IE
                evt = document.createEventObject();                    
                target.fireEvent('on' + type, evt);
            } else {
                // other browsers
                evt = document.createEvent('HTMLEvents');
                evt.initEvent(type, true, true);
                target.dispatchEvent(evt);
            }
        },

        /**
         * Returns mouse coordinates.
         *
         * @octdoc  m:evt/getMousePos
         * @return  object                      .x / .y position of mouse.
         */
        getMousePos: function()
        /**/
        {
            return {'x': mouseX, 'y': mouseY};
        },

        /**
         * Returns direction mouse was moved in.
         *
         * @octdoc  m:evt/getMouseMoveDir
         * @return  object                      .x / .y direction.
         */
        getMouseMoveDir: function()
        /**/
        {
            return {'x': mouseDirX, 'y': mouseDirY};
        }
    }
    
    /*
     * install mouse observation
     */
    addDomReady(function() {
        oui.evt.addEvent(
            new oui.dom.node(document), 
            'mousemove',
            captureMove,
            {'propagation': true, 'default': true}
        );
    });
})();
