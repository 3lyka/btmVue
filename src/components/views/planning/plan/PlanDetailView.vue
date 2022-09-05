<script setup>
import { Close as CloseIcon } from '@element-plus/icons-vue';
import PlanDetailConfig from './PlanDetailConfig.vue';
import PlanDetailTable from './PlanDetailTable.vue';

// const route = useRoute();
</script>

<template>
  <section class="plan-detail-view">
    <header class="plan-detail-view__header">
      <div class="plan-detail-view__header-left">
        <h1 class="plan-detail-view__title">План отгрузок</h1>
        <ElTag class="plan-detail-view__status">В работе</ElTag>
      </div>

      <div class="plan-detail-view__header-right">
        <ElButton
          class="plan-detail-view__close"
          :icon="CloseIcon"
          text
          @click="$router.push({ name: 'Planning' })"
        />
      </div>
    </header>

    <!-- todo: <Container />. -->
    <div class="plan-detail-view__container">
      <PlanDetailConfig />

      <ElCollapse>
        <ElCollapseItem title="Лимиты" name="limits">
          В разработке.
        </ElCollapseItem>
        <ElCollapseItem title="Аналитическая сводка, т" name="analytics">
          В разработке.
        </ElCollapseItem>
      </ElCollapse>
    </div>

    <PlanDetailTable />
  </section>
</template>

<style lang="scss">
.plan-detail-view {
  &__header {
    display: flex;
    justify-content: space-between;
    padding: 16px;
  }

  &__header-left {
    display: flex;
    align-items: center;
  }

  &__status {
    margin-left: 24px;
  }

  &__close {
  }

  &__container {
    padding: 16px;
  }
}
</style>
