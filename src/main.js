import "@babel/polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap"; // https://getbootstrap.com/docs/4.1/getting-started/webpack
import firebase from "firebase";
import { SET_USER } from "@/store/mutations.type";
import VeeValidate from "vee-validate";
import VueModalTor from "vue-modaltor";
import VuejsDialog from "vuejs-dialog";
import "vuejs-dialog/dist/vuejs-dialog.min.css";
import Vuelidate from "vuelidate";

Vue.config.productionTip = false;

Vue.use(VeeValidate); //to be deprecated
Vue.use(VueModalTor);
Vue.use(VuejsDialog);
Vue.use(Vuelidate); // use this instead

//initialize the app only when we are sure Firebase Auth object is ready to use.
let app = "";
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if (user.emailVerified) {
      store.commit(SET_USER, user);
    }
  } else {
    store.commit(SET_USER, null);
  }
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
