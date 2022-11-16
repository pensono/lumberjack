import { createApp } from 'vue'
import VueCodemirror from 'vue-codemirror'
import { Splitpanes, Pane } from 'splitpanes'
import App from './App.vue'
import './assets/style.scss'

createApp(App)
    .use(VueCodemirror)
    .component("splitpanes", Splitpanes)
    .component("pane", Pane)
    .mount('#app')
