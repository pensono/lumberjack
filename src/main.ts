import { createApp } from 'vue'
import VueCodemirror from 'vue-codemirror'
import {createVuetify} from "vuetify"
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { Splitpanes, Pane } from 'splitpanes'
import App from './App.vue'

createApp(App)
    .use(VueCodemirror)
    .use(createVuetify({components, directives}))
    .component("splitpanes", Splitpanes)
    .component("pane", Pane)
    .mount('#app')
