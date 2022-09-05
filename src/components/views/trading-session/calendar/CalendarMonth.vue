<template>
  <div class="calendar__month-table">
    <CalendarMonthDay
      v-for="(day, key) in this.calendar"
      ref="calendarMonthDayRefs"
      :key="key"
      :dayKey="key"
      :day="day"
      :lots="lots"
      :daysWeek="daysWeek"
      @clickCloseLots="clickCloseLots"
    />
  </div>
</template>

<script>
import CalendarMonthDay from '@/components/views/trading-session/calendar/CalendarMonthDay';

export default {
  name: 'CalendarMonth',
  props: {
    lots: Array,
    year: Number,
    monthKey: Number,
    daysWeek: Array,
    calendar: Array,
  },
  components: { CalendarMonthDay },

  methods: {
    clickCloseLots() {
      this.$refs.calendarMonthDayRefs.forEach((day) => day.closeLots());
    },
  },
};
</script>

<style scoped></style>
