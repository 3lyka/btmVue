<template>
  <div></div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ScheduleFilter',
  ...mapState({
    //lots: state => state.lot.lots,
  }),
  data: () => ({}),
  methods: {},
  computed: {
    ...mapState({
      //lots: state => state.lot.lots,
    }),
  },
};
</script>

<style scoped></style>
