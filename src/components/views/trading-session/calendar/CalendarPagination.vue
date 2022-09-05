<template>
  <button
    @click="$emit('clickLast')"
    class="calendar__title-button-left"
    type="button"
  >
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 13L1 7L7 1"
        stroke="#606580"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
  <button
    @click="$emit('clickNext')"
    class="calendar__title-button-right"
    type="button"
  >
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L7 7L1 13"
        stroke="#606580"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
  <p class="calendar__title-date">{{ titleDate }}</p>
</template>

<script>
export default {
  name: 'CalendarPagination',
  emits: ['clickLast', 'clickNext'],
  props: {
    activeTab: String,
    calendar: Array,
    monthKey: Number,
    year: Number,
    months: Array,
    numberWeek: Number,
  },
  computed: {
    titleDate: function () {
      if (this.activeTab === 'week') {
        const firstDateWeek = this.calendar[this.numberWeek][0];
        const lastDateWeek =
          this.calendar[this.numberWeek][
            this.calendar[this.numberWeek].length - 1
          ];
        let firstMonthWeek = '';
        let firstYearWeek = '';

        if (
          firstDateWeek.date.getFullYear() < lastDateWeek.date.getFullYear()
        ) {
          firstYearWeek = firstDateWeek.date.getFullYear();
        }
        if (firstDateWeek.date.getMonth() !== lastDateWeek.date.getMonth()) {
          firstMonthWeek = this.months[firstDateWeek.date.getMonth()];
        }

        return (
          firstDateWeek.date.getDate() +
          ' ' +
          firstMonthWeek +
          ' ' +
          firstYearWeek +
          ' – ' +
          lastDateWeek.number +
          ' ' +
          this.months[lastDateWeek.monthKey] +
          ' ' +
          lastDateWeek.date.getFullYear()
        );
      } else {
        return (
          this.months[this.calendar[8].monthKey] +
          ' ' +
          this.calendar[8].date.getFullYear()
        );
      }
    },
  },
};
</script>

<style scoped></style>
