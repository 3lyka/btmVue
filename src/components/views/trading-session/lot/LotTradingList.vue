<template>
  <div class="trading-list">
    <table class="trading-list__table">
      <tbody>
        <tr class="trading-list__title">
          <td class="trading-list__title-item-time">Время подачи</td>
          <td class="trading-list__title-item-counterparty">Контрагент</td>
          <td class="trading-list__title-item-address">Адрес доставки</td>
          <td class="trading-list__title-item-delivery-date">Дата доставки</td>
          <td
            class="trading-list__title-item-price trading-list__item-item_decrease"
          >
            Цена за тонну
          </td>
          <td
            class="trading-list__title-item-order trading-list__item-item_increase"
          >
            По заявке, т
          </td>
          <td class="trading-list__title-item-volume-buy">
            Объем к покупке, т
          </td>
          <td class="trading-list__title-item-status">Статус предложения</td>
        </tr>
        <tr
          v-for="offer in offerList"
          v-bind:key="offer.id"
          class="trading-list__item"
        >
          <td class="trading-list__item-time">{{ offer.createdAt }}</td>
          <td class="trading-list__item-counterparty">
            {{ offer.contactor.name }}
          </td>
          <td class="trading-list__item-address">
            {{ offer.deliveryAddress }}
          </td>
          <td class="trading-list__item-delivery-date">
            {{ offer.deliveryDate }}
          </td>
          <td
            class="trading-list__item-price trading-list__row-item_price"
            :class="!offer.isAccepted ? 'trading-list__item-price_low' : ''"
          >
            {{ prettify(offer.price) }}
          </td>
          <td class="trading-list__item-order">{{ prettify(offer.weight) }}</td>
          <td class="trading-list__item-volume-buy">
            <ElInputNumber
              :id="offer.id"
              v-if="
                lot.status.code !== 'receiving' &&
                lot.status.code !== 'waiting' &&
                lot.status.code !== 'cancelled'
              "
              :min="0"
              :max="arrMaxWeightOffers.get(offer.id)"
              v-model="offer.weightSale"
              @change="isValidWeightSale(offer)"
              :disabled="isDisableInputNumber(offer)"
              :step="Number(lot.multiplicity)"
            />
          </td>
          <td class="trading-list__item-status">
            <OfferStatus
              v-if="showOfferStatus(offer)"
              :offer="offer"
              :lot="lot"
              @warningValidate="showWarningWalidate($event)"
              :checkSwitcher="checkToDisableSwitch"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import OfferStatus from '@/components/views/trading-session/offer/OfferStatus';
import { useUserStore } from '@/stores/user';
import { scrollToTop } from '@/utils/helpers/scrollToTop';
import { mapActions, mapGetters, mapState } from 'vuex';
import { mapState as mapStatePinia } from 'pinia';

export default {
  name: 'LotTradingList',
  components: { OfferStatus },
  data() {
    return {
      editProductData: {
        id: '',
        product_id: '',
        product_name: '',
        product_price: '',
      },
    };
  },
  computed: {
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
    ...mapGetters({
      offerList: 'offer/offerListWithEdited',
    }),
    ...mapState({
      lot: (state) => state.lot.lot,
    }),
    avalibleWeightSale() {
      return this.lot.weight - this.sumWeightSale;
    },
    checkToDisableSwitch() {
      return this.avalibleWeightSale === 0;
    },
    sumWeightSale() {
      const arrWeightSale = this.offerList.map((offer) => offer.weightSale);

      let sum = 0;
      for (let i = 0; i < arrWeightSale.length; i++) {
        sum += arrWeightSale[i];
      }
      return sum;
    },
    arrMaxWeightOffers: {
      get: function () {
        const arrMaxWeight = new Map();
        let weight,
          weightPossibleSale,
          weightSale,
          maxWeight = 0;
        let weightLot = parseInt(this.lot.weight);
        const sumWeightSale = this.offerList.reduce(
          (partialSum, a) => parseInt(partialSum) + a.weightSale,
          0
        );

        if (sumWeightSale < 0) return arrMaxWeight;
        let avalibleWeightSale = parseInt(weightLot - sumWeightSale);

        if (avalibleWeightSale < 0) avalibleWeightSale = 0;

        this.offerList.forEach(function (offer) {
          weight = parseInt(offer.weight);
          weightSale = parseInt(offer.weightSale);
          weightPossibleSale = weightSale + avalibleWeightSale;

          arrMaxWeight.set(offer.id, weightLot);

          if (weightLot <= 0) {
            offer.switchAccepted = false;

            return arrMaxWeight;
          }

          maxWeight = weightPossibleSale > weight ? weight : weightPossibleSale;
          weightLot = weightLot - weightSale;
          if (weightLot > 0) arrMaxWeight.set(offer.id, maxWeight);
        });

        return arrMaxWeight;
      },
    },
  },
  methods: {
    ...mapActions('offer', ['setEditedOffers', 'resetEditedOffers']),

    isDisableInputNumber(offer) {
      if (
        (this.lot.status.code === 'umiop_check' && this.isTrader) ||
        (this.lot.status.code === 'processing' && this.isUmiop) ||
        (this.lot.status.code === 'umiop_check' && this.isUmiop) ||
        this.lot.status.code === 'receiving' ||
        this.lot.status.code === 'waiting' ||
        this.lot.status.code === 'completed' ||
        offer.status.code === 'umiop_done' ||
        offer.status.code === 'umiop_cancelled'
      ) {
        return true;
      }

      return false;
    },
    showWarningWalidate(offerId) {
      // transition: border-color 1s ease;
      //todo: добавить анимацию красный бордер мирцает на ElInputNumber id === offerId
      console.log('show warning offerId=', offerId);
    },
    isValidWeightSale(offer) {
      if (offer.weightSale === 0) {
        this.$store.commit('offer/setSwitchAcceptedToValidWeightSale', {
          offerId: offer.id,
          isValidWeightSale: false,
        });
      } else {
        this.$store.commit('offer/setSwitchAcceptedToValidWeightSale', {
          offerId: offer.id,
          isValidWeightSale: true,
        });
      }

      this.setEditedOffers({ offer });
    },
    showOfferStatus(offer) {
      if (this.lot.status.code !== 'cancelled') {
        if (this.isTrader) {
          return (
            this.lot.status.code !== 'receiving' &&
            this.lot.status.code !== 'waiting'
          );
        } else if (this.isUmiop) {
          return (
            offer.status.code === 'umiop_check' ||
            offer.status.code === 'umiop_done' ||
            offer.status.code === 'umiop_cancelled'
          );
        } else {
          return (
            this.lot.status.code !== 'receiving' &&
            this.lot.status.code !== 'waiting'
          );
        }
      }
    },
    prettify(str) {
      try {
        str = String(str);
        return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
      } catch (e) {
        console.error('Error in helpers prettify', e);
      }
    },
  },
  mounted() {
    scrollToTop();
  },
};
</script>

<style scoped>
.trading-list {
  margin-top: 0px;
}
.el-input-number {
  width: 125px;
}
</style>
