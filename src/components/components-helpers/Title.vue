<template>
  <div class="title">
    <div class="container">
      <div class="title__left">
        <div class="title__text">Торги</div>
        <div class="title__status">
          <LotStatus :typeStatus="'status'" :status="lot?.status" />
        </div>
        <div
          v-if="
            lot.status.code == 'new' ||
            lot.status.code == 'receiving' ||
            lot.status.code == 'waiting'
          "
          class="title__time-interval"
        >
          <LotTradingTime
            :dateStart="lot?.dateStart"
            :dateEnd="lot?.dateEnd"
            :lotStatusCode="lot?.status.code"
            :statusOffersWaitingTime="lot?.statusOffersWaitingTime"
          />
        </div>
      </div>
      <div class="title__right">
        <span @click="exitLotDetail()" class="title__close">
          <CloseIcon />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import LotStatus from '@/components/views/trading-session/lot/LotStatus';
import LotTradingTime from '@/components/views/trading-session/lot/LotTradingTime';
import { mapState } from 'vuex';
import CloseIcon from './icons/CloseIcon.vue';

export default {
  name: 'Title',
  components: { LotTradingTime, LotStatus, CloseIcon },
  computed: {
    ...mapState({
      lot: (state) => state.lot.lot,
    }),
  },
  methods: {
    exitLotDetail() {
      // При переходе в лот с по клику с календаря возращаем на дату, с которой переходили.
      // В случае при переходе по прямой ссылке, возращаемся в календарь на текущую дату.
      // eslint-disable-next-line
      const toCurrentDate = !Boolean(this.$router.options.history.state.back);
      this.$router.push({ name: 'Calendar', params: { toCurrentDate } });
    },
  },
};
</script>

<style scoped></style>
