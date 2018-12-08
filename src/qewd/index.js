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

import ewdClient from 'ewd-client';

// instantiation function to use ewd-client
export function QEWD(params) {
  let io;
  if (!params.no_sockets) io = require('socket.io-client');
  let $;
  if (params.use_jquery && !params.ajax) $ = require('jquery');

  // set up start parameters for ewd-client
  const EWD = ewdClient.EWD;
  const application = {
    application: params.application || 'unknown',
    io: io,
    $: $,
    ajax: params.ajax || null,
    url: params.url || null,
    mode: params.mode || 'development',
    log: params.log || true,
    cookieName: params.cookieName || 'ewdSession',
    jwt: params.jwt || false,
    jwt_decode: params.jwt_decode || false
  };

  EWD.vstart = EWD.vueStart = function() {
    EWD.start(application);
  };

  let registrationCallback = null;
  EWD.vRegistrationCallback = function(callback) {
    registrationCallback = callback;
  };
  EWD.on('ewd-registered', function() {
    if (registrationCallback) { registrationCallback(true, 'ewd-registered'); }
  });
  EWD.on('ewd-reregistered', function() {
    if (registrationCallback) { registrationCallback(true, 'ewd-reregistered'); }
  });
  EWD.on('socketDisconnected', function() {
    if (registrationCallback) { registrationCallback(false, 'socketDisconnected'); }
  });

  // return the QEWD client instance
  return EWD;
}
