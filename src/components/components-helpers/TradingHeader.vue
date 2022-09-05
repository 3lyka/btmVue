<template>
  <div class="sub-header">
    <div class="sub-header__wrap">
      <div class="sub-header__item">
        <div class="sub-header__title">Предложения контрагентов</div>
      </div>
      <ExportToExcel button-text="Выгрузить в Excel" />
    </div>
  </div>
</template>

<script>
import ExportToExcel from '@/components/components-helpers/ExportToExcel';

export default {
  name: 'TradingHeader',
  components: { ExportToExcel },
};
</script>

<style scoped>
.sub-header__wrap {
  min-height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.sub-header__title {
  margin: 0;
  padding-left: 17px;
  font-weight: 700;
}
</style>
