import { createWebHistory, createRouter } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import ThreeDViewer from "@/components/ThreeDViewer.vue";

const routes = [
{
    path: "/",
    name: "HomePage",
    component: HomePage,
},
{
    path: "/v/:id",
    name: "ThreeDViewer",
    component: ThreeDViewer,
},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;