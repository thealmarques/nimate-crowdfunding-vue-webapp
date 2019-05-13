import {
  SET_USER,
  SET_ERROR,
  CLEAR_ERROR,
  SET_LOADING_STATUS,
  SET_VERIFICATION,
  CLEAR_VERIFICATION,
  SET_MESSAGE,
  CLEAR_MESSAGE
} from "./mutations.type";
import {
  SIGN_UP_USER,
  LOGIN_USER,
  LOGOUT_USER,
  RESET_PASSWORD,
  VERIFY_USER
} from "./actions.type";
import { authentication } from "../firebase";

const state = {
  user: null
};

const getters = {
  currentUser(state) {
    return state.user;
  }
};

const actions = {
  async [SIGN_UP_USER]({ commit }, credencials) {
    try {
      commit(SET_LOADING_STATUS, true);
      commit(CLEAR_MESSAGE);
      commit(CLEAR_ERROR);
      await authentication.createUserWithEmailAndPassword(
        credencials.email,
        credencials.password
      );
      commit(SET_USER, authentication.currentUser);
    } catch (error) {
      commit(SET_ERROR, error);
    } finally {
      commit(SET_LOADING_STATUS, false);
    }
  },
  async [LOGIN_USER]({ commit }, credencials) {
    try {
      commit(SET_LOADING_STATUS, true);
      commit(CLEAR_MESSAGE);
      commit(CLEAR_ERROR);
      await authentication.signInWithEmailAndPassword(
        credencials.email,
        credencials.password
      );
      if (!authentication.currentUser.emailVerified) {
        commit(SET_VERIFICATION);
        commit(SET_USER, null);
        commit(CLEAR_ERROR);
      } else {
        commit(SET_USER, authentication.currentUser);
        commit(CLEAR_VERIFICATION);
      }
    } catch (error) {
      commit(SET_ERROR, error);
      commit(CLEAR_VERIFICATION);
    } finally {
      commit(SET_LOADING_STATUS, false);
    }
  },
  async [LOGOUT_USER]({ commit }) {
    commit(CLEAR_MESSAGE);
    commit(CLEAR_ERROR);
    await authentication.signOut();
    commit(SET_USER, null);
  },
  async [VERIFY_USER]({ commit }) {
    try {
      commit(CLEAR_MESSAGE);
      await authentication.currentUser.sendEmailVerification();
      //Verification sent
      commit(SET_MESSAGE, "Your verification email was sent");
      commit(CLEAR_VERIFICATION);
    } catch (error) {
      commit(SET_ERROR, error);
      commit(SET_VERIFICATION);
    } finally {
      commit(SET_LOADING_STATUS, false);
    }
  },
  async [RESET_PASSWORD]({ commit }, email) {
    try {
      commit(CLEAR_MESSAGE);
      commit(CLEAR_ERROR);
      await authentication.sendPasswordResetEmail(email);
      //reset request sent
      commit(SET_MESSAGE, "A new password was sent to your email address");
      commit(CLEAR_VERIFICATION);
    } catch (error) {
      commit(SET_ERROR, error);
      commit(CLEAR_MESSAGE);
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
