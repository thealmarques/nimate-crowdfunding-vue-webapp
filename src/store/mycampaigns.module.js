import { SET_MYCAMPAIGNS, SET_LOADING_STATUS } from "./mutations.type";
import {
  LOAD_MYCAMPAIGNS,
  REFRESH_MYCAMPAIGNS,
  DELETE_MYCAMPAIGN
} from "./actions.type";
import { firestore, storage } from "../firebase";

const state = {
  mycampaigns: []
};
const getters = {
  mycampaigns(state) {
    return state.mycampaigns;
  }
};

const actions = {
  async [LOAD_MYCAMPAIGNS]({ commit, rootState }) {
    commit(SET_LOADING_STATUS, true);
    await firestore
      .collection("campaigns")
      .where("user", "==", rootState.auth.user.uid)
      .get()
      .then(function(querySnapshot) {
        commit(SET_MYCAMPAIGNS, querySnapshot.docs);
        commit(SET_LOADING_STATUS, false);
      });
  },
  async [REFRESH_MYCAMPAIGNS]({ commit, rootState }, type) {
    commit(SET_LOADING_STATUS, true);
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

    let campaignRef = firestore
      .collection("campaigns")
      .where("user", "==", rootState.auth.user.uid);
    let auxiliar_campaigns = [];
    commit(SET_MYCAMPAIGNS, auxiliar_campaigns);

    campaignRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let days = calculateDays(doc.data().creationDate, doc.data().duration);

        switch (type) {
          case 1:
            if (days.indexOf("Ended") == -1) {
              auxiliar_campaigns.push(doc);
            }
            break;
          case 2:
            if (days.indexOf("Ended") != -1) {
              auxiliar_campaigns.push(doc);
            }
            break;
        }
      });
      commit(SET_MYCAMPAIGNS, auxiliar_campaigns);
      commit(SET_LOADING_STATUS, false);
    });
  },
  async [DELETE_MYCAMPAIGN]({ commit, rootState }, data) {
    firestore
      .collection("requests")
      .add({
        type: "delete",
        campaign: data.idDelete,
        user: rootState.auth.user.uid,
        motive: data.motive
      })
      .then(function() {
        commit(SET_LOADING_STATUS, false);
      })
      .catch(function() {
        commit(SET_LOADING_STATUS, false);
      });
  }
};

const mutations = {
  [SET_MYCAMPAIGNS](state, data) {
    state.mycampaigns = data;
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
