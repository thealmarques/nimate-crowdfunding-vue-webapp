import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import shared from "./shared.module";
import profile from "./profile.module";

Vue.use(Vuex);

// using global namespaced
export default new Vuex.Store({
  //strict: process.env.NODE_ENV !== "production",
  modules: {
    shared: shared,
    auth: auth,
    profile: profile
  }
});
