import { SET_IMAGES, SET_LOADING_IMAGES, SET_DETAIL } from "./mutations.type";
import { GET_CAMPAIGN_DETAILS, GET_IMAGES } from "./actions.type";
import { firestore, storage } from "../firebase";
import HubApi from "@nimiq/hub-api";

const state = {
  images: [],
  campaign: null,
  loading: false,
  detail: {
    id: "",
    title: "",
    description: "",
    email: "",
    goal: "",
    balance: "",
    days: "",
    completed: "",
    address: "",
    percentage: "",
    images: 0
  },
  nimiq: {}
};

const getters = {
  images(state) {
    return state.images;
  },
  detail(state) {
    return state.detail;
  },
  loadingImages(state) {
    return state.loading;
  }
};

const actions = {
  async [GET_CAMPAIGN_DETAILS]({ commit }, campaign) {
    //Get Firebase information
    var self = this;
    let campaignRef = firestore.collection("campaigns").doc(campaign);
    commit(SET_IMAGES, []);
    commit(SET_LOADING_IMAGES, true);

    await campaignRef.get().then(function(doc) {
      //doc.data() is never undefined for query doc snapshots
      let data = {};
      data.id = doc.id;
      data.title = doc.data().title;
      data.description = doc.data().description;
      data.email = doc.data().email;
      data.goal = Number(doc.data().goal);
      data.balance = Number(doc.data().balance);
      data.days = calculateDays(doc.data().creationDate, doc.data().duration);
      data.completed = Math.round((doc.data().balance / doc.data().goal) * 100);
      data.address = doc.data().address;
      data.percentage = "width: " + self.completed + "%";
      data.images = doc.data().images;

      commit(SET_DETAIL, data);
    });
  },
  async [GET_IMAGES]({ commit, state }) {
    let images = [];
    for (let i = 0; i < state.detail.images; i++) {
      await storage
        .ref()
        .child("/campaigns/" + state.detail.id + "/img_pos" + i)
        .getDownloadURL()
        .then(function(url) {
          images[i] = url;
        })
        .catch(function(error) {
          console.error(error);
        });
    }
    commit(SET_IMAGES, images);
    commit(SET_LOADING_IMAGES, false);
  }
};
const mutations = {
  [SET_IMAGES](state, data) {
    state.images = data;
  },
  [SET_DETAIL](state, detail) {
    state.detail = detail;
  },
  [SET_LOADING_IMAGES](state, data) {
    state.loading = data;
  }
};

function calculateDays(date, duration) {
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
}

export default {
  state,
  actions,
  mutations,
  getters
};
