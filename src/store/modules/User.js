import axios from '@/utils/axios';

const getDefaultState = () => ({
  id: '',
  email: '',
  fullname: '',
  position: '',
  groups: '',
  token: '',
});

const state = getDefaultState();

const mutations = {
  setToken: (state, token) => {
    state.token = token;
    if (token === 'clear') {
      localStorage.clear();
    } else if (token) {
      localStorage.setItem('token', token);
    }
  },

  setDefaultState: (state) => {
    // todo: устранить eslint ошибку.
    // eslint-disable-next-line
    state = getDefaultState();
  },
  setUserData: (state, data) => {
    state.id = data.userId;
    state.email = data.email;
    state.fullname = data.fullname;
    state.position = data.position;
    state.groups = data.groups;
  },
};

const actions = {
  async login({ commit, dispatch }, form) {
    try {
      const response = await axios.post('rest/user/login/', {}, { auth: form });
      commit('setToken', response.data.token);
      if (response.data.token) {
        await dispatch('info');
        return response;
      }
    } catch (error) {
      if (error.response.status === 401) {
        throw new Error('Неверный логин или пароль');
      }
      return Promise.reject(error);
    } finally {
      this.loading = false;
    }
  },
  async info({ commit }) {
    try {
      const response = await axios.post('rest/user/info/');
      commit('setUserData', response.data);
    } catch (error) {
      console.log('user info error => ', error);
    }
  },
  logout({ commit }) {
    axios
      .get('rest/user/logout/')
      .then(() => {
        commit('setToken', 'clear');
        commit('setDefaultState');
      })
      .catch((error) => {
        console.log('user logout error => ', error);
      });
  },
  async restorePassword(context, form) {
    try {
      return await axios.post('rest/user/restorePassword/', { form });
    } catch (error) {
      if (error.response.status === 404) {
        throw new Error(error.response.data.message);
      }
      return Promise.reject(error);
    } finally {
      this.loading = false;
    }
  },
};

const getters = {
  isTrader: (state) => {
    return (
      state.groups.indexOf('Portal_BMM_ARM_Trader') !== -1 ||
      state.groups.indexOf('Portal_BMM_ARM_Head_Trader') !== -1 ||
      state.groups.indexOf('Portal_BMM_ARM_Head_Direction') !== -1
    );
  },
  isUmiop: (state) => {
    return state.groups.indexOf('Portal_BMM_ARM_UMIOP') !== -1;
  },
  isSupervisorBO: (state) => {
    return state.groups.indexOf('Portal_BBM_ARM_BO') !== -1;
  },
};

const setters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  setters,
};
