<template>
  <div
    class="trading-confirm"
    :class="
      isUmiopCheckStatusLot && offer.status.code !== 'umiop_check' && isTrader
        ? 'trading-confirm_disable'
        : ''
    "
  >
    <div
      class="trading-confirm__text"
      :class="setColorByStatus"
      style="background: none"
    >
      {{ showOfferStatus() }}
    </div>
    <input
      v-if="showSwitchAccepted"
      v-model="switchAccepted"
      :checked="switchAccepted"
      @change="onSwitchAccepted()"
      class="trading-confirm__button"
      type="checkbox"
      :disabled="isDisableSwitch || (checkSwitcher && isDisableInactiveSwitch)"
    />
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { mapActions } from 'vuex';
import { mapState as mapStatePinia } from 'pinia';

export default {
  name: 'OfferStatus',
  props: {
    offer: {},
    lot: {},
    checkSwitcher: Boolean,
  },
  data: () => ({
    switchAccepted: false,
    showSwitchAccepted: true,
  }),
  computed: {
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
    isUmiopCheckStatusLot() {
      return this.lot.status.code === 'umiop_check';
    },
    isDisableInactiveSwitch() {
      return (
        (!this.offer.switchAccepted || this.offer.weightSale == 0) &&
        !this.isUmiopCheckStatusLot
      );
    },
    isDisableSwitch() {
      if (this.lot.status.code !== 'completed') {
        if (this.isUmiop) {
          return false;
        } else {
          return this.isUmiopCheckStatusLot;
        }
      } else {
        return true;
      }
    },
    setColorByStatus() {
      if (this.offer.status.code === 'umiop_check' && this.isTrader) {
        return 'status_umiop_check';
      } else if (this.offer.status.code === 'umiop_done') {
        return 'status_umiop_done';
      } else if (this.offer.status.code === 'umiop_cancelled') {
        return 'status_umiop_cancelled';
      } else {
        return '';
      }
    },
  },

  mounted() {
    if (
      this.offer.status.code !== 'umiop_check' &&
      this.offer.status.code !== 'cancelled'
    ) {
      this.switchAccepted = this.offer.isAccepted; //isAccepted = если true то цена выше прейскурантной, если false, то ниже

      if (this.offer.weightSale === 0) {
        this.switchAccepted = false;
      }
    }

    this.$store.subscribe((mutations) => {
      if (mutations.type === 'offer/setSwitchAcceptedToValidWeightSale') {
        this.switchAccepted = this.offer.switchAccepted;
        this.onSwitchAccepted();
      }
    });
  },
  created() {
    if (this.offer.status.code === 'umiop_check' && this.isUmiop) {
      this.switchAccepted = true;
      this.onSwitchAccepted();
    }
  },
  methods: {
    ...mapActions('offer', ['setEditedOffers']),

    showOfferStatus() {
      if (this.switchAccepted && this.offer.status.code === 'new') {
        return this.offer.status.name;
      } else if (this.offer.status.code === 'umiop_check') {
        if (this.isTrader) {
          this.showSwitchAccepted = false;
          return this.offer.status.name;
        } else if (this.isUmiop && this.switchAccepted) {
          return 'Принято';
        } else {
          return 'Отклонено';
        }
      } else if (this.offer.status.code === 'umiop_done') {
        this.showSwitchAccepted = false;
        return this.offer.status.name;
      } else if (this.offer.status.code === 'umiop_cancelled') {
        this.showSwitchAccepted = false;
        return this.offer.status.name;
      } else {
        if (this.switchAccepted) {
          return 'Принято';
        } else {
          return 'Отклонено';
        }
      }
    },
    onSwitchAccepted() {
      if (this.isTrader) {
        this.$store.dispatch('offer/onSwitchAccepted', {
          isTrader: this.isTrader,
          offerId: this.offer.id,
          weightSale: this.offer.weightSale,
          multiplicity: this.lot.multiplicity,
          switchAccepted: this.switchAccepted,
        });
      }

      if (this.isUmiop) {
        this.$store.dispatch('offer/onSwitchAccepted', {
          offerId: this.offer.id,
          switchAccepted: this.switchAccepted,
        });
      }

      this.setEditedOffers({ offer: this.offer });
    },
    setStatus(id, status) {
      this.$store.commit('offer/setOfferStatus', {
        id: id,
        status: status,
      });
    },
  },
};
</script>

<style scoped></style>
