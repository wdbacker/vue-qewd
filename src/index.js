/**
 * Install plugin.
 */

import { QEWD } from './qewd/index';

exports.version = '1.0.0';
exports.QEWD = QEWD;
exports.VueQEWD = {
  install: function(Vue, options) {
		var self = this;
		var vue = Vue;
		var qewd = options.qewd;
		
		Vue.qewd = qewd;

		Object.defineProperties(Vue.prototype, {
			$qewd: {
				get() {
					return qewd;
				}
			}
		});
		//Vue.util.defineReactive(vue, '$qewdRegistered', false);
		Vue.prototype.$qewdRegistered = false;
		
		qewd.on('ewd-registered', function() {
			vue.$qewdRegistered = true;
		});
		qewd.vstart();
		console.log('VueQEWD plugin installed');
	}
};

/*
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueQEWD)
}
*/