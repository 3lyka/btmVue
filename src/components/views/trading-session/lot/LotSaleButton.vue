<template>
  <button
    v-if="showSaleButton"
    @click="setLotForm"
    class="lot-detail__sale-button"
    :class="unsoldBalance !== 0 ? 'lot-detail__sale-button_active' : ''"
  >
    {{ text }}
  </button>
  <button v-else-if="lot.resoldInLot" class="calendar__lot-sale-button">
    Выставлен<br />в лоте №{{ lot.resoldInLot }}
  </button>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { mapState as mapStatePinia } from 'pinia';

export default {
  name: 'LotSaleButton',
  props: ['unsoldBalance', 'lot'],
  computed: {
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
    text() {
      const text = 'Продать';

      return text;
    },
    showSaleButton() {
      const curDay = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ),
        lotDay = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date(this.lot.dateEnd).getDate()
        );

      if (
        this.isTrader &&
        curDay.getTime() === lotDay.getTime() &&
        (this.lot.status.code === 'completed' ||
          this.lot.status.code === 'cancelled') &&
        this.unsoldBalance > 0 &&
        !this.lot.resoldInLot
      ) {
        return true;
      }

      return false;
    },
  },
  methods: {
    async setLotForm() {
      const currLot = Object.assign({}, this.lot);

      currLot.weight = this.unsoldBalance;

      if (this.$route.name !== 'Calendar') {
        await this.$router.push({ name: 'Calendar' });
      }

      this.$store.commit('lot/setIsSaleButtonClicked', { value: true });
      this.$store.dispatch('lot/lotFormToSale', currLot);
    },
  },
};
</script>

<style scoped></style>
