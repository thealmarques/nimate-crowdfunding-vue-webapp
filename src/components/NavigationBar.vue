<template>
  <!-- eslint-disable -->
  <nav class="navbar navbar-expand-md navbar-light bg-light border-top border-primary">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'home' }">
        <img src="@/assets/imgs/logo_app_1.png" width="35" height="35" alt="Nimiq funding logo">
        Nimate
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div v-if="!currentUser" class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/explore">
              <a class="nav-link">Explore campaigns</a>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'login' }">Login</router-link>
          </li>
        </ul>
        <router-link class="btn btn-outline-primary" :to="{ name: 'register' }">Register for free</router-link>
      </div>
      <div v-else class="navbar-nav ml-auto navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link class="btn btn-outline-primary" to="/start">Start Campaign</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/explore">
              <a class="nav-link">Explore campaigns</a>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >{{currentUser.displayName}}</a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <router-link to="/profile">
                <a class="dropdown-item" href="javascript:void(null);">Profile</a>
              </router-link>
              <router-link to="/mycampaigns">
                <a class="dropdown-item" href="javascript:void(null);">My Campaigns</a>
              </router-link>
              <a class="dropdown-item" href="javascript:void(null);">Donations</a>
              <a class="dropdown-item" href="javascript:void(null);">Contact us</a>
              <a class="dropdown-item" href="javascript:void(null);" @click="logout">Logout</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT_USER } from "@/store/actions.type";

export default {
  name: "NavigationBar",
  data() {
    return {};
  },
  methods: {
    logout() {
      let self = this;
      this.$store.dispatch(LOGOUT_USER).then(function() {
        self.$router.push({
          name: "login",
          params: {
            register_info: "Hope to see you soon"
          }
        });
      });
    }
  },
  computed: {
    ...mapGetters(["currentUser"])
  }
};
</script>
