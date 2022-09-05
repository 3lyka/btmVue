import { router } from '@/router';
import store from '@/store';
import {
  apiUser,
  LoginCredentials,
  RestorePasswordData,
  UserInfo,
} from '@/utils/apiService/apiUser';
import { logError } from '@/utils/helpers/logError';
import { type RemovableRef, useLocalStorage } from '@vueuse/core';
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';

interface UserStoreState {
  token: RemovableRef<string | null>;
  user: UserInfo | null;
}

export const useUserStore = defineStore({
  id: 'user',

  state: (): UserStoreState => ({
    token: useLocalStorage('token', null),
    user: null,
  }),

  getters: {
    isTrader: (state) => {
      return (
        state.user?.groups.includes('Portal_BMM_ARM_Trader') ||
        state.user?.groups.includes('Portal_BMM_ARM_Head_Trader') ||
        state.user?.groups.includes('Portal_BMM_ARM_Head_Direction') ||
        false
      );
    },

    isUmiop: (state) => {
      return state.user?.groups.includes('Portal_BMM_ARM_UMIOP') || false;
    },

    isSupervisorBO: (state) => {
      return state.user?.groups.includes('Portal_BBM_ARM_BO') || false;
    },
  },

  actions: {
    async login(loginCredentials: LoginCredentials) {
      try {
        const { data } = await apiUser.login(loginCredentials);
        this.token = data.token;

        await this.getInfo();
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          throw new Error('Неверный логин или пароль');
        }

        return Promise.reject(error);
      }
    },

    async logout({ routeToName = 'Login', disableRouterPush = false } = {}) {
      try {
        // todo?: backend, не возращать 401 или проверять по 401 в catch.
        await apiUser.logout();
        this.$reset();
        this.token = null;

        // vuex reset state to initial.
        store.dispatch('lot/resetState');
        store.dispatch('offer/resetState');
        store.dispatch('menu/resetState');

        if (!disableRouterPush) router.push({ name: routeToName });
      } catch (error) {
        logError(error, { isMessage: true });
      }
    },

    async checkToken() {
      try {
        const { data } = await apiUser.checkToken();
        this.token = data.token;
      } catch (error) {
        logError(error);
        return Promise.reject(error);
      }
    },

    async getInfo() {
      try {
        const { data } = await apiUser.getInfo();
        this.user = data;
      } catch (error) {
        logError(error);
        return Promise.reject(error);
      }
    },

    // todo?: не модифицирует state, получать данные напрямую в компоненте.
    async restorePassword({ email }: RestorePasswordData) {
      try {
        return await apiUser.restorePassword({ email });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          throw new Error(error.response.data.message);
        }

        return Promise.reject(error);
      }
    },
  },
});
