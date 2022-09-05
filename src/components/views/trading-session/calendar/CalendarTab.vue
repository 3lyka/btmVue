<template>
  <div class="calendar__tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      v-on:click="clickTab(tab)"
      :class="{ 'calendar__tabs-button_active': activeTab === tab.code }"
      class="calendar__tabs-button"
    >
      {{ tab.name }}
    </button>
  </div>
</template>

<script>
export default {
  props: ['onTab', 'activeTab'],
  name: 'calendarTab',
  methods: {
    clickTab(tab) {
      this.onTab({
        name: tab.name,
        code: tab.code,
      });
    },
  },
  data: () => ({
    tabs: [
      {
        name: 'Месяц',
        code: 'month',
      },
      {
        name: 'Неделя',
        code: 'week',
      },
      // {
      //   name:'День',
      //   code: 'day'
      // },
    ],
  }),
};
</script>

<style scoped></style>
