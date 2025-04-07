import {createRouter, createWebHistory} from "vue-router";
import CalculatorPage from "../pages/calculator.page.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", component: CalculatorPage}
    ],
    sensitive: true,
    strict: false,
    end: true
});

export default router;