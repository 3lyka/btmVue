<template>
  <TradingHeader />
  <LotTradingList />
</template>

<script>
import LotTradingList from '@/components/views/trading-session/lot/LotTradingList';
import { mapState, mapActions } from 'vuex';
import TradingHeader from '@/components/components-helpers/TradingHeader';
import { getCurrentInstance, onMounted } from 'vue';
import { useInterval } from '@/composables/useInterval';

export default {
  name: 'Trading',

  setup() {
    const { ctx } = getCurrentInstance();

    onMounted(() => {
      ctx.resetEditedOffers();
      ctx.getLot();
      ctx.getOffers();
    });
    // делаем запрос на обновление данных, раз в 1 минуту.
    useInterval(() => {
      ctx.getLot(), ctx.getOffers();
    }, 60000);
  },

  computed: {
    ...mapState({
      lot: (state) => state.lot.lot,
      showUmiopConfirm: (state) => state.lot.showUmiopConfirm,
      offerList: (state) => state.offer.offerList,
    }),
  },

  methods: {
    ...mapActions('offer', ['resetEditedOffers']),

    getOffers() {
      this.$store.dispatch('offer/getListByLotId', this.$route.params.id);
    },
    getLot() {
      this.$store
        .dispatch('lot/getById', { id: this.$route.params.id })
        .catch(() => {
          this.$router.push({ name: 'Calendar' });
        });
    },
  },

  mounted() {
    this.$store.subscribe((mutations) => {
      if (mutations.type === 'offer/offerFormSuccess') {
        this.getOffers();
      }
    });
  },
  components: { TradingHeader, LotTradingList },
};
</script>

<style scoped></style>
