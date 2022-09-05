<template>
  <component class="container" :is="tag || 'div'">
    <slot />
  </component>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    tag: { type: String, require: false },
  },
});
</script>
