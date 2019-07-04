import { firestore, storage } from "../firebase";

import {
  SET_DONATIONS,
  SET_PAGINATION,
  SET_LOADING_STATUS,
  SET_DONATION_PAGE
} from "./mutations.type";
import { GET_DONATIONS, INIT_DONATIONS_PAGE } from "./actions.type";

const state = {
  donations: [],
  loadByPage: 2,
  pagination: 0,
  page: 1
};

const getters = {
  donations(state) {
    return state.donations;
  },
  pagination(state) {
    return state.pagination;
  },
  currentPage(state) {
    return state.page;
  }
};
const actions = {
  async [INIT_DONATIONS_PAGE]({ commit, rootState, state }, data) {
    commit(SET_DONATIONS, []);
    try {
      let ref = await firestore
        .collection("payments")
        .where("user", "==", rootState.auth.user.uid)
        .where("type", "==", data.type)
        .get();

      commit(SET_PAGINATION, Math.ceil(ref.docs.length / state.loadByPage));
    } catch (error) {
      console.log("Error while loading contributions: " + error);
    }
  },
  async [GET_DONATIONS]({ commit, rootState, state }, data) {
    commit(SET_LOADING_STATUS, true);

    let type = data.type;
    let page = data.page;
    try {
      let ref = null;

      if (page > 1) {
        let lastElement = state.donations[state.donations.length - 1];
        if (page < state.page) {
          ref = await firestore
            .collection("payments")
            .where("user", "==", rootState.auth.user.uid)
            .endAt(lastElement)
            .limit(state.loadByPage)
            .get();
        } else {
          ref = await firestore
            .collection("payments")
            .where("user", "==", rootState.auth.user.uid)
            .startAfter(lastElement)
            .limit(state.loadByPage)
            .get();
        }
      } else {
        ref = await firestore
          .collection("payments")
          .where("user", "==", rootState.auth.user.uid)
          .limit(state.loadByPage)
          .get();
      }

      commit(SET_DONATIONS, ref.docs);
      commit(SET_LOADING_STATUS, false);
      commit(SET_DONATION_PAGE, data.page);
    } catch (error) {
      console.log("Error while loading contributions: " + error);
    }
  }
};
const mutations = {
  [SET_DONATIONS](state, data) {
    state.donations = data;
  },
  [SET_PAGINATION](state, data) {
    state.pagination = data;
  },
  [SET_DONATION_PAGE](state, data) {
    state.page = data;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
