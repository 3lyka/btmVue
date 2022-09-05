<template>
  <footer class="footer">
    <ConfirmDescription v-if="title === 'lot'" />
  </footer>
</template>

<script>
import ConfirmDescription from '@/components/layouts/main/footer/ConfirmDescription';

export default {
  name: 'Footer',
  computed: {
    title() {
      return this.$route.meta.title;
    },
  },
  components: { ConfirmDescription },
};
</script>

<style scoped></style>
