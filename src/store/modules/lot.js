import axios from '@/utils/axios'

const state = () => ({
    isCalendarLotFormDisable: false,
    calendarLotFormOpen: false,
    isUmiopEdited: false,
    createLotError: null,
    createLotDate: {},
    lot: {
        shippingDate: "",
        factory: {
            multiplicity: null,
            name: ''
        },
        product: {
            name: ''
        },
        status: {},
        regions: [],
        priceMin: "",
        isBalanceSold: false
    },
    getLotStatus: {},
    lots: null,
    isSaleButtonClicked: false,
})

const mutations = {
    lotFormStart(state, payload) {
        state.lot = {};
        state.calendarLotFormOpen = true
        state.isCalendarLotFormDisable = false
        state.createLotDate = payload
    },
    lotFormSuccess(state) {
        state.calendarLotFormOpen = false
    },
    lotFormFailure(state, payload) {
        state.isCalendarLotFormDisable = true
        state.createLotError = payload
    },
    lotFormClose(state) {
        state.calendarLotFormOpen = false
        state.isCalendarLotFormDisable = false
        state.isSaleButtonClicked = false
        state.lot = {}
    },
    lotFormEdit(state, payload) {
        state.lot = payload
        state.calendarLotFormOpen = true
    },
    setLotIsUmiopEdited(state) {
        state.isUmiopEdited = true
    },
    setLot(state, payload) {
        state.lot = payload
    },
    setLotFormToSale(state, payload) {
        state.lot = payload
        state.calendarLotFormOpen = true
    },
    getListSuccess() {
    },
    setLots(state, payload) {
        state.lots = payload
    },
    setIsSaleButtonClicked(state, { value }) {
        state.isSaleButtonClicked = value;
    }
}

const actions = {
    getListByMounts(context, confirmData) {
      axios.post('rest/trading/lot/getListByMounts/', confirmData)
          .then(response => {
              context.commit('setLots', response.data)
              context.commit('getListSuccess')
          })
          .catch(error => {
            console.log("getList error => ", error);
          })
          .finally(() => (this.loading = false))
    },
    add(context, confirmData) {
        axios.post('rest/trading/lot/add/', confirmData)
            .then(() => {
                context.commit('lotFormSuccess')
            })
            .catch(error => {
                context.commit('lotFormFailure', error)
            })
            .finally(() => (this.loading = false))
    },
    edit(context, confirmData) {
        console.log('confirmData===>>> ', confirmData)
        axios.post('rest/trading/lot/edit/', confirmData)
            .then(() => {
                context.commit('lotFormSuccess')
            })
            .catch(error => {
                context.commit('lotFormFailure', error)
            })
            .finally(() => (this.loading = false))
    },
    delete(context, confirmData) {
        axios.post('rest/trading/lot/delete/', confirmData)
            .then(() => {
                context.commit('lotFormSuccess')
            })
            .catch(error => {
                context.commit('lotFormFailure', error)
                console.log("delete lot error => ", error);
            })
            .finally(() => (this.loading = false))
    },
    getById(context, confirmData) {
        axios.post('rest/trading/lot/getById/', {id: confirmData.id, userId: confirmData.userId})
            .then(response => {
                console.log('setLot 2 getById')
                context.commit('setLot', response.data)
            })
            .catch(error => {
                console.log("lot getById error => ", error);
            })
    },
    setUmiopCheckStatusById(context, id) {
        axios.post('rest/trading/lot/setUmiopCheckStatusById/', {id: id})
            .then(() => {
                context.commit('getListSuccess')
            })
            .catch(error => {
                console.log("lot setUmiopCheckStatusById error => ", error);
            })
    },
    confirmDescriptionByTrader(context, id) {
        axios.post('rest/trading/lot/confirmDescriptionByTrader/', {id: id})
            .then(() => {
                context.commit('getListSuccess')
            })
            .catch(error => {
                console.log("lot confirmDescriptionByTrader error => ", error);
            })
    },
    confirmDescriptionByUmiop(context, id) {
        axios.post('rest/trading/lot/confirmDescriptionByUmiop/', {id: id, isUmiopEdited: context.state.isUmiopEdited})
            .then(() => {
                context.commit('getListSuccess')
            })
            .catch(error => {
                console.log("lot confirmDescriptionByTrader error => ", error);
            })
    },
    lotFormToSale(context, lot) {
        
        context.commit('setLotFormToSale', lot)
        context.commit('getListSuccess')
        // axios.post('rest/trading/lot/confirmDescriptionByUmiop/', {id: lot.id})
        //     .then(() => {
        //         context.commit('getListSuccess')
        //     })
        //     .catch(error => {
        //         console.log("lot confirmDescriptionByTrader error => ", error);
        //     })
    },
}

const getters = {

}

const setters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
    setters
}