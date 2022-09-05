import axios from '@/utils/axios'

const state = () => ({
    offer: {
        factory: {},
        product: {},
        status: {},
    },
    offerList: [],
    umiop: {
        offerList: [],
        showUmiop: false
    }
})

const mutations = {
    setUmiop(state) {
        state.umiop.offerList = state.offerList.filter(offer => {
            if(offer.switchAccepted && !offer.isAccepted || offer.status.code === 'umiop_check') {
                return true
            } else {
                return false
            }
        })

        if(state.umiop.offerList.length > 0) {
            state.umiop.showUmiop = true
        } else {
            state.umiop.showUmiop = false
        }
    },
    setSwitchAccepted(state, payload) {
        state.offerList = state.offerList.filter(offer => {
            if(offer.id === payload.offerId) {
                offer.switchAccepted = payload.switchAccepted
                if(payload.switchAccepted === false && payload.isTrader && (offer.status.code === 'new' || offer.status.code === 'cancelled')) {
                    offer.weightSale = 0
                }
                if(payload.switchAccepted === true && payload.weightSale === 0 && payload.isTrader && (offer.status.code === 'new' || offer.status.code === 'cancelled')) {      
                    offer.weightSale = Number(payload.multiplicity)
                }
                return true
            } else {
                return true
            }
        })
    },
    setSwitchAcceptedToValidWeightSale(state, payload) {
        state.offerList = state.offerList.filter(offer => {

            if(offer.id === payload.offerId) {
                offer.switchAccepted = payload.isValidWeightSale
                return true
            } else {
                return true
            }
        })
    },
    offerFormStart(state, payload) {
        state.calendarLotFormOpen = true
        state.isCalendarLotFormDisable = false
        state.createLotDate = payload
    },
    offerFormSuccess(state) {
        state.calendarLotFormOpen = false
    },
    offerFormFailure(state, payload) {
        state.isCalendarLotFormDisable = true
        state.createLotError = payload
    },
    offerFormClose(state) {
        state.calendarLotFormOpen = false
        state.isCalendarLotFormDisable = false

    },
    offerFormEdit(state, payload) {
        state.lot = payload
        state.calendarLotFormOpen = true
    },
    setOffer(state, payload) {
        state.lot = payload
    },
    setOfferForm(state, payload) {
        state.lot = payload
        state.calendarLotFormOpen = true
    },
    getListSuccess() {

    },
    setOffersList(state, payload) {
        payload.sort((a, b) => b.price - a.price)

        state.offerList = payload

        state.offerList = state.offerList.filter(offer => {
            if(offer.isAccepted === true) {
                if(offer.status.code === 'new') {
                    if(!offer.weightSale) {
                        offer.switchAccepted = false
                    } else {
                        offer.switchAccepted = true
                    }

                    return true
                }

                if(offer.status.code === 'cancelled') {
                    offer.switchAccepted = false
                    return true
                }

                

            } else {
                offer.switchAccepted = false
                return true
            }
        })
    },
    setStatusCanceled(state, payload) {
        state.offerList = payload.filter(offer => {
            if (offer.switchAccepted === false && offer.status.code === 'new') {
                offer.status.id = ''
                offer.status.name = 'Отклонено'
                offer.status.code = 'cancelled'
                return true
            } else {
                return true
            }
        })
    }
}

const actions = {
    onSwitchAccepted(context, payload) {
        context.commit('setSwitchAccepted', payload)
        context.commit('setUmiop')
    },
    getListByLotId(context, id) {
        axios.post('rest/trading/offer/getListByLotId/', {id: id})
            .then(response => {
                if(response.data) {
                    context.commit('setOffersList', response.data )
                    context.commit('setUmiop')
                }
            })
            .catch(error => {
                console.log("offer getOffersByLotId error => ", error);
            })
    },
    setUmiopCheckStatusesByIds(context, ids) {
        axios.post('rest/trading/offer/setUmiopCheckStatusesByIds/', {ids: ids})
            .then(() => {
                context.commit('offerFormSuccess')
            })
            .catch(error => {
                console.log("offer setUmiopCheckStatuses error => ", error);
            })
    },
    confirmDescriptionByTrader(context, offerList) { //switchAccepted
        context.commit('setStatusCanceled', offerList)
        console.log(context.state.offerList)
        axios.post('rest/trading/offer/confirmDescriptionByTrader/', {offerList: context.state.offerList})
            .then(() => {
                context.commit('getListSuccess')
            })
            .catch(error => {
                console.log("offer confirmDescriptionByTrader error => ", error);
            })
    },
    confirmDescriptionByUmiop(context, lotId) {
        console.log('lotId', lotId)
        console.log('data', {
            ids: context.getters.offerIdsUmiopDone,
            lotId: lotId
        })

        if(context.getters.offerIdsUmiopRejected.length) {
            context.commit('lot/setLotIsUmiopEdited', null, { root: true })
        }

        axios.post('rest/trading/offer/confirmDescriptionByUmiop/', {
            ids: context.getters.offerIdsUmiopDone,
            lotId: lotId
        })
            .then(() => {
                context.commit('offerFormSuccess')
            })
            .catch(error => {
                console.log("offer confirmDescriptionByUmiop error => ", error);
            })
    },

    setCancelledStatusesByIds(context, ids) {
        axios.post('rest/trading/offer/setCancelledStatusesByIds/', {ids: ids})
            .then(() => {
                context.commit('offerFormSuccess')
            })
            .catch(error => {
                console.log("offer setUmiopCheckStatuses error => ", error);
            })
    },
    setWeightSaleByIds(context, data) {
        axios.post('rest/trading/offer/setWeightSaleByIds/', data)
            .then(() => {
                context.commit('offerFormSuccess')
            })
            .catch(error => {
                console.log("offer setUmiopCheckStatuses error => ", error);
            })
    }
}

const getters = {
    offerIdsUmiopDone: state => {
        let offerIdsUmiopDone = state.offerList.map(offer => {
            if(offer.status.code === 'umiop_check' && offer.switchAccepted === true) {
                return offer.id
            }
        })

        return offerIdsUmiopDone
    },
    offerIdsUmiopRejected: state => {
        let offerIdsUmiopRejected = state.offerList.filter(offer => {
            if(offer.status.code === 'umiop_check' && offer.switchAccepted === false) {
                return offer.id
            }
        })

        return offerIdsUmiopRejected
    },
    // showUmiop: state => {
    //     let showUmiop = state.offerList.filter(offer => {
    //         console.log(offer)
    //         if(offer.status.code === 'umiop_check') {
    //             return true
    //         } else {
    //             return false
    //         }
    //     })
    //     return showUmiop
    // },
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