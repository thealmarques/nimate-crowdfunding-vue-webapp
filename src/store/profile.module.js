import {
  SET_ERROR,
  CLEAR_ERROR,
  SET_LOADING_STATUS,
  SET_USER
} from "./mutations.type";
import {
  UPDATE_USER,
  CHANGE_PASSWORD,
  DELETE_ACCOUNT,
  LOGOUT_USER
} from "./actions.type";
import { authentication } from "../firebase";

const state = {};

const getters = {};

const actions = {
  async [UPDATE_USER]({ commit }, profile) {
    try {
      commit(SET_LOADING_STATUS, true);
      commit(CLEAR_ERROR);
      await authentication.currentUser.updateProfile(profile);
      commit(SET_USER, authentication.currentUser);
    } catch (error) {
      commit(SET_ERROR, error);
    } finally {
      commit(SET_LOADING_STATUS, false);
    }
  },
  async [CHANGE_PASSWORD]({ commit }, password) {
    try {
      commit(SET_LOADING_STATUS, true);
      commit(CLEAR_ERROR);
      await authentication.currentUser.updatePassword(password);
      commit(SET_USER, authentication.currentUser);
    } catch (error) {
      commit(SET_ERROR, error);
    } finally {
      commit(SET_LOADING_STATUS, false);
    }
  },
  async [DELETE_ACCOUNT]({ commit }) {
    try {
      commit(SET_LOADING_STATUS, true);
      commit(CLEAR_ERROR);
      await authentication.currentUser.delete();
      commit(LOGOUT_USER);
    } catch (error) {
      commit(SET_ERROR, error);
    } finally {
      commit(SET_LOADING_STATUS, false);
    }
  }
};

const mutations = {
  [SET_USER](state, user) {
    state.user = user;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
