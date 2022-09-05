<template>
  <div
    v-if="isShowUnsoldBalance && unsoldBalance !== 0"
    class="lot-detail__sale"
  >
    <div
      :class="
        status.code === 'completed' || status.code === 'cancelled'
          ? 'lot-detail__sale-wrap'
          : ''
      "
    >
      <div class="lot-detail__sale-description">
        <div class="lot-detail__sale-description-balance">Остаток</div>
        <div class="lot-detail__sale-description-count-weight">
          {{ prettify(unsoldBalance) }} т
        </div>
      </div>
      <div v-if="isShowSaleButton" class="lot-detail__sale-button-wrap">
        <LotSaleButton :unsoldBalance="unsoldBalance" :lot="lot" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LotSaleButton from '@/components/views/trading-session/lot/LotSaleButton';

export default {
  name: 'LotDetailSale',
  components: { LotSaleButton },
  props: ['status', 'resoldInLot', 'countWeightSale'],
  computed: {
    ...mapState({
      lot: (state) => state.lot.lot,
    }),
    unsoldBalance() {
      if (this.status.code === 'receiving' || this.status.code === 'waiting') {
        return 0;
      }

      if (this.lot?.weight - this.countWeightSale > 0) {
        return this.lot?.weight - this.countWeightSale;
      }

      return 0;
    },
    isShowUnsoldBalance() {
      return (
        this.status.code === 'processing' ||
        this.status.code === 'umiop_check' ||
        this.status.code === 'completed' ||
        this.status.code === 'cancelled'
      );
    },
    isShowSaleButton() {
      return (
        this.status.code === 'completed' || this.status.code === 'cancelled'
      );
    },
  },
  methods: {
    prettify(str) {
      try {
        str = String(str);
        return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
      } catch (e) {
        console.error('Error in helpers prettify', e);
      }
    },
  },
};
</script>

<style scoped></style>
