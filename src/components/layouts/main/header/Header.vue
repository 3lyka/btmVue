<script setup lang="ts">
import HeaderTitle from '@/components/layouts/main/header/HeaderTitle.vue';
import UserCard from '@/components/layouts/main/header/UserCard.vue';
import Container from '@/components/components-helpers/Container.vue';
import DelimiterIcon from '@/components/components-helpers/icons/DelimiterIcon.vue';
import SiteLogoIcon from '../../../components-helpers/icons/SiteLogoIcon.vue';
import { RouterLink } from 'vue-router';
</script>

<!-- todo: className .header убрать из других компонентов. .logo убрать -->
<!-- todo: перенести scss в этот компонент. -->
<template>
  <header class="header">
    <Container>
      <div class="header__left">
        <div class="logo header__logo">
          <RouterLink class="header__logo-img" :to="{ name: 'Calendar' }">
            <SiteLogoIcon role="img" aria-label="Логотип компании" />
          </RouterLink>
          <DelimiterIcon class="header__delimiter" />
        </div>
        <div class="header__bitum-map">
          <div class="header__bitum-map-text">BitumMap</div>
        </div>
      </div>
      <div class="header__right">
        <HeaderTitle />
        <UserCard class="header__user-card" />
      </div>
    </Container>
  </header>
</template>

<style lang="scss"></style>
