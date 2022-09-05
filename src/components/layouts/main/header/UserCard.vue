<template>
  <div class="user-card">
    <div class="user-card__avatar">
      <UserIcon role="img" />
    </div>
    <div class="user-card__wrap">
      <div class="user-card__name">{{ getUserName() }}</div>
      <div class="user-card__position">{{ getUserPosition() }}</div>
    </div>
    <button @click="userStore.logout()" class="user-card__exit" title="Выход">
      <ExitIcon />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import ExitIcon from '../../../components-helpers/icons/ExitIcon.vue';
import UserIcon from '@/components/components-helpers/icons/UserIcon.vue';
import { useUserStore } from '@/stores/user';

export default defineComponent({
  name: 'UserCard',
  components: { ExitIcon, UserIcon },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    getUserName() {
      if (this.userStore.user?.fullname) {
        return this.userStore.user.fullname;
      } else if (this.userStore.user?.email) {
        return this.userStore.user.email;
      } else {
        return 'Фамилия И.О.';
      }
    },
    getUserPosition() {
      return this.userStore.user?.position;
    },
  },
});
</script>

<style lang="scss"></style>
