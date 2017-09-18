/**
 * Install plugin.
 */

import { QEWD } from './qewd/index';

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
	}
};

/* don't enable because (qewd) option need to be passed in!
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueQEWD)
}
*/