<template>
  <div class="donations">
    <div class="container py-5">
      <div class="row">
        <div class="col-md-2">
          <div class="list-group">
            <a href="#" class="list-group-item list-group-item-action active">Direct Transfer</a>
            <a href="#" class="list-group-item list-group-item-action">Mining</a>
          </div>
        </div>
        <div class="col-md-10">
          <div class="list-group" v-if="!isLoading">
            <a
              v-for="donation in donations"
              v-bind:key="donation.id"
              class="list-group-item list-group-item-action flex-column align-items-start"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{donation.data().title}}</h5>
                <small>{{convertTimeStampToData(donation.data().date)}}</small>
              </div>
              <p class="mb-1">{{donation.data().amount}} NIMs</p>
              <small></small>
            </a>
          </div>
          <ul class="pagination py-4" v-if="pagination > 1">
            <li
              v-for="index in pagination"
              v-bind:key="index"
              v-bind:class="{ active: index == currentPage, 'page-item': index >= 1}"
            >
              <a class="page-link" @click="goToPage(index)">{{index}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_DONATIONS, INIT_DONATIONS_PAGE } from "@/store/actions.type";
import moment from "moment";

export default {
  name: "donations",
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "currentUser",
      "donations",
      "isLoading",
      "pagination",
      "currentPage"
    ])
  },
  methods: {
    convertTimeStampToData(ts) {
      return moment(ts).format("DD/MM/YYYY hh:mm");
    },
    goToPage(index) {
      this.$store.dispatch(GET_DONATIONS, { type: "direct", page: index });
    }
  },
  created: function() {
    INIT_DONATIONS_PAGE;
    this.$store.dispatch(INIT_DONATIONS_PAGE, { type: "direct" });
    this.$store.dispatch(GET_DONATIONS, { type: "direct", page: 1 });
  }
};
</script>

<style scoped>
</style>