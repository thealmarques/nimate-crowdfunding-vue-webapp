<template>
  <div class="campaign">
    <div class="py-2">
      <div class="container">
        <div class="row">
          <div class="col-md-10">
            <h1 class="display-5">{{detail.title}}</h1>
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
            <h5 class>{{detail.days}}</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="py-1">
      <div class="container" v-if="!loadingImages">
        <div class="row">
          <div id="carouselExampleIndicators" class="carousel slide col-md-6" data-ride="carousel">
            <div class="carousel-inner" role="listbox">
              <div
                class="carousel-item"
                v-for="(image, index) in images"
                v-bind:key="index"
                :class="{ active: index==0 }"
              >
                <img
                  :src="image"
                  style="
                        width: 100%;
                        height: 400px;
                        object-fit: contain;
                        font-family: 'object-fit: contain;';"
                />
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
                <p align="justify">{{detail.description}}</p>
              </div>
              <div class="tab-pane fade" id="tabtwo" role="tabpanel">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <i class="fa text-primary mr-2 fa-envelope"></i>
                    {{detail.email}}
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
                class="progress-bar"
                role="progressbar"
                :style="getPercentage(detail.balance,detail.goal)"
                aria-valuemin="0"
                aria-valuemax="100"
              >{{Math.round(detail.balance/detail.goal * 100)}}%</div>
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
              Goal: {{detail.goal.toLocaleString()}} NIMs
              <font color="#6c757d">
                <span style="font-size: 25.6px;">{{detail.balance.toLocaleString()}} Raised</span>
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
            <div v-if="info" class="mt-1 alert alert-success" role="alert">{{ info }}</div>
          </div>
        </div>
        <div class="row" style>
          <div class="col-lg-4 col-md-4 p-4 text-center" style>
            <i class="d-block fa mb-2 text-muted fa-3x fa-users"></i>
            <p class="mb-6">
              <i>Mine for this Campaign. You will borrow CPU Power.&nbsp;</i>
              <br />
              <i>Help others for free.</i>
              <br />
            </p>
            <div id="toggle" class="btn-group btn-group-toggle" data-toggle="buttons">
              <label id="onBtn" class="btn btn-primary" @click="initMining()">On</label>
              <label id="offBtn" class="btn btn-primary active" @click="stopMining()">
                Off
                <br />
              </label>
              <a class="btn btn-info" href="javascript:void(null);" @click="showModal()" style>
                <i class="fa fa-fw fa-1x py-1 fa-info"></i>
                <span class="badge badge-pill badge-primary"></span>
                <span class="badge badge-pill badge-primary"></span>
              </a>
            </div>
            <br />
            <br />
          </div>
          <div class="col-md-4">
            <img
              src="@/assets/nimiq_logo.png"
              width="200px"
              height="200px"
              class="img-fluid d-block"
              id="imgCampaign"
              style
            />
          </div>
          <div class="col-lg-4 col-md-4 p-4 text-center">
            <i class="d-block fa mb-2 text-muted fa-3x fa-user-o"></i>
            <p class="mb-6">
              <i>Fund this project&nbsp;</i>
              <br />
              <i>via NIMIQ</i>
              <i>.</i>
              <br />
            </p>
            <div class="btn-group">
              <button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Send NIMIQ</button>
              <div class="dropdown-menu">
                <form @submit.prevent="createTransaction" class="p-3">
                  <div class="form-group">
                    <label for="sendNimTransaction">Amount</label>
                    <input type="text" v-model="nim_amount" class="form-control" placeholder="NIMs" />
                  </div>
                  <button type="submit" class="btn btn-primary">
                    Send
                    <br />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-left'">
          <div>
            <div class="container">
              <div class="row">
                <div class="col-md-12">
                  <div id="formSlider">
                    <h3 class>
                      <div>
                        <span
                          style="text-align: center; background-color: rgb(255, 255, 255);"
                        >Sushipool&nbsp;</span>
                        <span
                          id="statusPool"
                          style="background-color:#C71818; color: rgb(255, 255, 255); font-size: 21px; font-weight: 700; text-align: center; white-space: nowrap;"
                        >{{nimiqlog}}</span>
                      </div>
                    </h3>
                    <p>Number of CPUs: {{ cpu }}</p>
                    <b-form-slider
                      ref="slider"
                      v-model="cpu"
                      :value="cpu"
                      @slide-start="slideStart"
                      @slide-stop="slideStop"
                      :min="cpuMin"
                      :max="cpuMax"
                    ></b-form-slider>
                  </div>
                  <div class="table-responsive">
                    <table class="table mt-4">
                      <thead>
                        <tr>
                          <th>Network</th>
                          <th>Information</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Your Hashrate</td>
                          <td>{{nimiq.hashRate}} Kb/s</td>
                        </tr>
                        <tr>
                          <td>Total Hashrate</td>
                          <td>{{stats.total_hashrate}} Kb/s</td>
                        </tr>
                        <tr>
                          <td>Balance (confirmed)</td>
                          <td>{{stats.balance.confirmed}} NIMs</td>
                        </tr>
                        <tr>
                          <td>Balance (unconfirmed)</td>
                          <td>{{stats.balance.unconfirmed}} NIMs</td>
                        </tr>
                        <tr>
                          <td>Online Devices</td>
                          <td>{{stats.online_devices}}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p>Payments are performed every 3 hours. The balance will reset after each payment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </vue-modaltor>
      </div>
    </div>
  </div>
</template>


<script>
import { firestore, storage } from "@/firebase";
import {
  GET_CAMPAIGN_DETAILS,
  GET_IMAGES,
  SAVE_TRANSACTION,
  START_MINING,
  STOP_MINING,
  CHANGE_THREADS,
  GET_STATS
} from "@/store/actions.type";
import { mapGetters } from "vuex";
import HubApi from "@nimiq/hub-api";

// Connect to testnet
const hubApi = new HubApi("https://hub.nimiq-testnet.com");
// Connect to mainnet
//const hubApi = new HubApi('https://hub.nimiq.com');

let urlCrypt = require("url-crypt")(
  "%VKegd<T<\"'7S6,;YB'p[vnt\"x>u`49F(\\d*xdBB6EA"
);

export default {
  name: "campaign",
  data() {
    return {
      campaign: urlCrypt.decryptObj(this.$route.params.hash).id,
      open: false,
      cpu: 1,
      cpuMin: 1,
      cpuMax: 2,
      hashrate: 0,
      balance_pool: 0,
      next_payout: 0,
      connections: 0,
      info: "",
      nim_amount: ""
    };
  },
  computed: {
    ...mapGetters([
      "currentUser",
      "images",
      "detail",
      "loadingImages",
      "nimiq",
      "nimiqlog",
      "stats"
    ])
  },
  methods: {
    stopMining() {
      document.getElementById("onBtn").classList.remove("active");
      this.$store.dispatch(STOP_MINING);
    },
    slideStart() {
      this.$store.dispatch(CHANGE_THREADS, this.cpu);
    },
    slideStop() {
      this.$store.dispatch(CHANGE_THREADS, this.cpu);
    },
    showModal: function() {
      this.open = true;
    },
    hideModal: function() {
      this.open = false;
    },
    initMining() {
      document.getElementById("offBtn").classList.remove("active");

      this.$store.dispatch(START_MINING, this.cpu);
    },
    async createTransaction() {
      this.info = "";
      const requestOptions = {
        appName: "Nimate",
        recipient: this.detail.address,
        value: this.nim_amount * 1e5 // 100 NIM
      };

      // All client requests are async and return a promise
      const signedTransaction = await hubApi.checkout(requestOptions);
      this.info = "Thank you for your contribution";
      let payment_details = {
        user: this.currentUser.uid,
        amount: this.nim_amount,
        recipient: this.detail.address,
        campaign: this.campaign,
        title: this.detail.title,
        type: "direct" //direct or mining
      };
      this.$store.dispatch(SAVE_TRANSACTION, payment_details);
    },
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
    getPercentage: function(balance, goal) {
      let percentagem = Math.round((balance / goal) * 100);
      return "width: " + percentagem + "%";
    }
  },
  created: function() {
    let ncpu = navigator.hardwareConcurrency;
    if (ncpu > 0) {
      this.cpuMax = ncpu;
      this.cpu = ncpu / 2;
    }
    let current = this;
    this.$store.dispatch(GET_CAMPAIGN_DETAILS, this.campaign).then(function() {
      current.$store.dispatch(GET_IMAGES);

      current.$nextTick(function() {
        window.setInterval(() => {
          current.$store.dispatch(GET_STATS);
        }, 500);
      });
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