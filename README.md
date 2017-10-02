# vue-qewd: [Vue.js](https://vuejs.org/) WebSocket client plugin for [QEWD](https://www.npmjs.com/package/qewd)

This plugin integrates [Vue.js](https://vuejs.org/) applications with a multi-process [qewd (QEWD)](http://qewdjs.com/) [Express](https://expressjs.com/) or [Koa](http://koajs.com/) back-end server using [WebSockets](https://socket.io/) (or Ajax calls). Exposes the [ewd-client](https://www.npmjs.com/package/ewd-client) module as a `this.$qewd` built-in Vue service inside your Vue.js components.

A similar module [react-qewd](https://www.npmjs.com/package/vue-qewd) for [React](https://reactjs.org/)/[Redux](http://redux.js.org/) exists.

[QEWD](http://qewdjs.com/) is a unique web framework allowing you to concentrate on your application code, without worrying about system infrastructure, featuring:
- a WebSockets server, allowing your application to connect via this `vue-qewd` module using [ewd-client](https://www.npmjs.com/package/ewd-client)
- a (federating) REST server, to build your REST endpoints & allowing you to federate requests to other (chained) QEWD servers, featuring [Express](https://expressjs.com/) or [Koa](http://koajs.com/) as underlying frameworks
- a microservices server, using very efficient (permanent, secured) WebSocket connections to other QEWD servers using [JWT](https://jwt.io/)'s
- a [GraphQL](http://graphql.org/) server to write & process your GraphQL queries & mutations
- an application router to orchestrate all your different application endpoint(s)/handler(s)
- a master/worker multi-process queue architecture, high-performance and very scalable
- session management/cache allowing you to write stateful applications
- response customization: combine responses from different servers, return responses in different formats, intercept an re-route requests, ...
- database independence: use the [InterSystems Caché unified multi-model database](https://www.intersystems.com/products/cache/), [Redis](https://redis.io/), [GT/M](https://sourceforge.net/projects/fis-gtm/), ... or whatever (No)SQL database technology you like!

## Installing

    npm install vue-qewd

## Use

Below is an example using [Vue.js](https://vuejs.org/) components.

First, create a very small `qewd-test` module in your QEWD back-end server with a `test` handler returning a simple test message.

Next, create a new startup app template with [vue-cli](https://www.npmjs.com/package/vue-cli). This example is just a modification of the standard app template code. If necessary, adjust the `url` property inside the `var qewd` to your local settings.

This module adds a `$qewd` service to the Vue instance. You can then simply communicate with your back-end by invoking `this.$qewd.send()` in your Vue component methods. Btw, you'll need to define a `let self = this` to make the Vue component instance available in the `send` callback because it's not proxied yet inside the callback.

While QEWD is starting the WebSocket connection with the back-end, you can also use conditional rendering to hide (parts of) the app view using `this.$qewd.vRegistrationCallback(cb)`. See below, where the App component installs a callback function which QEWD calls when the WebSocket connection state changes. This sets the reactive `qewdReady` data property and re-renders the view.

Press the "QEWD message test" button to see the plugin back-end communication in action.

```javascript
import Vue from 'vue'
import App from './App.vue'
// import both the QEWD class and VueQEWD plugin
import { QEWD, VueQEWD } from 'vue-qewd'

// instantiate QEWD with your parameters
var qewd = QEWD({
  application: 'qewd-test', // application name
  log: true,
  url: 'http://localhost:8080' // adjust this to your local environment
});

// let Vue know you want to use the plugin
Vue.use(VueQEWD, { qewd });

// create your Vue instance
new Vue({
  el: '#app',
  render: h => h(App)
})
```

Next, create a default App.vue component:

```javascript
<template>
  <div id="app">
    <template v-if="qewdReady">
      <img src="./assets/logo.png">
      <h1>{{ msg }}</h1>
      <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <button @click="testing">QEWD message test</button>
  </template>
  <template v-else>
    <img src="./assets/logo.png">
    <h2>Starting application, please wait ...</h2>
  </template>
  </div>
</template>

<script>
export default {
  name: 'app',
  created: function() {
    var self = this;
    // monitor when QEWD is ready
    this.$qewd.vRegistrationCallback(function(registered) {
      self.qewdReady = registered; //
    });
    // start the QEWD WebSockets connection ...
    this.$qewd.vstart();
  },
  data () {
    return {
      qewdReady: false,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    testing: function() {
      let messageObj = {
        type: 'test',
        params: {
          text: 'a Vue.js test message for QEWD'
        }
      };
      let self = this;
      this.$qewd.send(messageObj, function(messageObj) {
        self.msg = messageObj.message.text;
      });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
```

The `qewd-test` module used in the QEWD back-end:

```javascript
module.exports = {
  handlers: {
    test: function(messageObj, session, send, finished) {
      var incomingText = messageObj.params.text;
      var d = new Date();
      finished({text: 'You sent: ' + incomingText + ' at ' + d.toUTCString()});
    }
  }
};
```
Next, you'll need to install one standard dependency the QEWD client needs:
```batchfile
npm i socket.io-client --save
```
Finally, run your Vue.js test app with:
```batchfile
npm run dev
```


## License

 Copyright (c) 2017 Stabe nv,  
 Hofstade, Oost-Vlaanderen, BE  
 All rights reserved

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
