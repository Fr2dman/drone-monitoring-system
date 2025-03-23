import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DashBoard from "@/pages/DashBoard.vue";
import DroneStatus from "@/pages/DroneStatus.vue"; // DroneStatus 컴포넌트
import MissionStatus from "@/pages/MissionStatus.vue"; // MissionStatus 컴포넌트

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashBoard,
    },
    {
      path: "/drone-status",
      name: "drones",
      component: DroneStatus,
    },
    {
      path: "/mission-status",
      name: "mission",
      component: MissionStatus,
    },
    {
      path: "/all-stop",
      name: "drone-status",
      component: MissionStatus,
    }, // 예시로 MissionStatus 페이지
  ],
});

export default router;
