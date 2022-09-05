import axios from '@/utils/axios';
import { logError } from '@/utils/helpers/logError';

const initialState = () => ({
  topMenu: [],
  bottomMenu: [],
  leftMenu: [],
});

const state = initialState;

const mutations = {
  resetState(state) {
    Object.assign(state, initialState());
  },

  // menuStart(state, payload) {
  //
  // },
  // menuSuccess(state) {
  //
  // },
  // menuFailure(state, payload) {
  //
  // },
  setMenuList(state, payload) {
    state.topMenu = payload.top;
    state.bottomMenu = payload.bottom;
    state.leftMenu = payload.left;
  },
};

const actions = {
  resetState({ commit }) {
    commit('resetState');
  },

  getMenu(context) {
    axios
      .get('rest/menu/getMenu/')
      .then((response) => {
        context.commit('setMenuList', response.data);
      })
      .catch((error) => {
        logError(error);
      })
      .finally(() => (this.loading = false));
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
