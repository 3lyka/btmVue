<template>
  <div class="sub-header__item-button">
    <ElButton @click="exportDataExcel" class="sub-header__el-button">
      <DocumentIcon class="sub-header__button-icon" />
      {{ buttonText }}
    </ElButton>
  </div>
</template>

<script>
import DocumentIcon from './icons/DocumentIcon.vue';

export default {
  name: 'ExportToExcel',
  components: { DocumentIcon },
  props: { buttonText: String },
  methods: {
    exportDataExcel() {
      this.$router.push({
        name: 'ExportToExcel',
        query: {
          lotId: this.$store.state.lot.lot.id,
          dateStart: this.$store.state.lot.lot.dateStart,
        },
      });
    },
  },
};
</script>

<style scoped>
.sub-header__item-button {
  padding-right: 10px;
}
</style>
