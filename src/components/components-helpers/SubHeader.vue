<template>
  <div class="sub-header">
    <div class="sub-header__wrap" v-if="path === 'arm_trading'">
      <div class="sub-header__item-button">
        <a
          class="sub-header__button"
          href="https://bdp.apps.paas.gazprom-neft.local/"
        >
          <ElButton class="sub-header__el-button">
            <ExternalResourceIcon class="sub-header__button-icon" />
            Перейти в ДЦБМ
          </ElButton>
        </a>
        <div class="sub-header__button">
          <CalendarExcelModal />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExternalResourceIcon from './icons/ExternalResourceIcon.vue';
import CalendarExcelModal from '@/components/views/trading-session/calendar/CalendarExcelModal';

export default {
  name: 'SubHeader',
  components: { CalendarExcelModal, ExternalResourceIcon },

  computed: {
    path() {
      return this.$route.path.replace(/^\/|\/$/g, '');
    },
  },
};
</script>

<style scoped></style>
