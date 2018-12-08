/*

 ----------------------------------------------------------------------------
 | vue-qewd: Vue.js client module for QEWD.js                               |
 |                                                                          |
 | Copyright (c) 2018 Stabe nv,                                             |
 | Hofstade, Oost-Vlaanderen,                                               |
 | All rights reserved.                                                     |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  8 December 2018

*/

/* eslint-disable comma-dangle */
/* eslint-disable func-names */

/**
 * Install plugin.
 */

import { QEWD } from './qewd/index';

exports.QEWD = QEWD;
exports.VueQEWD = {
  install: function(Vue, options) {
    const qewd = options.qewd;

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

/*
// don't enable because (qewd) option need to be passed in!
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueQEWD)
}
*/
