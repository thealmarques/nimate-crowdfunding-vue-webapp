import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Home from "@/views/Home";
import Campaigns from "@/views/Campaigns";
import CreateCampaign from "@/views/CreateCampaign";
import Profile from "@/views/Profile";
import Campaign from "@/views/Campaign";
import MyCampaigns from "@/views/MyCampaigns";
import Store from "@/store/index.js";

Vue.use(Router);

const VueRouter = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      props: true
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/explore",
      name: "campaigns",
      component: Campaigns
    },
    {
      path: "/start",
      name: "createCampaign",
      component: CreateCampaign,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/campaign/:hash",
      name: "campaign",
      component: Campaign,
      props: true
    },
    {
      path: "/mycampaigns",
      name: "mycampaigns",
      component: MyCampaigns,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

VueRouter.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (Store.getters.currentUser == null) {
      next({
        path: "/login"
      });
    } else {
      //let user = Store.getters.currentUser;
      /*if (to.matched.some(record => record.meta.is_admin)) {
        if (user.is_admin == 1) {
          next();
        } else {
          next({ name: "userboard" });
        }
      } else {
        next();
      }*/
      next();
    }
  } else {
    next();
  }
});

export default VueRouter;
