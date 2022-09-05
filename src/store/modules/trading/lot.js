import axios from '@/utils/axios';

const initialState = () => ({
  isCalendarLotFormDisable: false,
  calendarLotFormOpen: false,
  isUmiopEdited: false,
  createLotError: null,
  createLotDate: {},
  lot: {
    shippingDate: '',
    factory: {
      multiplicity: null,
      name: '',
    },
    product: {
      name: '',
    },
    status: {},
    regions: [],
    priceMin: '',
    isResold: false,
    resoldInLot: false,
  },
  getLotStatus: {},
  lots: null,
  isSaleButtonClicked: false,
});

const state = initialState;

const mutations = {
  resetState(state) {
    Object.assign(state, initialState());
  },

  lotFormStart(state, payload) {
    state.lot = {};
    state.calendarLotFormOpen = true;
    state.isCalendarLotFormDisable = false;
    state.createLotDate = payload;
  },
  lotFormSuccess(state) {
    state.calendarLotFormOpen = false;
  },
  lotFormFailure(state, payload) {
    state.isCalendarLotFormDisable = true;
    state.createLotError = payload;
  },
  lotFormClose(state) {
    state.calendarLotFormOpen = false;
    state.isCalendarLotFormDisable = false;
    state.isSaleButtonClicked = false;
    state.lot = {};
  },
  lotFormEdit(state, payload) {
    state.lot = payload;
    state.calendarLotFormOpen = true;
  },
  setLotIsUmiopEdited(state) {
    state.isUmiopEdited = true;
  },
  setLot(state, payload) {
    state.lot = payload;
  },
  setLotFormToSale(state, payload) {
    state.lot = payload;
    state.calendarLotFormOpen = true;
  },

  // todo: Логика формы кандидат на рефакторинг. Коммиты предназначены только для dev tools.
  // в текущей реализации может использоваться для отслеживания коммитов. В частности в CalendarLotForm.vue
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getListSuccess() {},
  setLots(state, payload) {
    state.lots = payload;
  },
  setIsSaleButtonClicked(state, { value }) {
    state.isSaleButtonClicked = value;
  },
};

const actions = {
  resetState({ commit }) {
    commit('resetState');
  },

  getListByMounts(context, confirmData) {
    axios
      .post('rest/trading/lot/getListByMounts/', confirmData)
      .then((response) => {
        context.commit('setLots', response.data);
        //   context.commit('getListSuccess')
      })
      .catch((error) => {
        console.log('getListByMounts error => ', error);
      })
      .finally(() => (this.loading = false));
  },
  add(context, confirmData) {
    axios
      .post('rest/trading/lot/add/', confirmData)
      .then(() => {
        context.commit('lotFormSuccess');
      })
      .catch((error) => {
        context.commit('lotFormFailure', error);
      })
      .finally(() => (this.loading = false));
  },
  edit(context, confirmData) {
    axios
      .post('rest/trading/lot/edit/', confirmData)
      .then(() => {
        context.commit('lotFormSuccess');
      })
      .catch((error) => {
        context.commit('lotFormFailure', error);
      })
      .finally(() => (this.loading = false));
  },
  delete(context, confirmData) {
    axios
      .post('rest/trading/lot/delete/', confirmData)
      .then(() => {
        context.commit('lotFormSuccess');
      })
      .catch((error) => {
        context.commit('lotFormFailure', error);
        console.log('delete lot error => ', error);
      })
      .finally(() => (this.loading = false));
  },
  async getById(context, confirmData) {
    try {
      const response = await axios.post('rest/trading/lot/getById/', {
        id: confirmData.id,
      });
      context.commit('setLot', response.data);
    } catch (error) {
      if (error.response.status === 404) {
        throw new Error(error.response.data.message);
      }
      console.log('lot getById error => ', error);
    }
  },
  setUmiopCheckStatusById(context, id) {
    axios
      .post('rest/trading/lot/setUmiopCheckStatusById/', { id: id })
      .then(() => {
        context.commit('getListSuccess');
      })
      .catch((error) => {
        console.log('lot setUmiopCheckStatusById error => ', error);
      });
  },
  confirmDescriptionByTrader(context, id) {
    axios
      .post('rest/trading/lot/confirmDescriptionByTrader/', { id: id })
      .then(() => {
        context.commit('getListSuccess');
      })
      .catch((error) => {
        console.log('lot confirmDescriptionByTrader error => ', error);
      });
  },
  confirmDescriptionByUmiop(context, id) {
    axios
      .post('rest/trading/lot/confirmDescriptionByUmiop/', {
        id: id,
        isUmiopEdited: context.state.isUmiopEdited,
      })
      .then(() => {
        context.commit('getListSuccess');
      })
      .catch((error) => {
        console.log('lot confirmDescriptionByUmiop error => ', error);
      });
  },
  lotFormToSale(context, lot) {
    context.commit('setLotFormToSale', lot);
    context.commit('getListSuccess');
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
