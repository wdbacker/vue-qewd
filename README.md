# vue-qewd: [Vue.js](https://vuejs.org/) & [Nuxt.js](https://nuxtjs.org/) WebSocket client plugin for [QEWD.js](https://www.npmjs.com/package/qewd)

This plugin integrates [Vue.js](https://vuejs.org/) & [Nuxt.js](https://nuxtjs.org/) applications with a multi-process [qewd (QEWD.js)](http://qewdjs.com/) [Express](https://expressjs.com/) or [Koa](http://koajs.com/) back-end server using [WebSockets](https://socket.io/) (or Ajax calls). Exposes the [ewd-client](https://www.npmjs.com/package/ewd-client) module as a `this.$qewd` built-in Vue.js service inside your Vue.js components.

A similar [react-qewd](https://www.npmjs.com/package/react-qewd) module exists for [React](https://reactjs.org/)/[Redux](http://redux.js.org/).

[QEWD.js](http://qewdjs.com/) is a unique web framework allowing you to concentrate on your application code, without worrying about system infrastructure, featuring:
- a WebSockets server, allowing your application to connect via this `vue-qewd` module using [ewd-client](https://www.npmjs.com/package/ewd-client)
- a (federating) REST server, to build your REST endpoints & allowing you to federate requests to other (chained) QEWD servers, featuring [Express](https://expressjs.com/) or [Koa](http://koajs.com/) as underlying frameworks
- a microservices server, using very efficient (permanent, secured) WebSocket connections to other QEWD.js servers using [JWT](https://jwt.io/)'s
- a [GraphQL](http://graphql.org/) server to write & process your GraphQL queries & mutations
- an application router to orchestrate all your different application endpoint(s)/handler(s)
- a master/worker multi-process queue architecture, high-performance and very scalable
- session management/cache allowing you to write stateful applications
- response customization: combine responses from different servers, return responses in different formats, intercept an re-route requests, ...
- built-in JSON database abstraction: make your application data persistent using the [InterSystems Caché multi-model database](https://www.intersystems.com/products/cache/) or the [InterSystems IRIS Data platform](https://www.intersystems.com/products/intersystems-iris/) (unified data access as a document/NoSQL store or using SQL or objects), [Redis](https://redis.io/), [YottaDB](https://yottadb.com), ...

## Installing

    npm install vue-qewd

### Version 2: breaking changes!

From version 2.0.0 onwards, the [socket.io-client](https://www.npmjs.com/package/jquery) and [jQuery](https://www.npmjs.com/package/jquery) module dependencies for the underlying [ewd-client](https://www.npmjs.com/package/ewd-client) need to be passed in as parameters when instantiating QEWD:

```javascript
import io from 'socket.io-client'
import $ from 'jquery'

let qewd = QEWD({
  application: 'qewd-test-app', // application name
  log: true,
  url: 'http://localhost:8080',
  io,
  $
})
```
Overview of parameter changes in 2.0.0 and up:
- ```io``` was added: required for WebSocket communication mode, import it as above or as 
```javascript
var io = require('socket.io-client')
```
- ```$``` was added: required for Ajax communication mode using the [jQuery](https://www.npmjs.com/package/jquery) ajax method, import it as above or as
```javascript
var $ = require('jquery')
```
- ```ajax``` remains the same: required for Ajax communication mode, using you own custom Ajax module, e.g. with axios
```javascript
import io from 'socket.io-client'
// import $ from 'jquery'
import axios from 'axios'

var qewd = QEWD({
  application: 'qewd-test-app', // application name
  log: true,
  url: 'http://localhost:8080',
  io,
  ajax: function (params, success, fail) {
    let data = JSON.stringify(params.data)
    axios({
      url: params.url,
      method: 'post',
      headers: {
        'Content-Type': params.contentType
      },
      data,
      timeout: params.timeout
    })
      .then(function (response) {
        success(response.data)
      })
      .catch(function (error) {
        if (error.response) {
          success(error.response.data)
        } else {
          fail(error.message || 'unknown ajax error')
        }
      })
  }
})
```
- for mixed WebSocket & Ajax communication mode, you need both parameters (io and $ || ajax)
- ```no_sockets``` parameter was removed
- ```use_jquery``` parameter was removed

This allows you to control which modules you need and avoids [Webpack](https://webpack.js.org/) dependency detection issues.

## Options

  Options you can pass to the `QEWD({ ... })` instance (see examples) with  their default values and a short description:

    {
      // application module name
      application: 'unknown',
      // socket.io-client module (optional, required for WebSockets communication)
      io: undefined,
      // jquery module (optional, required for Ajax communication using jQuery's $.ajax)
      $: undefined,
      // specify your own Ajax request handler function, see example above (optional)
      ajax: null,
      // url of QEWD.js server, in the form 'http(s)://<host>:<port>'
      url: null,
      // runtime mode for ewd-client (optional)
      mode: 'development',
      // log each QEWD message sent & received on console (optional)
      log: true,
      // specify custom cookie name to restart the current WebSockets session between page refreshes (optional)
      cookieName: 'ewdSession',
      // use JWT's for sessions (optional)
      jwt: false,
      // decode JWT's in the client (optional)
      jwt_decode: false
    }

You'll find further details about these options in the [QEWD.js training course](http://docs.qewdjs.com/qewd_training.html).

## Use with [Vue.js](https://vuejs.org/)

Below is a small example using [Vue.js](https://vuejs.org/) components.

First, create a new startup app template with [vue-cli](https://www.npmjs.com/package/vue-cli) (or with the most recent [@vue/cli](https://www.npmjs.com/package/@vue/cli) version 3.x). This example is just a modification of the standard app template code. If necessary, adjust the `url` property inside the `var qewd` to your local settings.

This module adds a `$qewd` service to the Vue instance. You can then simply communicate with your back-end by invoking `this.$qewd.send()` in your Vue component methods. Btw, you'll need to define a `let self = this` to make the Vue component instance available in the `send` callback because it's not proxied yet inside the callback.

While QEWD.js is starting the WebSocket connection with the back-end, you can also use conditional rendering to hide (parts of) the app view using `this.$qewd.vRegistrationCallback(cb)`. See below, where the App component installs a callback function which QEWD calls when the WebSocket connection state changes. This sets the reactive `qewdReady` data property and re-renders the view.

Press the "QEWD message test" button to see the plugin back-end communication in action.

```javascript
import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client'
// import both the QEWD class and VueQEWD plugin
import { QEWD, VueQEWD } from 'vue-qewd'
// import axios (optional, in case you need to use ajax mode)
import axios from 'axios'

// instantiate QEWD with your parameters
var qewd = QEWD({
  application: 'qewd-test', // application name
  log: true,
  url: 'http://localhost:8080', // adjust this to your local environment
  io, // use WebSocket communication
  // uncomment the lines below to use axios ajax calls instead of using WebSockets (and remove io parameter)
  // see also part 14 of QEWD training course from page 15 at
  // https://www.slideshare.net/robtweed/ewd-3-training-course-part-14-using-ajax-for-ewdxpress-messages
  /*
  ajax: function (params, success, fail) {
    let data = JSON.stringify(params.data)
    axios({
      url: params.url,
      method: 'post',
      headers: {
        'Content-Type': params.contentType
      },
      data,
      timeout: params.timeout
    })
      .then(function (response) {
        success(response.data)
      })
      .catch(function (error) {
        if (error.response) {
          success(error.response.data)
        } else {
          fail(error.message || 'unknown ajax error')
        }
      })
  }
  */
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

```html
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
  mounted: function() {
    var self = this;
    // monitor when QEWD is ready
    this.$qewd.vRegistrationCallback(function(registered) {
      self.qewdReady = registered; //
    });
    // start the QEWD WebSockets connection ...
    this.$qewd.vueStart();
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

Next, create a `qewd-test.js` module in your QEWD back-end server with a `test` handler returning a simple test message (see below).

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
Next, you'll need to install one dependency the QEWD client needs to build it's WebSockets connection to the QEWD.js server back-end:
```batchfile
npm i socket.io-client --save
```
Finally, run your Vue.js test app with:
```batchfile
npm run dev
```
`Tip`: to avoid Webpack errors (requiring both `socket.io-client` and `jquery` to be installed), include the module(s) you need as (at least development) dependency in your Vue.js project, e.g.:

    npm i socket.io-client
    npm i -D jquery

## Use with [Nuxt.js](https://nuxtjs.org/)

If you want to build Vue.js apps using SSR (server-side rendering), you can use `vue-qewd` inside a `Nuxt.js` project (template). You need to define `vue-qewd` first as a plugin for your `Nuxt.js` project.

Create a `vue-qewd.js` file inside your `/plugins` directory:

```javascript
import Vue from 'vue'
import io from 'socket.io-client'
// import both the QEWD class and VueQEWD plugin
import { QEWD, VueQEWD } from 'vue-qewd'

// instantiate QEWD with your parameters
var qewd = QEWD({
  application: 'qewd-test', // application name
  log: true,
  // adjust this to your local environment
  // using environment vars defined in nuxt.config.js
  url: 'http://' + process.env.qewdHost + ':' + process.env.qewdPort,
  io,
  // use a custom cookie in the browser
  cookieName: 'qwt'
});

// let Vue know you want to use the plugin
Vue.use(VueQEWD, { qewd })
```
Inside your `nuxt.config.js`, add `vue-qewd.js` to the plugins array, e.g.:
```javascript
module.exports = {
  env: {
    qewdHost: process.env.QEWD_HOST || 'localhost',
    qewdPort: process.env.QEWD_PORT || '8080'
  },
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },

  ...

  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/vue-qewd.js'
  ],

  ...
```
You can leverage `QEWD.js`'s cookie mechanism to reconnect the WebSocket session automatically between complete page refreshes in `Nuxt.js`: it's recommended to launch the QEWD.js client from the `mounted` hook in an Application layout file, e.g. inside `/layouts/default.vue` you can add QEWD like this:
```html
<template>
  <v-app dark>
  ...
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        qewdReady: false,
        sessionExpired: false,
        ...
      }
    },
    mounted: function () {
      var self = this
      // monitor when QEWD is ready
      this.$qewd.vRegistrationCallback(function (registered, msgType) {
        console.log('registration callback: ', registered, msgType)
        self.qewdReady = registered
        // preserve session across page refreshes & switches
        if (registered) {
          self.sessionExpired = false
          if (msgType === 'ewd-registered') {
            self.$qewd.setCookie('qwt')
          }
        } else {
          if (msgType === 'socketDisconnected') {
            self.sessionExpired = true
          }
        }
      })
      // start the QEWD WebSockets connection ...
      this.$qewd.vueStart()
    },
    methods: {
      ...
    }
  }
</script>
```
Btw, this example uses the [Vuetify](https://vuetifyjs.com) framework to build a nice UI very easily using components.

Next, you can use `this.$qewd` in all your page methods as usual.

## License

 Copyright (c) 2019 Stabe nv,  
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
