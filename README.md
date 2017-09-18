# vue-qewd: [Vue.js](https://vuejs.org/) WebSocket client plugin for [QEWD](https://www.npmjs.com/package/qewd)

This plugin integrates [Vue.js](https://vuejs.org/) applications with a multi-process [qewd (QEWD)](http://qewdjs.com/) [Express](https://expressjs.com/) or [Koa](http://koajs.com/) back-end server using [WebSockets](https://socket.io/) (or Ajax calls). Exposes the [ewd-client](https://www.npmjs.com/package/ewd-client) module as a `this.$qewd` built-in Vue service inside your Vue.js components.

## Installing

    npm install vue-qewd

## Use

Below is an example using [Vue.js](https://vuejs.org/) components.

First, create a very small `qewd-test` module in your QEWD back-end server with a `test` handler returning a simple test message.

Next, create a new startup app template with [vue-cli](https://www.npmjs.com/package/vue-cli). This example is just a modification of the standard app template code. If necessary, adjust the `url` property inside the `var qewd` to your local settings.

This module adds a `$qewd` service to the Vue instance. You can then simply communicate with your back-end by invoking `this.$qewd.send()` in your Vue component methods. Btw, you'll need to define a `let self = this` to make the Vue component instance available in the `send` callback because it's not proxied yet inside the callback.

While QEWD is starting the WebSocket connection with the back-end, you can also use conditional rendering to hide (parts) of the app view. See also below, where the created hook in the main app component is listening for the `ewd-registered` event on the `this.$qewd` service. This sets the reactive `qewdIsReady` data property and re-renders the view.

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
    <template v-if="qewdIsReady">
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
    this.$qewd.on('ewd-registered', function() {
      // QEWD is ready now, let's update the view ...
      self.qewdIsReady = true;
    });
    // start the QEWD WebSockets connection ...
    this.$qewd.vstart();
  },
  data () {
    return {
      qewdIsReady: false,
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
Next, you'll need to install a one standard dependency the QEWD client needs:
```batchfile
npm i socket.io-client
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
