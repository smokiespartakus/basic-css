function $tpl(elem, id, classes, html, attrs) {
	if(!elem || typeof elem !== 'string') return $('');
	var $e = $('<' + elem + '/>');
	if ( Object.prototype.toString.call( id ) === '[object Array]' ) {
		html = id;
		id = '';
	}
	if ( id ) $e.attr('id', id);
	if ( classes ) $e.addClass(classes);
	if ( html ) {
		if ( Object.prototype.toString.call( html ) === '[object Array]' ) {
			for (var i = 0; i<html.length; i++) {
				$e.append(html[i]);
			}
		} else {
			$e.html(html);
		}
	}
	if ( typeof attrs  === 'object' ) {
		for(var i in attrs) {
			$e.attr(i, attrs[i]);
		}
	}
	return $e;
}
function getLocalStorage(key) {
	if(typeof(Storage) !== "undefined") {
		var item = localStorage.getItem(key);
		try {
			item = JSON.parse(item);
		} catch(e) {}
		return item;
	}
}
function clearLocalStorage(key) {
	if(typeof(Storage) !== "undefined") {
		return localStorage.removeItem(key);
	}
}
function setLocalStorage(key, item) {
	if(typeof(Storage) !== "undefined") {
		if(typeof item == 'object') {
			try {
				item = JSON.stringify(item);
			} catch(e) {}
		}
		localStorage.setItem(key, item);
	}
}
function jqajax(opts) {
	var options = {
		type: "GET",
		data: {},
		dataType: 'json',
	};
	$.extend(options, opts);
	options.success = function(data) {
		if(typeof opts.success === 'function') {
			opts.success(data);
		}
	};
	options.fail = function(data) {
		if(typeof opts.fail === 'function') {
			opts.fail(data);
		}
	};
	var $ajax = $.ajax({
		type: options.type,
		url: options.url,
		data: options.data,
		success: options.success,
		dataType: options.dataType,
	})
	.fail(options.fail);
	return $ajax;
}
/**
 * Simple modal show hide function - requires modal.css
 */
var modal = {
	show: function() {
		modal.init();
		modal.modal.show();
		return modal;
	},
	hide: function() {
		modal.init();
		modal.modal.hide();
		return modal;
	},
	html: function(html) {
		modal.init();
		modal.modal.find('#modal-inner').html(html);
		return modal;
	},
	init: function() {
		if(modal.inited) return;
			modal.modal = $tpl('div', 'modal', '', [
				$tpl('div', 'modal-inner')
			]).appendTo('body');
		modal.inited = true;
		return modal;
	},
	modal: null,
	inited: false,
};
/**
 * Hash function
 */
var Hash = {
	set: function(k, v) {
		var obj = Hash.getObj();
		obj[k] = v;
		location.hash = Hash.stringify(obj);
		return Hash;
	},
	reset: function(k, v) {
		var obj = {};
		if(k) obj[k] = v;
		location.hash = Hash.stringify(obj);
		return Hash;
	},
	get: function(k) {
		var obj = Hash.getObj();
		return obj[k];
	},
	getObj: function() {
		var obj = {};
		var h = location.hash.substr(1).split('/');
		for (var i=1; i<h.length; i++) {
			var hh = (h[i] + '').split(':');
			if (hh[0]) obj[hh[0]] = hh[1];
		}
		return obj;
	},
	stringify: function(obj) {
		var arr = [];
		for (var i in obj) {
			arr.push(i + ':' + (obj[i] || ''));
		}
		return '/' + arr.join('/');
	},
};
/**
 * tap function that utilizes the swipe plugin
 * https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * http://labs.rampinteractive.co.uk/touchSwipe/demos/index.html
 */
$.fn.bindtap = function(fn) {
	var $this = this;
	$this.swipe({
		tap: function(event, target) {
			console.log('tap');
			if (event.button == 2) {
				console.log('right click - ignored');
				return;
			}
			if( fn ) {
				//event.preventDefault();
				fn(event, target);
			}
		},
	});
	//this.on("tap", fn); // enables elem.trigger("tap"); // FUCKS WITH STUFF!
	return this;
};
/*
 * For custom events
 */
(function(window) {
    if (typeof window.CustomEvent !== 'function') {
        window.CustomEvent = function(type, eventInitDict) {
            var newEvent = document.createEvent('CustomEvent');
            newEvent.initCustomEvent(type,
                                     !!(eventInitDict && eventInitDict.bubbles),
                                     !!(eventInitDict && eventInitDict.cancelable),
                                     (eventInitDict ? eventInitDict.detail : null));
            return newEvent;
        };
    }
}(window));
function dispatchCustomEvent(elem, type, data) {
	var e = createCustomEvent(type, data);
	if (e && elem && elem.dispatchEvent) elem.dispatchEvent(e);
	return e;
}
function createCustomEvent(type, data, bubbles, cancelable) {
	if (!type) return false;
	data = data || {};
    var Event = new CustomEvent(type, {
        detail: data,
        bubbles: true,
        cancelable: false
    });
	return Event;
}

/**
 * Std sort function to sort by any field in an array
 * @param {string} field, the field name, if one dimentional array, put null
 * @param {boolean} reverse, reverse the array or not
 * @param {function} primer, some function to apply to the value, e.g. function(a){return a.toLowerCase();} or parseInt
 * Use: arr.sort(sortBy('price', false, parseInt));
 */
var sortBy = function(field, reverse, primer){
	if( field ) {
	   var key = primer ? 
		   function(x) {return primer(x[field])} : 
		   function(x) {return x[field]};
	} else {
		var key = primer ? 
		   function(x) {return primer(x)} : 
		   function(x) {return x};
	}
   reverse = [-1, 1][+!!reverse];

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a < b) - (b < a));
     } 
};
