<template>
  <div v-if="showFooter && offerList?.length" class="confirm-distribution">
    <ElButton
      v-if="this.offerList.length"
      @click="onSubmit()"
      class="confirm-distribution__button"
      :class="isDisableButton ? 'confirm-distribution__button_disable' : ''"
      :disabled="isDisableButton"
      :loading="isSubmitting"
      size="large"
    >
      {{ buttonText }}
    </ElButton>
  </div>
</template>

<script>
import { mapState as mapStatePinia } from 'pinia';
import { useUserStore } from '@/stores/user';
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  name: 'ConfirmDescription',
  data() {
    return {
      isSubmitting: false,
    };
  },
  computed: {
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
    ...mapGetters({
      offerList: 'offer/offerListWithEdited',
    }),
    ...mapState({
      lot: (state) => state.lot.lot,
      umiop: (state) => state.offer.umiop,
      // offerList: state => state.offer.offerList,
    }),
    isDisableButton() {
      const offersConfirmOrCancelledUmiop = this.offerList.filter(
        (offer) =>
          offer.status.code === 'umiop_done' ||
          offer.status.code === 'umiop_cancelled'
      );
      if (
        (this.umiop.showUmiop && this.isTrader) ||
        (this.lot.status.code === 'umiop_check' && this.isTrader) ||
        (this.lot.status.code === 'processing' && this.isUmiop) ||
        this.lot.status.code === 'receiving' ||
        this.lot.status.code === 'waiting' ||
        (offersConfirmOrCancelledUmiop.length > 0 && this.isUmiop)
      ) {
        return true;
      }

      return false;
    },
    buttonText() {
      if (this.isUmiop) {
        return 'Согласовать распределение';
      } else {
        return 'Подтвердить распределение';
      }
    },
    isReceivingStatusLot() {
      return this.lot.status.code === 'receiving';
    },
    isWaitingStatusLot() {
      return this.lot.status.code === 'waiting';
    },
    isCompletedStatusLot() {
      return this.lot.status.code === 'completed';
    },
    isCancelledStatusLot() {
      return this.lot.status.code === 'cancelled';
    },
    showFooter() {
      if (
        this.isCompletedStatusLot ||
        this.isCancelledStatusLot ||
        this.isReceivingStatusLot ||
        this.isWaitingStatusLot
      ) {
        return false;
      }
      return true;
    },
  },
  methods: {
    ...mapActions('offer', ['resetEditedOffers']),
    onSubmit() {
      this.resetEditedOffers();

      this.isSubmitting = true;

      if (this.isTrader) {
        this.confirmDescriptionByTrader();
      } else if (this.isUmiop) {
        this.confirmDescriptionByUmiop();
      }

      setTimeout(() => {
        this.$store.dispatch('lot/getById', { id: this.lot.id });
        this.$store.dispatch('offer/getListByLotId', this.lot.id);

        this.isSubmitting = false;
      }, 1000);

      this.resetEditedOffers();
    },
    confirmDescriptionByTrader() {
      this.$store.dispatch('lot/confirmDescriptionByTrader', this.lot.id);
      this.$store.dispatch('offer/confirmDescriptionByTrader', this.offerList);
    },
    confirmDescriptionByUmiop() {
      this.$store.dispatch('offer/confirmDescriptionByUmiop', this.lot.id); // Edited offers is first, because "isUmiopEdited" maybe set
      this.$store.dispatch('lot/confirmDescriptionByUmiop', this.lot.id);
    },
  },
};
</script>

<style scoped></style>
