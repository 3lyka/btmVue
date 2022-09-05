<script setup lang="ts">
import { Factory } from '@/utils/apiService/apiFactory';
import { ref, watch } from 'vue';

defineProps<{
  factories: Factory[];
}>();

const emit = defineEmits<{
  (event: 'selectFactory', value: string): void;
}>();

const factory = ref('');

watch(factory, (newVal) => {
  emit('selectFactory', newVal);
});
</script>

<template>
  <div class="plan-filter">
    <ElRadioGroup class="plan-filter__group" v-model="factory" size="default">
      <ElRadioButton class="plan-filter__button" label="">
        Все БО
      </ElRadioButton>
      <ElRadioButton
        class="plan-filter__button"
        v-for="factory in factories"
        :key="factory.ID"
        :label="factory.ID"
      >
        {{ factory.NAME }}
      </ElRadioButton>
    </ElRadioGroup>
  </div>
</template>

<style lang="scss">
.plan-filter {
  &__button {
  }
}
</style>
