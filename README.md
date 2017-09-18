# vue-qewd: Vue.js client module for [QEWD](https://www.npmjs.com/package/qewd)

Interface module for writing [Vue.js](https://vuejs.org/) applications with [qewd (QEWD)](https://www.npmjs.com/package/qewd) back-end. Exposes the [ewd-client](https://www.npmjs.com/package/ewd-client) as a built-in property. 

## Installing

    npm install vue-qewd

## Use

With [Vue.js](https://vuejs.org/) components, you can start from this example in your source code (to get started quickly, just create an app template with [vue-cli](https://www.npmjs.com/package/vue-cli) first, this example is just a modification of the standard app template code).

This module adds a $qewd property to the Vue instance. You can then simply communicate with your back-end by invoking this.$qewd.send() in your Vue component methods.

```javascript
import Vue from 'vue'
import App from './App.vue'
// import both the QEWD class and VueQEWD plugin
import { QEWD, VueQEWD } from 'vue-qewd'

// instantiate QEWD with your parameters
let qewd = QEWD({
  application: 'qewd-test', // application name
  log: true,
  url: 'http://localhost:8080'
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
    <ul v-if="$qewdRegistered">
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
	<button @click="sendToQEWD">QEWD message test</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
	sendToQEWD: function() {
	  let messageObj = {
		type: 'test',
		params: {
		  text: 'my ISC test message'
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

## License

 Copyright (c) 2016 Stabe nv,  
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
