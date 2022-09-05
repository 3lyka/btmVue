<!-- todo: refactor to setup lang="ts". -->
<script setup lang="ts">
import { ElMessageBox, ElNotification } from 'element-plus';
import BaseTable from '@/components/components-helpers/BaseTable.vue';
import type {
  PlanStatus,
  ShipmentPlans,
  ShipmentPlan, // eslint-disable-line
} from '@/utils/apiService/apiShipmentPlan';
import DeleteIcon from '../../../components-helpers/icons/DeleteIcon.vue';

const props = defineProps<{
  plan: ShipmentPlans['plans'] | undefined;
  statusTypes: PlanStatus[] | null;
  pagination: Omit<ShipmentPlans, 'plans'> | null;
}>();

defineEmits<{
  (event: 'onPagination', pageNumber: number): void;
  (event: 'openPlanNew'): void;
  (event: 'openPlanHistory', planId: string): void;
}>();

// todo: dry
function getStatusType(status: PlanStatus['code']) {
  const foundStatus = props.statusTypes?.find((e) => e.code == status);
  if (foundStatus) return foundStatus.tag;
}
// todo: dry
function getStatusName(status: PlanStatus['code']) {
  const foundStatus = props.statusTypes?.find((e) => e.code == status);
  if (foundStatus) return foundStatus.text;
}

function isPlanDelete(status: PlanStatus['code']) {
  const alowToDeleteStatuses: PlanStatus['code'][] = ['work', 'not_agreed'];

  if (alowToDeleteStatuses.includes(status)) {
    return true;
  }

  return false;
}

function deletePlan(rowPlan: ShipmentPlan, rowIndex: number) {
  const plan = props.plan;

  if (isPlanDelete(rowPlan.status)) {
    ElMessageBox.confirm(
      'План будет удален без возможности восстановления',
      'Удаление плана',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отменить',
      }
    ).then(() => {
      // todo: requires a refactoring.
      plan?.splice(rowIndex, 1);

      ElNotification.success({
        title: 'Успешно',
        message: 'План ' + rowPlan.id + ' удален',
        offset: 80,
      });
    });
  }
}
</script>

<!-- todo: fix types -->
<template>
  <div class="plan-table">
    <BaseTable
      class="plan-table__table"
      :elTableProps="{
        class: 'plan-table__inner-table',
        data: plan,
        tableLayout: 'auto',
      }"
    >
      <ElTableColumn prop="date" label="Дата отгрузки" width="125" />
      <ElTableColumn prop="basis" label="Базис отгрузки" width="220" />
      <ElTableColumn prop="prodType" label="Вид продукции" width="160" />
      <ElTableColumn prop="weight" label="Объем к отгрузке, т" width="150" />
      <ElTableColumn prop="owner" label="Создал" width="230" />
      <ElTableColumn prop="status" label="Статус плана">
        <!-- scope: { row: ShipmentPlan } типизация scope -->
        <template #default="scope: { $index: number, row: ShipmentPlan }">
          <ElTag :type="getStatusType(scope.row.status)" disable-transitions>
            {{ getStatusName(scope.row.status) }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn width="320">
        <!-- scope: { row: ShipmentPlan } типизация scope -->
        <template #default="scope: { $index: number, row: ShipmentPlan }">
          <ElButton
            type="info"
            @click="
              $router.push({
                name: 'ShipmentPlan',
                params: { id: scope.row.id },
              })
            "
          >
            Открыть план
          </ElButton>

          <ElButton type="text" @click="$emit('openPlanHistory', scope.row.id)">
            История
          </ElButton>

          <ElButton
            :disabled="!isPlanDelete(scope.row.status)"
            @click.prevent="deletePlan(scope.row, scope.$index)"
            text
          >
            <DeleteIcon />
          </ElButton>
        </template>
      </ElTableColumn>
    </BaseTable>

    <div class="plan-table__pagination">
      <ElPagination
        layout="prev, pager, next"
        :pageSize="pagination?.page_size"
        :total="pagination?.all_count"
        :currentPage="pagination?.page"
        @current-change="$emit('onPagination', $event)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.plan-table {
  &__table {
    // min-height: 272px;
  }

  &__inner-table {
    border-top: var(--el-table-border);
    padding-top: 8px;
  }

  &__pagination {
    margin: 20px 16px;

    display: flex;
    justify-content: flex-end;
  }
}
</style>
