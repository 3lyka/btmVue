<script setup lang="ts">
import BaseTable from '@/components/components-helpers/BaseTable.vue';
import { useApi } from '@/composables/useApi';
import { apiShipmentPlan } from '@/utils/apiService/apiShipmentPlan';
import { ref } from 'vue';
import BaseTableSettings from '@/components/components-helpers/BaseTableSettings.vue';
import { ElTableColumn } from 'element-plus';
import { useLocalStorage } from '@vueuse/core';

const tableView = ref<'groups' | 'list'>('groups');

const { data: plan, loading: planLoading } = useApi(apiShipmentPlan.getPlan);

type ElTableColumnProps = InstanceType<typeof ElTableColumn>['$props'] & {
  id: number;
  label: string; // делаем label обязательным для BaseTableSettings
  show: boolean; // скрыть или показать column
};

const tableColumns = useLocalStorage<ElTableColumnProps[]>(
  'shipmentPlanTableSettings',
  [
    {
      show: true,
      id: 1,
      prop: 'transport_type',
      label: 'Вид транспорта / Марка БМ / Категория КА',
      width: '260',
      headerAlign: 'center',
    },
    {
      show: true,
      id: 2,
      prop: 'recipient',
      label: 'Получатель',
      width: '200',
      headerAlign: 'center',
    },
    {
      show: true,
      id: 3,
      prop: 'transport',
      label: 'Способ перевозки',
      width: '140',
      headerAlign: 'center',
    },
    {
      show: true,
      id: 4,
      prop: 'bid',
      label: 'Заявка',
      sortable: true,
      width: '88',
      headerAlign: 'center',
      align: 'right',
    },
    {
      show: true,
      id: 5,
      prop: 'plan',
      label: 'План',
      sortable: true,
      width: '88',
      headerAlign: 'center',
      align: 'right',
    },
    {
      show: true,
      id: 6,
      prop: 'fact',
      label: 'Факт',
      sortable: true,
      width: '88',
      headerAlign: 'center',
      align: 'right',
    },
    {
      show: true,
      id: 7,
      prop: 'balance',
      label: 'Остаток',
      sortable: true,
      width: '88',
      headerAlign: 'center',
      align: 'right',
    },
    {
      show: true,
      id: 8,
      prop: 'dayly_plan_with_balance',
      label: 'Сут. план с уч. ост.',
      sortable: true,
      width: '88',
      headerAlign: 'center',
      align: 'right',
    },
    {
      show: true,
      id: 9,
      prop: 'dayly_plan',
      label: 'Сут. план',
      width: '88',
      sortable: true,
      headerAlign: 'center',
      align: 'right',
    },
  ]
);

function handleTableSettings(columns: ElTableColumnProps[]) {
  tableColumns.value = columns;
}
</script>

<template>
  <div class="plan-detail-table">
    <BaseTable
      class="plan-detail-table__table"
      v-loading="planLoading"
      :elTableProps="{
        class: 'plan-detail-table__inner-table',
        data: plan?.length ? plan : [],
        rowKey: 'id',
        border: false,
        defaultExpandAll: true,
        showSummary: true,
      }"
    >
      <template #headerLeft>
        <ElRadioGroup v-model="tableView">
          <ElRadioButton label="groups">По группам</ElRadioButton>
          <ElRadioButton label="list">Списком</ElRadioButton>
        </ElRadioGroup>
      </template>
      <template #headerRight>
        <BaseTableSettings
          :columns="tableColumns"
          @handleSave="handleTableSettings"
        />
      </template>

      <template v-for="(column, index) in tableColumns" :key="index">
        <ElTableColumn v-if="column.show" v-bind="column" />
      </template>

      <ElTableColumn label="12.10.2022" align="center">
        <ElTableColumn label="Декл.гр. КА / БО" width="96" />
        <ElTableColumn label="Заявлено" width="96" />
        <ElTableColumn label="Согласовано" width="128" />
        <ElTableColumn label="Обеспеч." width="96" />
        <ElTableColumn label="Не распред." width="96" />
        <ElTableColumn label="Приоритет" width="96" />
        <ElTableColumn label="Блокир." width="61" />
        <ElTableColumn label="Подроб." />
      </ElTableColumn>
    </BaseTable>
  </div>
</template>

<style lang="scss">
.plan-detail-table {
  &__inner-table th .cell {
    font-size: 11px;
  }
}
</style>
