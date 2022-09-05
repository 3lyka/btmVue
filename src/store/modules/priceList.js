import axios from '@/utils/axios';

const state = () => ({
  priceList: {},
  priceListError: {},
});

const mutations = {
  // priceListStart(state, payload) {
  //
  // },
  // priceListSuccess(state) {
  //
  // },
  priceListFailure(state, payload) {
    state.priceListError = payload;
  },
  setPriceList(state, payload) {
    payload.sort(function (a, b) {
      if (a.price < b.price) {
        return 1;
      }
      if (a.price > b.price) {
        return -1;
      }
      return 0;
    });

    state.offerList = payload;
  },
};

const actions = {
  getPriceListByFactoryId(context, id) {
    axios
      .post('rest/', {
        method: 'getPriceListByFactoryId',
        id: id,
      })
      .then((response) => {
        context.commit('setOffersList', response.data);
      })
      .catch((error) => {
        console.log('getPriceListByFactoryId error => ', error);
      });
  },
};

const getters = {};

const setters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  setters,
};
