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
import Start from "../views/home/Start.vue";
import Home from "../views/home/Home.vue";
import Shop from "../views/shop/Shop.vue";
import MyPage from "../views/mypage/MyPage.vue";
import ChangePassword from "../views/mypage/ChangePassword.vue";
import PaymentHistory from "../views/mypage/PaymentHistory.vue";
import CommentList from "../views/mypage/CommentList.vue";
import store from "../store";
import AdminMember from "../views/admin/member/Member.vue";
import AdminMemberDetail from "../views/admin/member/Detail.vue";
import CreateNickname from "../views/CreateNickname.vue";
import CompleteRegister from "../views/CompleteRegister.vue";
import ConfirmEmail from "../views/ConfirmEmail.vue";
import ResetPassword from "../views/ResetPassword.vue";
import FindPassword from "../views/FindPassword.vue";
import Choose from "../views/home/Choose.vue";
import ChooseTester from "../views/home/ChooseTester.vue";
import MessageChoose from "../views/message/Choose.vue";
import PostChoose from "../views/post/Choose.vue";

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
    redirect: "/choose",
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
    path: "/complete/register",
    name: "CompleteRegister",
    component: CompleteRegister,
  },
  {
    path: "/confirm-email",
    name: "ConfirmEmail",
    component: ConfirmEmail,
  },
  {
    path: "/reset-password",
    name: "resetPassword",
    component: ResetPassword,
  },
  {
    path: "/find-password",
    name: "findPassword",
    component: FindPassword,
  },
  {
    path: "/message",
    name: "message",
    component: Message,
  },
  {
    path: "/shop",
    name: "shop",
    component: Shop,
  },
  {
    path: "/my",
    name: "mypage",
    component: MyPage,
  },
  {
    path: "/my/change/password",
    name: "changePassord",
    component: ChangePassword,
  },
  {
    path: "/my/payment/history",
    name: "paymentHistory",
    component: PaymentHistory,
  },
  {
    path: "/my/comment",
    name: "commentList",
    component: CommentList,
  },
  {
    path: "/admin/member",
    name: "adminMember",
    component: AdminMember,
  },
  {
    path: "/admin/member/detail",
    name: "adminMemberDetail",
    component: AdminMemberDetail,
  },
  {
    path: "/create/nickname",
    name: "createNikcname",
    component: CreateNickname,
  },
  {
    path: "/choose",
    name: "choose",
    component: Choose,
  },
  {
    path: "/choose/tester",
    name: "chooseTeseter",
    component: ChooseTester,
  },
  {
    path: "/message/choose",
    name: "messageChoose",
    component: MessageChoose,
  },
  {
    path: "/post/choose",
    name: "postChoose",
    component: PostChoose,
  },
  
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
