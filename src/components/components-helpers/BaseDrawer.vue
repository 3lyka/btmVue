<script setup lang="ts">
import { computed } from 'vue';
import { ElDrawer } from 'element-plus';

const props = defineProps<{
  elDrawerProps?: Partial<InstanceType<typeof ElDrawer>['$props']>;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const drawer = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});
</script>

<template>
  <ElDrawer
    modal-class="base-drawer"
    custom-class="base-drawer__drawer"
    v-model="drawer"
    v-bind="elDrawerProps"
    :lock-scroll="false"
    :size="elDrawerProps?.size || '572px'"
  >
    <template #title v-if="$slots.title">
      <slot name="title" />
    </template>
    <template #default>
      <slot />
    </template>
    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </ElDrawer>
</template>

<style lang="scss">
.base-drawer {
  // <template #title>
  &__drawer .el-drawer__header {
    padding: 16px 24px;
    border-bottom: 1px solid #d7e2f2;
    color: #606580;
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 0;
  }
  // <template #default>
  &__drawer .el-drawer__body {
    padding: 8px 24px;
    overflow-y: auto;
  }

  // <template #footer>
  &__drawer .el-drawer__footer {
    border-top: 1px solid #d7e2f2;
    padding: 16px 24px 24px;
  }
}
</style>
