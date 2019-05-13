import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Home from "@/views/Home";
import Campaigns from "@/views/Campaigns";
import CreateCampaign from "@/views/CreateCampaign";
import Profile from "@/views/Profile";
import Campaign from "@/views/Campaign";

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
      component: CreateCampaign
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile
    },
    {
      path: "/campaign/:hash",
      name: "campaign",
      component: Campaign,
      props: true
    }
  ]
});

VueRouter.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    // TODO - To be fixed using vue persist
    /*if (!JSON.parse(vuexLocal.storage.vuex).currentUser) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }*/
  } else {
    next(); // make sure to always call next()!
  }
});

export default VueRouter;
