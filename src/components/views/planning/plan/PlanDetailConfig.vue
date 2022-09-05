<script setup lang="ts">
import { Calendar, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useApi } from '@/composables/useApi';
import { apiFactory } from '@/utils/apiService/apiFactory';
import EscapeArrowIcon from '@/components/components-helpers/icons/EscapeArrowIcon.vue';

const { data: factories } = useApi(apiFactory.getListByUserId);

const form = ref({
  shipmentDate: '',
  factoryId: '',
  config: '',
});

/** @todo Реализовать функцию. Сейчас это заготовка. */
function handleExportToExcel() {
  // exportToExcel();
}
</script>

<template>
  <div class="plan-detail-config">
    <ElForm
      class="plan-detail-config__form"
      :model="form"
      inline
      labelPosition="top"
    >
      <ElFormItem class="plan-detail-config__item-shipment" label="Отгрузка">
        <ElDatePicker
          class="plan-detail-config__select-shipment"
          v-model="form.shipmentDate"
          type="daterange"
          placeholder="Выберите диапозон"
          format="DD.MM.YYYY"
          range-separator="-"
          start-placeholder="От"
          end-placeholder="До"
          :suffix-icon="Calendar"
          :clearable="false"
        />
      </ElFormItem>

      <ElFormItem class="plan-detail-config__item-factory" label="Базис">
        <ElSelect
          class="plan-detail-config__select-factory"
          v-model="form.factoryId"
          placeholder="Выберите базис"
        >
          <ElOption
            v-for="factory in factories"
            :key="factory.ID"
            :label="factory.NAME"
            :value="factory.ID"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        class="plan-detail-config__item-config"
        label="Конфигурация КП"
      >
        <ElSelect v-model="form.config" placeholder="Выберите конфигурацию КП">
          <ElOption
            v-for="item in [
              { id: 1, name: 'Крупные трейдеры' },
              { id: 2, name: 'Не крупные трейдеры' },
            ]"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />

          <template #append>
            <ElButton :icon="Search" />
          </template>
        </ElSelect>
        <ElButton type="info" aria-label="Открыть коммерческий планировщик">
          <EscapeArrowIcon />
        </ElButton>
      </ElFormItem>
    </ElForm>
    <div class="plan-detail-config__actions">
      <ElButton type="info" @click="handleExportToExcel">
        Выгрузить в Excel
      </ElButton>
      <ElButton type="info" disabled>Отправить без согласования</ElButton>
      <ElButton type="info" disabled>Отправить на согласование</ElButton>
      <ElButton type="info">Сохранить план</ElButton>
      <ElButton type="primary">Запустить КП</ElButton>
    </div>
  </div>
</template>

<style lang="scss">
.plan-detail-config {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  &__item-shipment {
    width: 189px;
  }

  &__select-shipment {
    width: 100%;
  }

  &__item-factory {
    width: 400px;
  }

  &__select-factory {
    width: 100%;
  }

  &__actions {
    margin-top: 12px;
  }
}
</style>
