<template>
  <ElAffix :z-index="4">
    <Header @clickSidebarButton="leftMenuOpen = !leftMenuOpen" />
  </ElAffix>
  <Title v-if="title === 'lot'" />
  <section class="content" :class="{ content_lot: title === 'lot' }">
    <div class="container">
      <div class="content__box content__box_content">
        <div class="content__left">
          <LotDetail v-if="title === 'lot'" />

          <div class="content__menu" v-else>
            <Overlay v-if="leftMenuOpen" @click="leftMenuOpen = false" />
            <LeftMenu
              :leftMenuOpen="leftMenuOpen"
              @toggleMenuVisability="leftMenuOpen = !leftMenuOpen"
            />
          </div>
        </div>
        <main class="main">
          <div class="main-content">
            <RouterView />
          </div>
        </main>
      </div>
      <div class="content__box content__box_footer" v-if="title === 'lot'">
        <!-- <Footer/> -->
        <ConfirmDescription />
      </div>
      <Overlay
        @click="handleCalendarLotFormClose"
        v-if="title === 'calendar'"
        v-show="isCalendarLotFormOpen"
      />
      <CalendarLotForm
        ref="calendarLotForm"
        v-if="title === 'calendar'"
        v-show="isCalendarLotFormOpen"
        :isCalendarLotFormOpen="isCalendarLotFormOpen"
      />
    </div>
  </section>
</template>

<script>
import LeftMenu from '@/components/components-helpers/LeftMenu';
import CalendarLotForm from '@/components/views/trading-session/calendar/CalendarLotForm';
import Header from '@/components/layouts/main/header/Header';
import Title from '@/components/components-helpers/Title';
import LotDetail from '@/components/views/trading-session/lot/LotDetail';
import ConfirmDescription from './main/footer/ConfirmDescription.vue';
import Overlay from '../components-helpers/Overlay.vue';

export default {
  name: 'MainLayout',
  data: () => ({
    leftMenuOpen: false,
  }),
  methods: {
    handleCalendarLotFormClose() {
      this.$refs.calendarLotForm.closeFormWithConfirm();
    },
  },
  computed: {
    isCalendarLotFormOpen() {
      return this.$store.state.lot.calendarLotFormOpen;
    },
    title() {
      return this.$route.meta.title;
    },
  },
  components: {
    LotDetail,
    Title,
    LeftMenu,
    CalendarLotForm,
    Header,
    ConfirmDescription,
    Overlay,
  },
};
</script>

<style scoped></style>
