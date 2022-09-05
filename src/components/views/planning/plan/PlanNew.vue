<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import { ValidationRules } from '@/types/ValidationRules';
import { apiFactory } from '@/utils/apiService/apiFactory';
import { apiShipmentPlan } from '@/utils/apiService/apiShipmentPlan';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import { logError } from '@/utils/helpers/logError';
import { Calendar } from '@element-plus/icons-vue';
import { ElMessage, FormInstance } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const { data: factories, loading } = useApi(apiFactory.getListByUserId);

const addPlanLoading = ref(false);
const addPlanError = ref('');

const planNewFormRef = ref<FormInstance>();

const form = ref({
  dateOfShipment: new Date(),
  factoryId: '',
  bitumType: 'all',
});

const formRules = ref<ValidationRules>({
  dateOfShipment: {
    required: true,
    message: 'Выберите дату',
    trigger: 'change',
  },
  factoryId: {
    required: true,
    message: 'Выберите базис отгрузки',
    trigger: 'change',
  },
});

const bitumTypes = ref([
  { id: 'all', name: 'Вся продукция' },
  { id: 'bitum_premium', name: 'Битум премиальный' },
  { id: 'bitum_base', name: 'Битум базовый' },
]);

async function addPlan() {
  try {
    addPlanLoading.value = true;
    const { data } = await apiShipmentPlan.add({
      ...form.value,
      dateOfShipment: form.value.dateOfShipment.toLocaleDateString('ru-RU'), // приводит дату к формату: day.month.year,
    });

    if (!data.success) throw data.text;
    router.push({ name: 'ShipmentPlan', params: { id: data.id } });
  } catch (error) {
    addPlanError.value = getErrorMessage(error);
    logError(error);
  } finally {
    addPlanLoading.value = false;
  }
}

function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {
      addPlan();
    } else {
      ElMessage.error('Ошибка валидации формы');
      return false;
    }
  });
}
</script>

<template>
  <div class="plan-new">
    <ElForm
      ref="planNewFormRef"
      :model="form"
      :rules="formRules"
      labelPosition="top"
      hideRequiredAsterisk
    >
      <ElFormItem
        class="plan-new__date-item"
        label="Отгрузка"
        prop="dateOfShipment"
      >
        <ElDatePicker
          class="plan-new__date-selector"
          v-model="form.dateOfShipment"
          type="date"
          placeholder="Дата отгрузки"
          format="DD.MM.YYYY"
          :suffix-icon="Calendar"
        />
      </ElFormItem>
      <ElFormItem
        class="plan-new__factory-item"
        label="Базис отгрузки"
        prop="factoryId"
      >
        <ElSelect
          class="plan-new__factory-select"
          v-model="form.factoryId"
          placeholder="Базис отгрузки"
          :loading="loading"
        >
          <ElOption
            v-for="item in factories"
            :key="item.ID"
            :value="item.ID"
            :label="item.NAME"
          />
        </ElSelect>
      </ElFormItem>

      <ElRadioGroup class="plan-new__type-group" v-model="form.bitumType">
        <ElRadioButton
          class="plan-new__type"
          v-for="item in bitumTypes"
          :key="item.id"
          :value="item.id"
          :label="item.id"
        >
          <template #default>
            {{ item.name }}
          </template>
        </ElRadioButton>
      </ElRadioGroup>

      <hr />

      <ElButton
        class="plan-new__submit"
        type="primary"
        @click="onSubmit(planNewFormRef)"
        :loading="addPlanLoading"
        :disabled="addPlanLoading"
      >
        Создать
      </ElButton>

      <ElAlert
        class="plan-new__alert"
        v-if="addPlanError"
        :title="addPlanError"
        type="warning"
        show-icon
      />
    </ElForm>
  </div>
</template>

<style lang="scss">
.plan-new {
  &__date-item {
    width: 140px;
  }

  &__factory-select {
    width: 100%;
  }

  &__type-group {
    width: 100%;
    margin-bottom: 24px;
  }

  &__type {
    flex: 1;
  }

  &__type .el-radio-button__inner {
    width: 100%;
  }

  &__submit {
    width: 100%;
    margin-top: 16px;
  }

  &__alert {
    margin-top: 16px;
  }
}
</style>
