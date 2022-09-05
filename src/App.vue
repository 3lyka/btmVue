<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// uppercase т.к. возращает компонент.
const Layout = computed(() => {
  const layoutName = route.meta.layout || 'MainLayout';

  return defineAsyncComponent(
    () => import(`@/components/layouts/${layoutName}.vue`)
  );
});
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
</template>
