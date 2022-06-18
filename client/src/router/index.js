import { createWebHistory, createRouter } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import ModelViewer from "@/components/ModelViewer.vue";

const routes = [
{
    path: "/",
    name: "HomePage",
    component: HomePage,
},
{
    path: `/v/:modelId`,
    name: "ModelViewer",
    component: ModelViewer,
    props: true,
},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;