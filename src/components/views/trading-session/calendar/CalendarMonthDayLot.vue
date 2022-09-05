<template>
  <li
    class="calendar__month-lot"
    :class="{ 'calendar__month-lot_active': isLotSelected }"
    @click="openLot"
  >
    <div class="calendar__month-lot-left">
      <div class="calendar__month-lot-description">
        <div class="calendar__month-lot-description-name">
          {{ lot.factory.shortName }}
        </div>
        <div class="calendar__month-lot-description-mark">
          {{ lot.product.shortName }}
        </div>
      </div>
      <div class="calendar__month-lot-info-time">
        <LotTradingTime :dateStart="lot.dateStart" :dateEnd="lot.dateEnd" />
      </div>
    </div>
    <div class="calendar__month-lot-right">
      <div class="calendar__month-lot-count-weight">
        <span>{{ getReceipt }} т</span>
      </div>
      <LotStatus :typeStatus="'status-icon'" :status="lot.status" />
    </div>
  </li>
</template>

<script>
import LotStatus from '@/components/views/trading-session/lot/LotStatus';
import LotTradingTime from '@/components/views/trading-session/lot/LotTradingTime';
export default {
  name: 'CalendarMonthDayLot',
  props: {
    lot: Object,
    isLotSelected: Boolean,
  },
  computed: {
    getReceipt() {
      let res = '';

      if (
        this.lot.status.code === 'receiving' ||
        this.lot.status.code === 'waiting' ||
        this.lot.status.code === 'cancelled'
      ) {
        res = 0;
      } else {
        res = this.lot.weightSale;
      }

      return res + '/' + this.lot.weight;
    },
  },
  methods: {
    openLot: function () {
      if (this.lot.status.code === 'new') {
        this.$store.commit('lot/lotFormEdit', this.lot);
      } else {
        this.$store.commit('lot/setLot', this.lot);
        this.$router.push('/arm_trading/lot/' + this.lot.id);
      }
    },
  },
  components: { LotStatus, LotTradingTime },
};
</script>

<style scoped></style>
