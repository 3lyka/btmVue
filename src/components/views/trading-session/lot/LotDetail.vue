<template>
  <div class="lot-detail">
    <div class="lot-detail__box">
      <div class="lot-detail__title">
        <div class="lot-detail__title-wrapper">
          <p class="lot-detail__title-id">№{{ prettify(lot.id) }}</p>
          <img class="lot-detail__title-img" src="@/assets/img/oil.svg" />
        </div>
        <div class="lot-detail__title-shipment">
          <div class="lot-detail__title-shipment-text">Отгрузка</div>
          <div v-if="lot.shippingDate" class="lot-detail__title-shipment-date">
            {{ lot.shippingDate }}
          </div>
        </div>
      </div>
      <div class="lot-detail__description">
        <div v-if="lot.factory.name" class="lot-detail__description-name">
          {{ lot.factory.name }}
        </div>
        <div v-if="lot.product.name" class="lot-detail__description-mark">
          {{ lot.product.name }}
        </div>
        <div class="lot-detail__description-create">Выставлено</div>
        <div v-if="lot.weight" class="lot-detail__description-count-weight">
          {{ prettify(lot.weight) }} т
        </div>
        <div class="lot-detail__description-box">
          <div class="lot-detail__description-receipt">
            <div class="lot-detail__description-receipt-title">
              {{ getReceipt.title }}
            </div>
            <div class="lot-detail__description-receipt-count-weight">
              {{ prettify(getReceipt.weight) }} т
            </div>
          </div>
          <div class="lot-detail__description-receipt">
            <div class="lot-detail__description-receipt-title">Предложений</div>
            <div class="lot-detail__description-receipt-count">
              {{ getCountContractor }}
            </div>
          </div>
        </div>
      </div>
      <LotDetailSale
        :status="lot.status"
        :resoldInLot="lot.resoldInLot"
        :countWeightSale="countWeightSale"
      />
      <div class="lot-detail__info">
        <div class="lot-detail__info-title">Цена по прейскуранту</div>
        <div class="lot-detail__info-region">
          <!-- {{lot.factory.shortName}} -->
          <span class="lot-detail__info-region-price">{{
            lot.priceMin ? prettify(lot.priceMin) + ' ₽' : ''
          }}</span>
        </div>
        <LotDetailConfirmUmiop
          v-if="isTrader"
          v-show="umiop.showUmiop"
          :offerList="offerList"
          :umiop="umiop"
          :lot="lot"
        />
        <LotDetailRegion :regions="lot.regions" />
        <div v-if="lot.comment">
          <div class="lot-detail__info-comment">Комментарий</div>
          <div class="lot-detail__info-comment-text">{{ lot.comment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import LotDetailConfirmUmiop from '@/components/views/trading-session/lot/LotDetailConfirmUmiop';
import LotDetailSale from '@/components/views/trading-session/lot/LotDetailSale';
import LotDetailRegion from '@/components/views/trading-session/lot/LotDetailRegion';
import { prettify } from '@/utils/helpers/prettify';
import { useUserStore } from '@/stores/user';
import { mapState as mapStatePinia } from 'pinia';

export default {
  name: 'LotDetail',
  components: { LotDetailRegion, LotDetailSale, LotDetailConfirmUmiop },
  computed: {
    ...mapState({
      lot: (state) => state.lot.lot,
      umiop: (state) => state.offer.umiop,
    }),
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
    ...mapGetters({
      offerList: 'offer/offerListWithEdited',
    }),
    getCountContractor() {
      let offersAgreed = this.offerList.filter(
        (offer) =>
          offer.switchAccepted === true || offer.status.code === 'umiop_done'
      ).length;
      const offersNoAgreed = this.offerList.length;

      if (
        this.lot.status.code === 'receiving' ||
        this.lot.status.code === 'waiting'
      ) {
        offersAgreed = 0;
      }

      return offersAgreed + '/' + offersNoAgreed;
    },
    countWeightSale() {
      const offersAgreed = this.offerList.filter(
        (offer) =>
          offer.switchAccepted === true || offer.status.code === 'umiop_done'
      );
      return offersAgreed.reduce((total, offer) => total + offer.weightSale, 0);
    },
    getReceipt() {
      const res = {};
      res.title = 'Распределено';
      if (
        this.lot.status.code === 'completed' ||
        this.lot.status.code === 'cancelled'
      ) {
        res.title = 'Продано';
      }

      if (
        this.lot.status.code === 'receiving' ||
        this.lot.status.code === 'waiting'
      ) {
        res.weight = 0; //todo уточнить
      } else if (this.lot.status.code === 'cancelled') {
        res.weight = 0; //todo уточнить
      } else if (this.lot.status.code === 'completed') {
        res.weight = this.countWeightSale;
      } else {
        res.weight = this.countWeightSale;
      }

      return res;
    },
  },

  methods: {
    prettify,
  },
};
</script>

<style scoped></style>
