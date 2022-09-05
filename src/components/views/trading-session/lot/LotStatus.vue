<template>
  <div :class="typeStatus + ' ' + getStatus()">
    {{ getStatusName() }}
  </div>
</template>

<script>
export default {
  name: 'LotStatus',
  props: {
    typeStatus: String,
    status: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  methods: {
    getStatus() {
      return this.typeStatus + '_' + this.status.code;
    },
    getStatusName() {
      if (this.typeStatus === 'status') {
        return this.status.name;
      } else if (this.typeStatus === 'status-icon') {
        return '';
      }
    },
  },
};
</script>

<style scoped></style>
