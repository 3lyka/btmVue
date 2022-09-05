<script lang="ts" setup>
import type { ElForm, FormItemRule } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DocumentIcon from '@/components/components-helpers/icons/DocumentIcon.vue';
import axios from 'axios';
import CalendarIcon from '@/components/components-helpers/icons/CalendarIcon.vue';
import { useUserStore } from '@/stores/user';
import { logError } from '@/utils/helpers/logError';

interface Factory {
  ID: string;
  SHORT_NAME: string;
  NAME: string;
  MULTIPLICITY: null | string;
}

type FormInstance = InstanceType<typeof ElForm>;
type ValidationRules = Partial<Record<string, FormItemRule | FormItemRule[]>>;

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

const dialogVisible = ref(false);

const formRef = ref<FormInstance>();
const form = reactive({ dateRange: '', factoryId: '' });

const factoryList = ref<Factory[]>();

const validationRules: ValidationRules = reactive({
  dateRange: [
    { required: true, message: 'Не может быть пустым', trigger: 'blur' },
  ],
});

function buildSendData() {
  return {
    datePeriodStart: form.dateRange[0],
    datePeriodEnd: form.dateRange[1],
    type: route.name === 'Trading' ? 'offer' : 'lot',
    factoryId: form.factoryId,
  };
}

async function getFactoryListByUserId() {
  try {
    // todo: использовать apiService
    const { data } = await axios.post<Factory[]>(
      'rest/factory/getListByUserId/',
      { userId: userStore.user?.userId }
    );
    factoryList.value = data;
  } catch (error) {
    logError(error);
  }
}

function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      dialogVisible.value = false;
      router.push({
        name: 'ExportToExcel',
        query: buildSendData(),
      });
      form.dateRange = form.factoryId = '';
    } else {
      console.log('ExportToExcel validate error!');
      return false;
    }
  });
}
</script>

<template>
  <ElButton class="sub-header__el-button" @click="dialogVisible = true">
    <DocumentIcon class="sub-header__button-icon" />
    Выгрузить в Excel
  </ElButton>

  <ElDialog
    modal-class="calendar-excel-modal"
    v-model="dialogVisible"
    title="Выгрузка в Excel"
    width="400px"
    :close-on-click-modal="false"
    @open="getFactoryListByUserId"
  >
    <ElForm
      ref="formRef"
      :model="form"
      :rules="validationRules"
      label-position="top"
      hide-required-asterisk
    >
      <ElFormItem label="Базис" prop="factoryId">
        <ElSelect class="basis__select" v-model="form.factoryId">
          <ElOption
            v-for="factory in factoryList"
            :key="factory.ID"
            :label="factory.SHORT_NAME || factory.NAME"
            :value="factory.ID"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="Период выгрузки" prop="dateRange">
        <ElDatePicker
          class="calendar-excel-modal__date-picker"
          v-model="form.dateRange"
          type="daterange"
          :clearable="false"
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          start-placeholder="__.__.____"
          end-placeholder="__.__.____"
          range-separator="‒"
          :prefix-icon="CalendarIcon"
        >
          <template #title></template>
        </ElDatePicker>
      </ElFormItem>

      <ElFormItem>
        <ElButton
          class="calendar-excel-modal__button"
          type="primary"
          size="large"
          @click="onSubmit(formRef)"
        >
          Выгрузить
        </ElButton>
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>

<style lang="scss"></style>
