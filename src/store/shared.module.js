import {
  SET_ERROR,
  SET_LOADING_STATUS,
  CLEAR_ERROR,
  SET_VERIFICATION,
  CLEAR_VERIFICATION,
  SET_MESSAGE,
  CLEAR_MESSAGE
} from "./mutations.type";

const state = {
  error: null,
  isLoading: false,
  verification: true,
  message: null
};

const getters = {
  isLoading(state) {
    return state.loadingStatus;
  },
  error(state) {
    return state.error;
  },
  verification(state) {
    return state.verification;
  },
  message(state) {
    return state.message;
  }
};

const actions = {};

const mutations = {
  [SET_ERROR](state, error) {
    state.error = error;
  },
  [CLEAR_ERROR](state) {
    state.error = null;
  },
  [SET_LOADING_STATUS](state, loadingStatus) {
    state.isLoading = loadingStatus;
  },
  [SET_VERIFICATION](state) {
    state.verification = false;
  },
  [CLEAR_VERIFICATION](state) {
    state.verification = true;
  },
  [SET_MESSAGE](state, msg) {
    state.message = msg;
  },
  [CLEAR_MESSAGE](state) {
    state.message = null;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
