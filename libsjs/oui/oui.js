;(function(window) {
	if ('oui' in window) return;
	
	var oui = {};
	oui.$ = jQuery.noConflict();

	window.oui = {};
	
	// core functionality
	oui.create = function(tag, def) {
		def = def || {};
		
        function _get_tag(def) {
            var tag = '';
                
            if (typeof def == 'object') {
                for (var i in def) {
                    tag = i;
                    break;
                }
            }
                
            return tag;
        }
            
        function _build(tag, def) {
            var i, len, tmp;

			// create new node
			var node = oui.$(document.createElement(tag));
			
			// apply attributes to node
			for (i in def) {
				switch (i) {
				case 'children':
					continue;
				case '...':
					...
					node.attr(i, ...);
					
				}
			}
                
            if ('children' in def && def['children'] instanceof Array) {
                // iterate over children
                for (i = 0, len = def['children'].length; i < len; ++i) {
                    if ((tmp = _get_tag(def['children'][i])) !== '') {
						node.add(_build(tmp, def['children'][i][tmp]));
                    }
                }
            }

            return node;
        }

		return _build(tag, def);
	}
})(window);
