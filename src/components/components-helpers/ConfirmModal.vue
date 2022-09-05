<script lang="ts" setup>
import { computed } from 'vue';

type ButtonAction = 'decline' | 'confirm';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'handleAction', action: ButtonAction): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

function handleClick(action: ButtonAction) {
  emit('handleAction', action);
  dialogVisible.value = false;
}
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="title"
    modal-class="confirm-modal"
    custom-class="confirm-modal__modal"
    :show-close="false"
  >
    <slot>{{ message }}</slot>
    <template #footer>
      <ElButton class="confirm-modal__button" @click="handleClick('decline')">
        <slot name="secondaryAction"> {{ cancelButtonText }} </slot>
      </ElButton>

      <ElButton
        class="confirm-modal__button"
        type="primary"
        @click="handleClick('confirm')"
      >
        <slot name="primaryAction"> {{ confirmButtonText }} </slot>
      </ElButton>
    </template>
  </ElDialog>
</template>

<style lang="scss">
.confirm-modal {
  &__modal {
    max-width: 440px;
  }

  &__modal .el-dialog__header {
    border-bottom: 1px solid #d7e2f2;
    color: #606580;
    font-weight: 700;
  }

  &__modal .el-dialog__footer {
    display: flex;
  }

  &__button {
    width: 50%;
  }
}
</style>
