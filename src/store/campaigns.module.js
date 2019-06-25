import {
  SET_LOADING_STATUS,
  SET_LOADMORE,
  CLEAR_LOADMORE,
  SET_CAMPAIGNS,
  SET_LOADSTATUS
} from "./mutations.type";
import { LOAD_CAMPAIGNS, LOAD_MORE, RESET_LOAD } from "./actions.type";
import { firestore, storage } from "../firebase";

const state = {
  campaigns: [],
  loadMore: 2,
  loadSize: 2,
  completed: false
};

const getters = {
  campaigns(state) {
    return state.campaigns;
  },
  loadMore(state) {
    return state.loadMore;
  },
  loadSize(state) {
    return state.loadSize;
  },
  completed(state) {
    return state.completed;
  }
};

const actions = {
  async [LOAD_CAMPAIGNS]({ commit, state }) {
    let firestore_query = firestore.collection("campaigns").limit(2);
    if (state.loadMore > 2) {
      //https://firebase.google.com/docs/firestore/query-data/query-cursors
      let lastElement = state.campaigns[state.campaigns.length - 1];
      firestore_query = firestore
        .collection("campaigns")
        .startAfter(lastElement)
        .limit(state.loadSize);
    } else {
      commit(SET_LOADING_STATUS, true);
    }

    try {
      await firestore_query.get().then(function(querySnapshot) {
        if (
          querySnapshot.docs.length % 2 != 0 ||
          querySnapshot.docs.length == 0
        ) {
          commit(SET_LOADSTATUS, true);
        }

        commit(SET_CAMPAIGNS, querySnapshot.docs);
        commit(SET_LOADING_STATUS, false);

        querySnapshot.docs.forEach(function(doc) {
          storage
            .ref()
            .child("/campaigns/" + doc.id + "/img_pos0")
            .getMetadata()
            .then(function(metadata) {
              if (metadata.customMetadata.height < 370) {
                document.getElementById(doc.id).style.objectFit = "contain";
                //IE
                document.getElementById(doc.id).style.fontFamily =
                  "object-fit: contain;";
              }
              //metadata.customMetadata.width
            })
            .catch(function(error) {
              console.log("Error retrieving campaigns: " + error);
            });

          storage
            .ref()
            .child("/campaigns/" + doc.id + "/img_pos0")
            .getDownloadURL()
            .then(function(url) {
              document.getElementById(doc.id).src = url;
            })
            .catch(function(error) {
              console.error(error);
            });
        });
      });
    } catch (error) {
      console.log("Error: " + error);
    }
  },
  async [LOAD_MORE]({ commit, dispatch }) {
    commit(SET_LOADMORE);
    dispatch(LOAD_CAMPAIGNS);
  },
  async [RESET_LOAD]({ commit }) {
    commit(CLEAR_LOADMORE);
  }
};

const mutations = {
  [SET_LOADMORE](state) {
    state.loadMore += state.loadSize;
  },
  [CLEAR_LOADMORE](state) {
    state.loadMore = 0;
  },
  [SET_CAMPAIGNS](state, data) {
    if (data.length === 0) return;

    if (state.loadMore > 2) {
      state.campaigns = state.campaigns.concat(data);
    } else {
      state.campaigns = data;
    }
  },
  [CLEAR_LOADMORE](state) {
    state.loadMore = state.loadSize;
    state.completed = false;
    state.campaigns = [];
  },
  [SET_LOADSTATUS](state, data) {
    state.completed = data;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
