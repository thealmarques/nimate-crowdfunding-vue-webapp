<template>
  <div class="container">
    <div class="py-2">
      <div class="container">
        <div class="row">
          <div class="col-md-12 pb-4">
            <div class="card text-center">
              <div class="card-body">
                <p class="card-text">
                  1. You can only have one active campaign.
                  <br>2. To delete a campaign you will have to specify a motive.
                  <br>3. The request will further be analyzed by the administration.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="okmessage" class="mt-1 alert alert-success" role="alert">{{ message }}</div>
        <div v-if="errormessage" class="mt-1 alert alert-danger" role="alert">{{ message }}</div>
        <div class="row">
          <div class="col-md-4">
            <ul class="list-group">
              <li
                id="ongoing"
                class="border-0 list-group-item d-flex justify-content-between align-items-center active"
                style="cursor:pointer;"
                @click="refreshCampaign(1)"
              >
                Ongoing
                <br>
                <i class="fa fa-spinner"></i>
              </li>
              <li
                id="ended"
                class="border-0 list-group-item d-flex justify-content-between align-items-center"
                style="cursor:pointer;"
                @click="refreshCampaign(2)"
              >
                Ended
                <br>
                <i class="fa fa-hourglass-end"></i>
              </li>
            </ul>
          </div>
          <div class="col-md-8">
            <div class="panel panel-default">
              <table class="table table-hover">
                <tbody>
                  <tr v-for="campaign in campaigns" v-bind:key="campaign.id">
                    <td
                      style="cursor:pointer;"
                      @click="openCampaign(campaign.id)"
                    >{{campaign.data().title}}</td>
                    <td class="text-right text-nowrap">
                      <button
                        class="btn btn-xs"
                        @click="deleteCampaign(campaign.id, campaign.data().title)"
                      >
                        <span class="fa fa-trash"></span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-left'">
      <div>
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <h3 class="text-center">Information Required</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <form @submit.prevent="confirmDelete">
                <div class="form-group">
                  <label>Campaign</label>
                  <input v-model="titleDelete" type="text" class="form-control" disabled>
                  <small class="form-text text-muted"></small>
                </div>
                <div class="form-group">
                  <label>Motive</label>
                  <textarea v-model="motive" class="form-control" rows="5" id="comment"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </vue-modaltor>
    <div class="py-3">
      <div>
        <div class="row">
          <div class="col-md-12 text-center">
            <p class="mb-0">© 2019 NIMIQ Funding. All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firestore, storage } from "@/firebase";
import { mapGetters } from "vuex";
let urlCrypt = require("url-crypt")(
  "%VKegd<T<\"'7S6,;YB'p[vnt\"x>u`49F(\\d*xdBB6EA"
);

let db = firestore;
export default {
  name: "MyCampaigns",
  data() {
    return {
      campaigns: [],
      loading: false,
      open: false,
      idDelete: "",
      titleDelete: "",
      motive: "",
      okmessage: false,
      errormessage: false,
      message: ""
    };
  },
  computed: {
    ...mapGetters(["currentUser", "error"])
  },
  methods: {
    openCampaign: function(id) {
      let data = {
        id: id
      };
      var base64 = urlCrypt.cryptObj(data);

      this.$router.push({
        name: "campaign",
        params: {
          hash: base64
        }
      });
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
    refreshCampaign(type) {
      switch (type) {
        case 1:
          document.getElementById("ended").classList.remove("active");
          document.getElementById("ongoing").classList.add("active");
          break;
        case 2:
          document.getElementById("ongoing").classList.remove("active");
          document.getElementById("ended").classList.add("active");
          break;
      }

      var self = this;
      let campaignRef = db
        .collection("campaigns")
        .where("user", "==", this.currentUser.uid);
      this.campaigns = [];

      campaignRef.get().then(function(querySnapshot) {
        //self.campaigns = querySnapshot.docs;
        querySnapshot.forEach(function(doc) {
          //doc.data() is never undefined for query doc snapshots
          let days = self.calculateDays(
            doc.data().creationDate,
            doc.data().duration
          );

          switch (type) {
            case 1:
              if (days.indexOf("Ended") == -1) {
                self.campaigns.push(doc);
              }
              break;
            case 2:
              if (days.indexOf("Ended") != -1) {
                self.campaigns.push(doc);
              }
              break;
          }
        });
        self.loading = true;
      });
    },
    deleteCampaign(id, title) {
      this.open = true;
      this.idDelete = id;
      this.titleDelete = title;
    },
    hideModal: function() {
      this.open = false;
    },
    confirmDelete() {
      let self = this;
      if (this.motive == "") {
        self.open = false;
        self.okmessage = false;
        self.errormessage = true;
        self.message = "Motive can't be empty. Try again.";
        return;
      }

      firebase
        .firestore()
        .collection("requests")
        .add({
          type: "delete",
          campaign: this.idDelete,
          user: currentUser.uid,
          motive: this.motive
        })
        .then(function(docRef) {
          self.open = false;
          self.okmessage = true;
          self.errormessage = false;
          self.message =
            "Request sent. This operation may take up to 12 hours. Please be patient.";
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
          self.open = false;
          self.okmessage = false;
          self.errormessage = true;
          self.message = "Error occurred. Contact support.";
        });
    }
  },
  mounted: function() {
    var self = this;
    let campaignRef = db
      .collection("campaigns")
      .where("user", "==", this.currentUser.uid);

    campaignRef.get().then(function(querySnapshot) {
      self.campaigns = querySnapshot.docs;
      self.loading = true;
    });
  }
};
</script>

<style  lang="css" scoped>
</style>