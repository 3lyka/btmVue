<template>
  <ul class="calendar__month-item-list">
    <CalendarMonthDayLot
      v-for="(lot, i) in lotsPerDay"
      :key="lot.id"
      v-show="i < defaultShowLots || (isShowLots && isShowClose)"
      :lot="lot"
      :isLotSelected="selectedLotId === lot.id"
    />
  </ul>
  <!-- скрываем, если модальное окно со всеми слотами открыто -->
  <div class="calendar__month-item-footer" v-if="!isShowClose">
    <div
      @click="showLots"
      v-if="isShowedMore"
      class="calendar__month-next-button"
    >
      Ещё +{{ lotsPerDay.length - defaultShowLots }}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 5L8 11L2 5"
          stroke="#0089FF"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <CalendarMonthDayLotAdd
      :day="day.date"
      v-if="(isFutureDay(day.date) || day.current) && isTrader"
    />
  </div>
</template>

<script>
import CalendarMonthDayLot from '@/components/views/trading-session/calendar/CalendarMonthDayLot';
import CalendarMonthDayLotAdd from '@/components/views/trading-session/calendar/CalendarMonthDayLotAdd';
import { useUserStore } from '@/stores/user';
import { mapState } from 'vuex';
import { mapState as mapStatePinia } from 'pinia';

export default {
  name: 'CalendarMonthDayLotList',
  emits: ['clickShowLots'],
  props: {
    lotsPerDay: Object,
    defaultShowLots: Number,
    day: Object,
    isShowClose: Boolean,
  },
  data: () => ({
    isShowLots: false,
  }),

  watch: {
    isShowClose(newVal) {
      if (!newVal) {
        this.setCalendarModalBoundries({ isReset: true });
      }
    },
  },

  computed: {
    ...mapState({
      selectedLotId: (state) => state.lot.lot.id,
    }),
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),

    isShowedMore() {
      return (
        this.lotsPerDay.length > this.defaultShowLots &&
        (!this.isShowLots || !this.isShowClose)
      );
    },
  },
  methods: {
    showLots() {
      this.isShowLots = true;
      this.$emit('clickShowLots');

      this.$nextTick(() => {
        this.setCalendarModalBoundries();
      });
    },
    isDatesMatch(dateA, dateB) {
      if (!(dateA instanceof Date)) {
        dateA = new Date(dateA);
      }
      if (!(dateB instanceof Date)) {
        dateB = new Date(dateB);
      }

      return dateA.toLocaleDateString() === dateB.toLocaleDateString();
    },
    isFutureDay(date) {
      const today = new Date();

      return today < date;
    },

    /** Не дает пересекаться модальным окнам, таким образом, что они видимы при открытии, а не уходят за пределы календаря. */
    setCalendarModalBoundries(options) {
      if (!this.calendarEl || !this.modalEl) {
        // todo: получение элементов через refs.
        this.calendarEl = document.querySelector('.calendar__month-table');
        this.modalEl = document.querySelector(
          '.calendar__month-item-wrapper_modal'
        );
      }

      if (!this.calendarEl || !this.modalEl) return;

      if (options?.isReset) {
        return (this.modalEl.style.transform = `translate(${0}px, ${0}px)`);
      }

      const calendarRect = this.calendarEl.getBoundingClientRect();
      const modalRect = this.modalEl.getBoundingClientRect();

      let translateX = 0;
      let translateY = 0;

      // на пересечение left
      if (modalRect.left < calendarRect.left) {
        translateX = calendarRect.left - modalRect.left;
      }

      // на пересечение top
      if (modalRect.top < calendarRect.top) {
        translateY = 16;
      }

      // на пересечение right
      if (modalRect.right > calendarRect.right) {
        translateX = calendarRect.right - modalRect.right;
      }

      // на пересечение bottom;
      if (modalRect.bottom > calendarRect.bottom) {
        translateY = -(modalRect.height - 165);
      }

      this.modalEl.style.transform = `translate(${translateX}px, ${translateY}px)`;
    },
  },
  components: { CalendarMonthDayLotAdd, CalendarMonthDayLot },
};
</script>

<style scoped></style>
