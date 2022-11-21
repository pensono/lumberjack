import '@fortawesome/fontawesome-free/css/all.css'
import { createApp } from 'vue'
import VueCodemirror from 'vue-codemirror'
import {createVuetify} from "vuetify"
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, fa } from 'vuetify/iconsets/fa'
import 'vuetify/styles'
import { Splitpanes, Pane } from 'splitpanes'
import App from './App.vue'
import './assets/style.scss'

createApp(App)
    .use(VueCodemirror)
    .use(createVuetify({
        components,
        directives,
        icons: {
            defaultSet: 'fa',
            sets: {
                fa
            }
        }
    }))
    .component("splitpanes", Splitpanes)
    .component("pane", Pane)
    .mount('#app')
