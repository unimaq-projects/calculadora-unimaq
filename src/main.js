import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import router from "@/shared/router.service.js";
import Chart from "primevue/chart";
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import IftaLabel from "primevue/iftalabel";
import Select from 'primevue/select';
import {definePreset} from "@primeuix/themes";

const UnimaqTheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{zinc.50}',
            100: '{zinc.100}',
            200: '{zinc.200}',
            300: '{zinc.300}',
            400: '{zinc.400}',
            500: '{zinc.500}',
            600: '{zinc.600}',
            700: '{zinc.700}',
            800: '{zinc.800}',
            900: '{zinc.900}'
        }
    }
});

createApp(App)
    .use(PrimeVue, {
        theme: {
            preset: UnimaqTheme
        },
        ripple: true
    })
    .component("pv-chart",Chart)
    .component("pv-input", InputText)
    .component("pv-float-label", FloatLabel)
    .component("pv-ifta-label", IftaLabel)
    .component("pv-select", Select)
    .use(router)
    .mount('#app')
