import { createRouter, createWebHistory } from 'vue-router'
import LoginIndex from "@/views/user/account/LoginIndex.vue";
import RegisterIndex from "@/views/user/account/RegisterIndex.vue";
import ResetPassword from "@/views/user/account/ResetPassword.vue";
import SinglerPlayerIndex from "@/views/game/SinglerPlayerIndex.vue";
import MultiPlayerIndex from "@/views/game/MultiPlayerIndex.vue";
import RanklistIndex from "@/views/ranklist/RanklistIndex.vue";
import HomeIndex from "@/views/home/HomeIndex.vue";
import NotFoundIndex from "@/views/404/NotFoundIndex.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      component: HomeIndex,
      name: "homeIndex",
      meta: {
        needLogin: false
    }
    },
    {
      path: '/user/account/login',
      component: LoginIndex,
      name: "loginIndex",
      meta: {
        needLogin: false
      }
    },
    {
      path: '/user/account/register',
      component: RegisterIndex,
      name: "registerIndex",
      meta: {
        needLogin: false
      }
    },
    {
      path: '/user/account/reset_password',
      component: ResetPassword,
      name: "resetPasswordIndex",
      meta: {
        needLogin: false
      }
    },
    {
      path: '/game/singleplayer',
      component: SinglerPlayerIndex,
      name: "singlePlayerIndex",
      meta: {
        needLogin: true
      }
    },
    {
      path: '/game/multiplayer',
      component: MultiPlayerIndex,
      name: "multiPlayerIndex",
      meta: {
        needLogin: true
      }
    },
    {
      path: '/ranklist',
      component: RanklistIndex,
      name: "ranklistIndex",
      meta: {
        needLogin: true
      }
    },
    {
      path: '/404',
      component: NotFoundIndex,
      name: "notFoundIndex",
      meta: {
        needLogin: false
      }
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/404",
    }
  ],
})

export default router
