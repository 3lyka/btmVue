<template>
  <nav class="menu" :class="{ menu_expanded: leftMenuOpen }">
    <div class="menu__toggle" @click="$emit('toggleMenuVisability')">
      <p v-if="leftMenuOpen">АРМ Трейдера</p>
      <ToggleMenuIcon
        class="menu__toggle-icon"
        :class="{ 'menu__toggle-icon_open': leftMenuOpen }"
      />
    </div>
    <ul class="menu__list">
      <RouterLink
        v-for="item in leftMenu"
        :key="item.ITEM_INDEX"
        role="listitem"
        class="menu__item"
        active-class="menu__item_active"
        :to="item.LINK"
        v-slot="{ isActive }"
      >
        <div class="menu__item-img">
          <img
            :src="
              require(`@/assets/img/menu_icons/${getIconName(
                isActive
                  ? item.PARAMS.ICON_NAME + '-active'
                  : item.PARAMS.ICON_NAME
              )}.svg`)
            "
          />
        </div>
        <div class="menu__item-name" v-if="leftMenuOpen">
          <p class="menu__item-text">{{ item.TEXT }}</p>
        </div>
      </RouterLink>
    </ul>
    <div class="menu__helpdesk">
      <RouterLink
        v-for="item in bottomMenu"
        :key="item.ITEM_INDEX"
        class="menu__feedback menu__helpdesk-item"
        :to="item.LINK"
        target="_blank"
      >
        <div class="menu__feedback-img">
          <img
            :src="
              require(`@/assets/img/menu_icons/${item.PARAMS.ICON_NAME}.svg`)
            "
          />
        </div>
        <p class="menu__feedback-text" v-if="leftMenuOpen">
          {{ item.TEXT }}
        </p>
      </RouterLink>
    </div>
  </nav>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import ToggleMenuIcon from './icons/ToggleMenuIcon.vue';

export default defineComponent({
  name: 'LeftMenu',
  components: { ToggleMenuIcon },
  props: ['leftMenuOpen'],
  emits: ['toggleMenuVisability'],

  computed: {
    ...mapState({
      leftMenu: (state) => state.menu.leftMenu,
      bottomMenu: (state) => state.menu.bottomMenu,
    }),
  },
  methods: {
    getIconName(name) {
      if (name) {
        return name;
      } else {
        return 'default';
      }
    },
    getMenu() {
      this.$store.dispatch('menu/getMenu');
    },
  },
  mounted() {
    this.getMenu();
  },
});
</script>

<style scoped></style>
