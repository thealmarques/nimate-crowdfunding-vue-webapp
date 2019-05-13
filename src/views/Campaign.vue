<template>
  <div class="campaign" v-if="loading">
    <div class="py-2">
      <div class="container">
        <div class="row">
          <div class="col-md-10">
            <h1 class="display-5">{{this.title}}</h1>
          </div>
          <div class="col-md-2">
            <a class="btn btn-social-icon btn-twitter">
              <span class="fa fa-twitter"></span>
            </a>
            <a class="btn btn-social-icon btn-twitter">
              <span class="fa fa-facebook"></span>
            </a>
            <a class="btn btn-social-icon btn-twitter">
              <span class="fa fa-google"></span>
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <h5 class>{{this.days}}</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="py-1">
      <div class="container">
        <div class="row">
          <div
            id="carouselExampleIndicators"
            class="carousel slide col-md-6"
            data-ride="carousel"
            v-bind:key="this.render"
          >
            <ol class="carousel-indicators">
              <li
                data-target="#carouselExampleIndicators"
                :data-slide-to="index"
                v-for="(image, index) in images"
                :class="{ active: index==0 }"
              >></li>
            </ol>
            <div class="carousel-inner" style="height: 100%;">
              <div
                class="carousel-item"
                v-for="(image, index) in images"
                :class="{ active: index==0 }"
              >
                <img
                  :src="image"
                  style=" width: 100%;
                        height: 320px;
                        object-fit: contain;
                        font-family: 'object-fit: contain;';"
                >
              </div>
            </div>
            <a
              class="carousel-control-prev"
              href="#carouselExampleIndicators"
              role="button"
              data-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next"
              href="#carouselExampleIndicators"
              role="button"
              data-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
          <div class="col-md-6">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a href class="nav-link active" data-toggle="tab" data-target="#tabone">Description</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href data-toggle="tab" data-target="#tabtwo">More</a>
              </li>
            </ul>
            <div class="tab-content mt-2">
              <div class="tab-pane fade show active" id="tabone" role="tabpanel">
                <p align="justify">{{this.description}}</p>
              </div>
              <div class="tab-pane fade" id="tabtwo" role="tabpanel">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <i class="fa text-primary mr-2 fa-envelope"></i>
                    {{this.email}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-3">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="progress">
              <div
                class="progress-bar progress-bar-striped"
                role="progressbar"
                :style="this.percentage"
              >{{this.completed}}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class>
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h2 class>
              Goal: {{this.goal.toLocaleString()}} NIMs
              <font color="#6c757d">
                <span style="font-size: 25.6px;">{{this.balance.toLocaleString()}} Raised</span>
              </font>
            </h2>
          </div>
        </div>
      </div>
    </div>
    <div class="py-2">
      <div class="container">
        <div class="row">
          <div class="text-center mx-auto col-md-12 py-3">
            <h1>Help Fund this Campaign</h1>
          </div>
        </div>
        <div class="row" style>
          <div class="col-lg-4 col-md-4 p-4 text-center" style>
            <i class="d-block fa mb-2 text-muted fa-3x fa-users"></i>
            <p class="mb-6">
              <i>Mine for this Campaign. You will borrow CPU Power.&nbsp;</i>
              <br>
              <i>Help others for free.</i>
              <br>
            </p>
            <div id="toggle" class="btn-group btn-group-toggle" data-toggle="buttons">
              <label id="onBtn" class="btn btn-primary">On</label>
              <label id="offBtn" class="btn btn-primary active">
                Off
                <br>
              </label>
              <a class="btn btn-info" href="javascript:void(null);" style>
                <i class="fa fa-fw fa-1x py-1 fa-info"></i>
                <span class="badge badge-pill badge-primary"></span>
                <span class="badge badge-pill badge-primary"></span>
              </a>
            </div>
            <br>
            <br>
          </div>
          <div class="col-md-4">
            <img
              src="@/assets/nimiq_logo.png"
              width="200px"
              height="200px"
              class="img-fluid d-block"
              id="imgCampaign"
              style
            >
          </div>
          <div class="col-lg-4 col-md-4 p-4 text-center">
            <i class="d-block fa mb-2 text-muted fa-3x fa-user-o"></i>
            <p class="mb-6">
              <i>Fund this project&nbsp;</i>
              <br>
              <i>via NIMIQ</i>
              <i>.</i>
              <br>
            </p>
            <a class="btn btn-primary" href="javascript:void(null);">Send NIMIQ</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { firestore, storage } from "@/firebase";
let urlCrypt = require("url-crypt")(
  "%VKegd<T<\"'7S6,;YB'p[vnt\"x>u`49F(\\d*xdBB6EA"
);

export default {
  name: "campaign",
  data() {
    return {
      campaign: urlCrypt.decryptObj(this.$route.params.hash).id,
      address: "",
      title: "",
      description: "",
      email: "",
      goal: "",
      balance: "",
      days: "",
      completed: "",
      percentage: "",
      images: [],
      render: 0,
      open: false,
      cpu: 1,
      cpuMin: 1,
      cpuMax: 2,
      loading: false,
      hashrate: 0,
      balance_pool: 0,
      next_payout: 0,
      connections: 0,
      info: ""
    };
  },
  methods: {
    calculateDays: function(date, duration) {
      let auxDate = new Date(date);
      let date1 = new Date();
      let days = parseInt(duration);
      auxDate.setDate(auxDate.getDate() + days);
      if (date1 > auxDate) {
        return "Ended";
      }

      let timeDiff = Math.abs(auxDate.getTime() - date1.getTime());
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (diffDays == 1) {
        return diffDays + " day left";
      }
      return diffDays + " days left";
    },
    forceRerender() {
      this.render += 1;
    }
  },
  created: function() {
    let ncpu = navigator.hardwareConcurrency;
    if (ncpu > 0) {
      this.cpuMax = ncpu;
      this.cpu = ncpu / 2;
    }
    //Get Firebase information
    var self = this;
    let campaignRef = firestore.collection("campaigns").doc(this.campaign);

    campaignRef.get().then(function(doc) {
      //doc.data() is never undefined for query doc snapshots
      self.title = doc.data().title;
      self.description = doc.data().description;
      self.email = doc.data().email;
      self.goal = Number(doc.data().goal);
      self.balance = Number(doc.data().balance);
      self.days = self.calculateDays(
        doc.data().creationDate,
        doc.data().duration
      );
      self.completed = Math.round((doc.data().balance / doc.data().goal) * 100);
      self.address = doc.data().address;
      self.percentage = "width: " + self.completed + "%";

      for (let i = 0; i < doc.data().images; i++) {
        storage
          .ref()
          .child("/campaigns/" + doc.id + "/img_pos" + i)
          .getDownloadURL()
          .then(function(url) {
            self.images[i] = url;
            if (i == doc.data().images - 1) {
              self.forceRerender();
              self.loading = true;
            }
          })
          .catch(function(error) {
            console.error(error);
          });
      }
    });
  }
};
</script>

<style scoped>
#imgCampaign {
  display: block;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

#formSlider {
  text-align: center;
}
</style>