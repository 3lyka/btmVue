import axios from '@/utils/axios';

const state = () => ({
  offer: {
    factory: {},
    product: {},
    status: {},
  },
  offerList: [],
  editedOffers: [],
  umiop: {
    offerList: [],
    showUmiop: false,
  },
});

const mutations = {
  setUmiop(state) {
    state.umiop.offerList = state.offerList.filter((offer) => {
      if (
        (offer.switchAccepted && !offer.isAccepted) ||
        offer.status.code === 'umiop_check'
      ) {
        return true;
      } else {
        return false;
      }
    });

    if (state.umiop.offerList.length > 0) {
      state.umiop.showUmiop = true;
    } else {
      state.umiop.showUmiop = false;
    }
  },
  setSwitchAccepted(state, payload) {
    state.offerList = state.offerList.filter((offer) => {
      if (offer.id === payload.offerId) {
        offer.switchAccepted = payload.switchAccepted;
        if (
          payload.switchAccepted === false &&
          payload.isTrader &&
          (offer.status.code === 'new' ||
            offer.status.code === 'cancelled' ||
            offer.status.code === 'done')
        ) {
          offer.weightSale = 0;
        }
        if (
          payload.switchAccepted === true &&
          payload.weightSale === 0 &&
          payload.isTrader &&
          (offer.status.code === 'new' ||
            offer.status.code === 'cancelled' ||
            offer.status.code === 'done')
        ) {
          offer.weightSale = Number(payload.multiplicity);
        }

        return true;
      } else {
        return true;
      }
    });
  },
  setSwitchAcceptedToValidWeightSale(state, payload) {
    state.offerList = state.offerList.filter((offer) => {
      if (offer.id === payload.offerId) {
        offer.switchAccepted = payload.isValidWeightSale;
        return true;
      } else {
        return true;
      }
    });
  },
  offerFormStart(state, payload) {
    state.calendarLotFormOpen = true;
    state.isCalendarLotFormDisable = false;
    state.createLotDate = payload;
  },
  offerFormSuccess(state) {
    state.calendarLotFormOpen = false;
  },
  offerFormFailure(state, payload) {
    state.isCalendarLotFormDisable = true;
    state.createLotError = payload;
  },
  offerFormClose(state) {
    state.calendarLotFormOpen = false;
    state.isCalendarLotFormDisable = false;
  },
  offerFormEdit(state, payload) {
    state.lot = payload;
    state.calendarLotFormOpen = true;
  },
  setOffer(state, payload) {
    state.lot = payload;
  },
  setOfferForm(state, payload) {
    state.lot = payload;
    state.calendarLotFormOpen = true;
  },

  // todo: Логика формы кандидат на рефакторинг. Коммиты предназначены только для dev tools.
  // в текущей реализации может использоваться для отслеживания коммитов. В частности в CalendarLotForm.vue
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getListSuccess() {},
  setOffersList(state, payload) {
    let offers = JSON.parse(JSON.stringify(payload)),
      offersSet = [];

    offersSet = offers.map((origOffer) => {
      let offer = Object.assign({}, origOffer);

      if (offer.isAccepted === true) {
        if (offer.status.code === 'new') {
          if (!offer.weightSale) {
            offer.weightSale = offer.weight;
            offer.switchAccepted = true;
          }

          if (offer.weightSale) {
            offer.switchAccepted = true;
          }

          return offer;
        }

        if (offer.status.code === 'done') {
          if (!offer.weightSale) {
            offer.switchAccepted = false;
          } else {
            offer.switchAccepted = true;
          }

          return offer;
        }

        if (offer.status.code === 'cancelled') {
          offer.switchAccepted = false;
          return offer;
        }
      } else {
        if (
          offer.status.code !== 'umiop_check' &&
          offer.status.code !== 'umiop_done'
        ) {
          offer.weightSale = 0;
          offer.switchAccepted = false;
        } else if (offer.status.code !== 'umiop_done') {
          offer.switchAccepted = true;
        }

        return offer;
      }
    });

    const listWithEdited = offersSet.map((offer) => {
      const editedOffer = state.editedOffers.find(
        (editedOffer) => editedOffer.id === offer.id
      );

      if (editedOffer) return editedOffer;
      return offer;
    });

    state.offerList = listWithEdited;
  },
  setStatusInitialAndCanceled(state, payload) {
    state.offerList = payload.filter((offer) => {
      if (
        offer.switchAccepted === false &&
        (offer.status.code === 'new' || offer.status.code === 'done')
      ) {
        //offer.status.id = '';
        offer.status.name = 'Отклонено';
        offer.status.code = 'cancelled';
        return true;
      } else if (
        offer.switchAccepted === true &&
        offer.status.code === 'cancelled'
      ) {
        //offer.status.id = '';
        offer.status.name = 'Принято';
        offer.status.code = 'new';
        return true;
      } else {
        return true;
      }
    });
  },

  setEditedOffers(state, { editedOffers }) {
    state.editedOffers = editedOffers;
  },
};

const actions = {
  onSwitchAccepted(context, payload) {
    context.commit('setSwitchAccepted', payload);
    context.commit('setUmiop');
  },
  async getListByLotId({ commit }, id) {
    try {
      const { data } = await axios.post('rest/trading/offer/getListByLotId/', {
        id,
      });
      if (data) {
        commit('setOffersList', data);
        commit('setUmiop');
      }
    } catch (e) {
      console.log('offer getOffersByLotId error => ', e);
    }
  },
  setUmiopCheckStatusesByIds(context, ids) {
    axios
      .post('rest/trading/offer/setUmiopCheckStatusesByIds/', { ids: ids })
      .then(() => {
        context.commit('offerFormSuccess');
      })
      .catch((error) => {
        console.log('offer setUmiopCheckStatuses error => ', error);
      });
  },
  confirmDescriptionByTrader(context, offerList) {
    //switchAccepted
    context.commit('setStatusInitialAndCanceled', offerList);
    axios
      .post('rest/trading/offer/confirmDescriptionByTrader/', {
        offerList: context.state.offerList,
      })
      .then(() => {
        context.commit('getListSuccess');
      })
      .catch((error) => {
        console.log('offer confirmDescriptionByTrader error => ', error);
      });
  },
  confirmDescriptionByUmiop(context, lotId) {
    if (context.getters.offerIdsUmiopRejected.length) {
      context.commit('lot/setLotIsUmiopEdited', null, { root: true });
    }

    axios
      .post('rest/trading/offer/confirmDescriptionByUmiop/', {
        ids: context.getters.offerIdsUmiopDone,
        lotId: lotId,
        isUmiopEdited: Boolean(context.getters.offerIdsUmiopRejected.length),
      })
      .then(() => {
        context.commit('offerFormSuccess');
      })
      .catch((error) => {
        console.log('offer confirmDescriptionByUmiop error => ', error);
      });
  },

  setCancelledStatusesByIds(context, ids) {
    axios
      .post('rest/trading/offer/setCancelledStatusesByIds/', { ids: ids })
      .then(() => {
        context.commit('offerFormSuccess');
      })
      .catch((error) => {
        console.log('offer setUmiopCheckStatuses error => ', error);
      });
  },
  setWeightSaleByIds(context, data) {
    axios
      .post('rest/trading/offer/setWeightSaleByIds/', data)
      .then(() => {
        context.commit('offerFormSuccess');
      })
      .catch((error) => {
        console.log('offer setUmiopCheckStatuses error => ', error);
      });
  },

  // Сохряем отректированное предложение, передаем как payload на изменение в этот action.
  setEditedOffers({ commit, state }, { offer }) {
    const editedOffers = [];
    let isFoundInEdited = false;

    state.editedOffers.forEach((editedOffer) => {
      if (editedOffer.id === offer.id) {
        isFoundInEdited = true;
        editedOffers.push(offer);
      } else {
        editedOffers.push(editedOffer);
      }
    });

    if (!isFoundInEdited) {
      editedOffers.push(offer);
    }

    commit('setEditedOffers', { editedOffers });
  },

  resetEditedOffers({ commit }) {
    commit('setEditedOffers', { editedOffers: [] });
  },
};

const getters = {
  offerIdsUmiopDone: (state) => {
    let offerIdsUmiopDone = state.offerList.map((offer) => {
      if (
        offer.status.code === 'umiop_check' &&
        offer.switchAccepted === true
      ) {
        return offer.id;
      }
    });

    return offerIdsUmiopDone;
  },
  offerIdsUmiopRejected: (state) => {
    let offerIdsUmiopRejected = state.offerList.filter((offer) => {
      if (
        offer.status.code === 'umiop_check' &&
        offer.switchAccepted === false
      ) {
        return offer.id;
      }
    });

    return offerIdsUmiopRejected;
  },

  // todo: Remove. Make use of state.offer.offerList instead.
  offerListWithEdited(state) {
    if (!state.editedOffers.length) {
      return state.offerList;
    }

    return state.offerList;
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
