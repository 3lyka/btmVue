<template>
  <div class="calendar__month-item-add" @click="addLot">
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.71436 15.6665C4.86436 15.6665 1.71436 12.5165 1.71436 8.6665C1.71436 4.8165 4.86436 1.6665 8.71436 1.6665C12.5644 1.6665 15.7144 4.8165 15.7144 8.6665C15.7144 12.5165 12.5644 15.6665 8.71436 15.6665Z"
        stroke="#8C99B2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.71484 5.46631V11.8663"
        stroke="#8C99B2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.51465 8.6665H11.9146"
        stroke="#8C99B2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'CalendarMonthDayLotAdd',
  props: {
    day: Date,
  },
  methods: {
    addLot() {
      this.$store.commit('lot/lotFormStart', this.day);
    },
  },
};
</script>

<style scoped></style>
