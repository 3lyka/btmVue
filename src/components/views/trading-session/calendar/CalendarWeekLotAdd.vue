<template>
  <div class="calendar__lot calendar__lot_add" @click="addLot">
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 0.75V11.25"
        stroke="#0089FF"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M0.75 6H11.25"
        stroke="#0089FF"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'CalendarWeekLotAdd',
  props: {
    day: Object,
  },
  methods: {
    addLot() {
      this.$store.commit('lot/lotFormStart', this.day.date);
    },
  },
};
</script>

<style scoped></style>
