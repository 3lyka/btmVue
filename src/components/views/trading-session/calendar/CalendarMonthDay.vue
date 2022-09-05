<template>
  <div class="calendar__month-item">
    <div
      class="calendar__month-item-wrapper"
      :class="{ 'calendar__month-item-wrapper_modal': isShowClose }"
    >
      <div
        :class="day.current ? 'calendar__month-item_active' : ''"
        class="calendar__month-item-title"
      >
        <div>
          <p v-if="daysWeek[dayKey]" class="calendar__month-item-title-day">
            {{ daysWeek[dayKey] }}
          </p>
          <!-- TODO: ПРОВЕРИТЬ. Вывод дня, сейчас может не выводить корректно. -->
          <p class="calendar__month-item-title-day">{{ dayName }}</p>
          <p class="calendar__month-item-title-number">
            <span>{{ day.number }}</span>
          </p>
        </div>
        <svg
          class="calendar__month-item-close"
          v-if="isShowClose"
          @click="closeLots"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2L2 14"
            stroke="#8C99B2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 2L14 14"
            stroke="#8C99B2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div
        :class="{ 'calendar__month-item-wrap_show-all': isShowClose === true }"
        class="calendar__month-item-wrap"
      >
        <CalendarMonthDayLotList
          @clickShowLots="clickShowLots"
          :lotsPerDay="lotsPerDay(day.date)"
          :defaultShowLots="defaultShowLots"
          :day="day"
          :isShowClose="isShowClose"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CalendarMonthDayLotList from '@/components/views/trading-session/calendar/CalendarMonthDayLotList';

export default {
  name: 'CalendarMonthDay',
  data: () => ({
    isShowClose: false,
    defaultShowLots: 2,
  }),
  emits: ['clickCloseLots'],
  methods: {
    closeLots() {
      this.isShowClose = false;
    },

    clickShowLots() {
      this.$emit('clickCloseLots');
      this.isShowClose = true;
    },

    lotsPerDay(dateDay) {
      const lotsPerDay = [];

      for (let i = 0; i < this.lots?.length; i++) {
        if (this.isDatesMatch(this.lots[i].dateStart, dateDay)) {
          lotsPerDay.push(this.lots[i]);
        }
      }

      return lotsPerDay;
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
  },

  computed: {
    dayName() {
      // TODO: ПРОВЕРИТЬ. Вывод дня, сейчас может не выводить корректно.
      return [...this.daysWeek][this.day.monthKey - 1];
    },
  },

  props: {
    lots: Array,
    daysWeek: Array,
    day: Object,
    dayKey: Number,
    calendar: Array,
  },
  components: { CalendarMonthDayLotList },
};
</script>

<style scoped></style>
