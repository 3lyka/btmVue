<!-- todo: рефакторинг PlanNew, PlanHistory, PlanDetail-->
<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import { apiFactory } from '@/utils/apiService/apiFactory';
import {
  apiShipmentPlan,
  GetPlansRequestData,
  ShipmentPlans,
} from '@/utils/apiService/apiShipmentPlan';
import { logError } from '@/utils/helpers/logError';
import { Plus } from '@element-plus/icons-vue';
import { ref } from 'vue';
import BaseDrawer from '@/components/components-helpers/BaseDrawer.vue';
import PlanHistory from '../plan/PlanHistory.vue';
import PlanNew from '../plan/PlanNew.vue';
import PlanFilter from './PlanFilter.vue';
import PlanTable from './PlanTable.vue';

interface DrawerData {
  isOpen: boolean;
  planId: string | null;
}

const { data: statuses, loading: statusesLoading } = useApi(
  apiShipmentPlan.getPlanStatuses
);
const { data: factories, loading: factoriesLoading } = useApi(
  apiFactory.getListByUserId
);

const plans = ref<ShipmentPlans | null>(null);
const plansLoading = ref(false);

async function getPlans(requestData?: GetPlansRequestData) {
  try {
    plansLoading.value = true;
    const { data } = await apiShipmentPlan.getPlans({
      pageSize: 4, // default
      ...requestData, // позволяем переписать своими данными
    });
    plans.value = data;
  } catch (error) {
    logError(error);
  } finally {
    plansLoading.value = false;
  }
}

getPlans();

const isOpenPlanNew = ref(false);
const planHistory = ref<DrawerData>({ isOpen: false, planId: null });
</script>

<template>
  <div class="plan-view" v-loading="factoriesLoading">
    <div class="plan-view__header" v-if="factories">
      <PlanFilter
        class="plan-view__filter"
        :factories="factories"
        @selectFactory="getPlans({ factoryId: $event })"
      />

      <ElButton
        class="plan-view__button-new-plan"
        type="primary"
        @click="isOpenPlanNew = !isOpenPlanNew"
        :icon="Plus"
      >
        Создать план
      </ElButton>
    </div>

    <PlanTable
      class="plan-view__table"
      v-loading="!factoriesLoading && (plansLoading || statusesLoading)"
      :plan="plans?.plans"
      :pagination="plans"
      :statusTypes="statuses"
      @openPlanHistory="planHistory = { isOpen: true, planId: $event }"
      @onPagination="getPlans({ pageNumber: $event })"
    />

    <BaseDrawer
      v-model="isOpenPlanNew"
      :elDrawerProps="{ title: 'Создание плана' }"
    >
      <PlanNew :basisOptions="factories" />
    </BaseDrawer>

    <PlanHistory v-model="planHistory.isOpen" :planId="planHistory.planId" />
  </div>
</template>

<style lang="scss">
.plan-view {
  min-height: 40vh;

  &__header {
    display: flex;
    justify-content: space-between;
    margin: 20px 16px;
  }

  &__button-new-plan {
    margin-left: 34px;
  }
}
</style>
