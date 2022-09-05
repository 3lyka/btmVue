import { createStore } from 'vuex';
import menu from './modules/menu';
import lot from './modules/trading/lot';
import offer from './modules/trading/offer';

export default createStore({
  modules: {
    menu,
    lot,
    offer,
  },
});
