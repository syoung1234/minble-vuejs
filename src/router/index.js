import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import Post from "../views/post/Post.vue";
import PostCreateUpdate from "../views/post/CreateUpdate.vue";
import PostDetail from "../views/post/Detail.vue";
import Message from "../views/message/Message.vue";
import Start from "../views/Start.vue";
import Home from "../views/Home.vue";
import store from "../store";

const beforeAuth = isAuth => (from, to , next) => {
  const isAuthenticated = store.getters["isAuthenticated"]
  if ((isAuthenticated && isAuth) || (!isAuthenticated && !isAuth)) {
    return next()
  } else {
    next("/")
  }
}

const routes = [
  {
    path: "/start",
    name: "Start",
    component: Start,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/",
    name: "/",
    redirect: "/home",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
    beforeEnter: beforeAuth(true)
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/post",
    name: "Post",
    component: Post,
  },
  {
    path: "/post/create",
    name: "PostCreateUpdate",
    component: PostCreateUpdate,
  },
  {
    path: "/post/detail",
    name: "PostDetail",
    component: PostDetail,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/message",
    name: "message",
    component: Message,
  }
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() { 
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
   },
  linkActiveClass: "active",
});

export default router;
