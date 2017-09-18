/*

 ----------------------------------------------------------------------------
 | vue-ewd: Vue.js client module for ewd-xpress                      |
 |                                                                          |
 | Copyright (c) 2017 Stabe nv,                                             |
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

  16 September 2017

*/

import ewdClient from 'ewd-client';

// instantiation function to use ewd-client
export function QEWD(params) {
  let io;
  if (!params.no_sockets) io = require('socket.io-client');
  let $;
  if (!params.ajax) $ = require('jquery');

  // set up start parameters for ewd-client
  let QEWD = ewdClient.EWD;
  let application = {
    application: params.application || 'unknown',
    io: io,
    $: $,
    ajax: params.ajax || null,
    url: params.url || null,
    mode: params.mode || 'development',
    log: params.log || true,
  };

  QEWD.vstart = function() {
    QEWD.start(application);
  };
  // return the QEWD client instance
  return QEWD;
}
