<script setup lang="ts">
import { ElForm, ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { logError } from '@/utils/helpers/logError';
import { ValidationRules } from '@/types/ValidationRules';

type FormInstance = InstanceType<typeof ElForm>;

const userStore = useUserStore();
const router = useRouter();

const message = 'Поле обязательно для заполнения';

// auth form
const formRef = ref<FormInstance>();
const formData = reactive({ username: '', password: '' });
const formRules = ref<ValidationRules>({
  username: { required: true, type: 'email', message },
  password: { required: true, message },
});

// restore password form
const isRestoreVisible = ref(false);
const restoreFormRef = ref<FormInstance>();
const restoreFormData = reactive({
  email: '',
});
const restoreFromRules = ref<ValidationRules>({
  email: { required: true, type: 'email', message },
});

const isLoading = ref(false);

async function handleSubmit() {
  try {
    isLoading.value = true;
    await userStore.login(formData);

    if (userStore.isTrader || userStore.isUmiop) {
      await router.push({ name: 'Calendar' });
    } else if (userStore.isSupervisorBO) {
      await router.push({ name: 'ArmBo' });
    }
  } catch (error) {
    logError(error, { isMessage: true });
  } finally {
    isLoading.value = false;
  }
}

async function handleRestoreSubmit() {
  try {
    isLoading.value = true;
    const { data } = await userStore.restorePassword(restoreFormData);
    isRestoreVisible.value = false;
    ElMessage.success(data.message);
  } catch (error) {
    logError(error, { isMessage: true });
  } finally {
    isLoading.value = false;
  }
}

function onSubmit(formEl: FormInstance | undefined, isRestoreForm?: boolean) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      isRestoreForm ? handleRestoreSubmit() : handleSubmit();
    } else {
      ElMessage.error('Ошибка валидации формы');
      return false;
    }
  });
}
</script>

<template>
  <div class="auth-view">
    <div class="auth-view__wrapper">
      <h1 class="auth-view__title">Вход в систему BitumMap</h1>
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="auth-view__form"
        hide-required-asterisk
      >
        <ElFormItem class="auth-view__item" label="E-mail" prop="username">
          <ElInput
            v-model="formData.username"
            type="email"
            placeholder="Введите данные..."
            autocomplete="on"
          />
        </ElFormItem>
        <ElFormItem class="auth-view__item" label="Пароль" prop="password">
          <ElInput
            v-model="formData.password"
            type="password"
            placeholder="Введите данные..."
            show-password
          />
        </ElFormItem>
        <ElFormItem class="auth-view__item">
          <ElButton
            class="auth-view__submit-button"
            type="primary"
            @click="onSubmit(formRef)"
            :loading="isLoading"
          >
            Войти
          </ElButton>
        </ElFormItem>
        <ElFormItem class="auth-view__item">
          <ElLink
            class="auth-view__reset-button"
            type="primary"
            role="button"
            :underline="false"
            @click="isRestoreVisible = true"
          >
            Восстановить пароль
          </ElLink>
        </ElFormItem>
      </ElForm>

      <ElDialog
        v-model="isRestoreVisible"
        custom-class="auth-view__dialog"
        title="Восстановление пароля"
        width="287px"
        top="35vh"
        append-to-body
      >
        <ElForm
          ref="restoreFormRef"
          :model="restoreFormData"
          :rules="restoreFromRules"
          label-position="top"
          hide-required-asterisk
        >
          <ElFormItem class="auth-view__item" label="E-mail" prop="email">
            <ElInput
              v-model="restoreFormData.email"
              type="email"
              placeholder="Введите данные..."
              autocomplete="on"
            />
          </ElFormItem>
        </ElForm>
        <template #footer>
          <ElButton
            type="primary"
            @click="onSubmit(restoreFormRef, true)"
            :loading="isLoading"
          >
            Восстановить
          </ElButton>
          <ElButton @click="isRestoreVisible = false">Закрыть</ElButton>
        </template>
      </ElDialog>
    </div>
  </div>
</template>

<style lang="scss">
.auth-view {
  &__wrapper {
    margin: 0 auto;
    margin-top: calc(20vh - 100px);

    max-width: 287px;

    background: #ffffff;
    backdrop-filter: blur(20px);
    border-radius: 4px;

    padding: 18px 24px 12px;
  }

  &__title {
    font-weight: 400;
    font-size: 17px;
    text-align: center;
  }

  &__form {
    margin-top: 23px;
  }

  &__item {
    margin-bottom: 10px;
  }

  &__submit-button {
    margin-top: 18px;
    min-width: 100%;
  }

  &__reset-button {
  }

  &__dialog .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
