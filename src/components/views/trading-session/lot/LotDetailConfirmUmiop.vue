<template>
  <div class="lot-detail__confirm">
    <div class="lot-detail__confirm-item">
      <p class="lot-detail__confirm-item-text">
        Торговые предложения, требующие согласования
      </p>
      <span class="lot-detail__confirm-item-count">{{
        countOfferListUmiop
      }}</span>
    </div>
    <div
      class="lot-detail__confirm-item"
      :class="isUmiopCheckStatusLot ? 'lot-detail__confirm-item_disable' : ''"
    >
      <ElButton
        @click="onSubmit"
        class="lot-detail__confirm-item-button"
        :disabled="isUmiopCheckStatusLot"
        :loading="isSubmitting"
      >
        Согласовать с УМиОП
      </ElButton>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'LotDetailConfirmUmiop',
  props: ['umiop', 'lot', 'offerList'],
  data() {
    return {
      isSubmitting: false,
    };
  },
  computed: {
    isUmiopCheckStatusLot() {
      return this.lot.status.code === 'umiop_check';
    },
    countOfferListUmiop() {
      return this.umiop.offerList.length;
    },
    umiopOfferListIds() {
      return this.umiop.offerList.map((offer) => offer.id);
    },
    cancelledOfferListIds() {
      return this.offerList.map((offer) => {
        if (offer.switchAccepted === false) {
          return offer.id;
        }
      });
    },
    receivedOfferListIds() {
      return this.offerList.map((offer) => {
        if (offer.switchAccepted === true) {
          return offer.id;
        }
      });
    },
    arrWeightSaleOfferList() {
      return this.offerList.map((offer) => {
        if (offer.switchAccepted === true) {
          return {
            id: offer.id,
            weightSale: offer.weightSale,
          };
        }
      });
    },
  },
  methods: {
    ...mapActions('offer', ['resetEditedOffers']),

    onSubmit() {
      this.resetEditedOffers();

      this.isSubmitting = true;

      this.$store.dispatch(
        'offer/setUmiopCheckStatusesByIds',
        this.umiopOfferListIds
      );
      this.$store.dispatch(
        'offer/setCancelledStatusesByIds',
        this.cancelledOfferListIds
      );
      this.$store.dispatch('offer/setWeightSaleByIds', {
        ids: this.receivedOfferListIds,
        arrWeightSale: this.arrWeightSaleOfferList,
      });
      this.$store.dispatch('lot/setUmiopCheckStatusById', this.lot.id);

      setTimeout(() => {
        this.$store.dispatch('lot/getById', { id: this.$route.params.id });
        this.$store.dispatch('offer/getListByLotId', this.$route.params.id);

        this.isSubmitting = false;
      }, 1000);

      this.resetEditedOffers();
    },
  },
};
</script>

<style scoped></style>
