<template>
  <ul class="calendar__table">
    <li
      v-for="(day, key) in calendar[numberWeek]"
      :key="key"
      class="calendar__item"
    >
      <ElAffix
        :offset="124"
        :z-index="1"
        @change="(state) => (isScrolled = state)"
        :style="isScrolled ? 'height: 43px' : ''"
      >
        <div
          class="calendar__item-title"
          :class="[
            day.current ? 'calendar__item-title_active' : '',
            isScrolled ? 'calendar__item-title_scrolled' : '',
          ]"
        >
          <div class="calendar__item-title-box">
            <p class="calendar__item-title-day">{{ daysWeek[key] }}</p>
            <p
              class="calendar__item-title-number"
              :class="
                !isFutureDay(day.date) && !day.current
                  ? 'calendar__item-title_last'
                  : ''
              "
            >
              <span>{{ day.number }}</span>
            </p>
          </div>
        </div>
      </ElAffix>
      <div class="calendar__item-box">
        <CalendarWeekLotAdd
          :day="day"
          v-if="(isFutureDay(day.date) || day.current) && isTrader"
        />
        <template v-for="lot in lots" :key="lot.id">
          <CalendarWeekLot
            v-if="isDatesMatch(lot.dateStart, day.date)"
            :lot="lot"
            :isLotSelected="selectedLotId === lot.id"
          />
        </template>
      </div>
    </li>
  </ul>
</template>

<script>
import CalendarWeekLot from '@/components/views/trading-session/calendar/CalendarWeekLot';
import CalendarWeekLotAdd from '@/components/views/trading-session/calendar/CalendarWeekLotAdd';
import { useUserStore } from '@/stores/user';
import { mapState } from 'vuex';
import { mapState as mapStatePinia } from 'pinia';

export default {
  name: 'CalendarWeek',
  props: {
    lots: Object,
    month: Number,
    year: Number,
    daysWeek: Array,
    months: Array,
    date: Object,
    calendar: Array,
    numberWeek: Number,
  },
  data() {
    return {
      isScrolled: false,
    };
  },
  computed: {
    ...mapState({
      selectedLotId: (state) => state.lot.lot.id,
    }),
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
  },
  methods: {
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
  components: { CalendarWeekLotAdd, CalendarWeekLot },
};
</script>

<style scoped></style>
