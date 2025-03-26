import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import router from "@/shared/router.service.js";
import Chart from "primevue/chart";

createApp(App)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        },
        ripple: true
    })
    .component("pv-chart",Chart)
    .use(router)
    .mount('#app')
