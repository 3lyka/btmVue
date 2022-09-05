<template>
  {{ getTime() }}
</template>

<script>
export default {
  name: 'LotTradingTime',
  props: {
    dateStart: String,
    dateEnd: String,
    lotStatusCode: String,
    statusOffersWaitingTime: Number,
  },
  methods: {
    getTime() {
      const dateStart = new Date(this.dateStart);
      const dateEnd = new Date(this.dateEnd);
      let result = '';

      if (this.lotStatusCode === 'waiting' && this.statusOffersWaitingTime) {
        dateEnd.setTime(
          dateEnd.getTime() + this.statusOffersWaitingTime * 60000
        );
        result = 'до ' + dateEnd.toLocaleTimeString().slice(0, -3);
      } else {
        result =
          dateStart.toLocaleTimeString().slice(0, -3) +
          ' — ' +
          dateEnd.toLocaleTimeString().slice(0, -3);
      }

      return result;
    },
  },
};
</script>

<style scoped></style>
