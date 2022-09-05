import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { exportToExcel, type QueryParams } from '@/utils/helpers/exportExcel';
import { UserGroups } from '@/utils/apiService/apiUser';
import { useUserStore } from '@/stores/user';
import { logError } from '@/utils/helpers/logError';
import { ElMessage } from 'element-plus';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Для значения используется название компонента в директории 'layouts'.
     * @default 'MainLayout' см. App.vue
     * */
    layout?: 'MainLayout' | 'AuthLayout';
    // todo?: Использовать 'name' вместо 'title'.
    title?: string;
    requiresAuth?: boolean;
    accessGroups?: UserGroups;
  }
}

// todo: refactor name values.
const routes: RouteRecordRaw[] = [
  {
    path: '/schedule/',
    name: 'Schedule',
    meta: {
      layout: 'MainLayout',
      title: 'schedule',
      requiresAuth: true,
      accessGroups: ['Portal_BMM_ARM_Trader', 'Portal_BMM_ARM_UMIOP'],
    },
    component: () => import('../components/views/schedule/Schedule.vue'),
  },
  {
    path: '/planning/shipment-plan/:id',
    name: 'ShipmentPlan',
    meta: {
      layout: 'MainLayout',
      pageTitle: 'Планирование отгрузок',
      requiresAuth: true,
      accessGroups: ['Portal_BMM_ARM_Trader', 'Portal_BMM_ARM_UMIOP'],
    },
    component: () =>
      import('../components/views/planning/plan/PlanDetailView.vue'),
  },
  {
    path: '/planning/',
    name: 'Planning',
    meta: {
      layout: 'MainLayout',
      title: 'planning',
      requiresAuth: true,
      accessGroups: ['Portal_BMM_ARM_Trader', 'Portal_BMM_ARM_UMIOP'],
    },
    component: () => import('../components/views/planning/list/PlanView.vue'),
  },
  {
    path: '/arm_trading/',
    name: 'Calendar',
    meta: {
      layout: 'MainLayout',
      title: 'calendar',
      requiresAuth: true,
      accessGroups: [
        'Portal_BMM_ARM_Trader',
        'Portal_BMM_ARM_UMIOP',
        'Portal_BMM_ARM_Head_Trader',
        'Portal_BMM_ARM_Head_Direction',
      ],
    },
    component: () =>
      import('../components/views/trading-session/calendar/Calendar.vue'),
  },
  {
    path: '/arm_trading/lot/:id',
    name: 'Trading',
    meta: {
      layout: 'MainLayout',
      title: 'lot',
      requiresAuth: true,
      accessGroups: [
        'Portal_BMM_ARM_Trader',
        'Portal_BMM_ARM_UMIOP',
        'Portal_BMM_ARM_Head_Trader',
        'Portal_BMM_ARM_Head_Direction',
      ],
    },
    component: () => import('../components/views/Trading.vue'),
  },
  {
    path: '/exportExcel/',
    name: 'ExportToExcel',
    beforeEnter(to) {
      if (to.query) {
        const query = to.query as unknown as QueryParams;
        exportToExcel(query);
      }
    },
    component: () =>
      import('../components/components-helpers/ExportToExcel.vue'),
  },
  {
    path: '/',
    name: 'Login',
    meta: {
      layout: 'AuthLayout',
      title: 'login',
    },
    component: () => import('../components/views/AuthView.vue'),
  },
  {
    path: '/arm_bo/',
    name: 'ArmBo',
    redirect: '/arm_bo/planning/',
    meta: {
      requiresAuth: true,
      accessGroups: ['Portal_BBM_ARM_BO'],
    },
  },
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: () => import('../components/views/404.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const requiresAuth = to.meta.requiresAuth;

  if (!requiresAuth) return true;

  const userStore = useUserStore();

  /** Проверяет сессию, если существует, получает новый токен и получает пользоватея. */
  async function checkTokenAndGetUser() {
    try {
      await userStore.checkToken();
      await userStore.getInfo();
    } catch (error) {
      logError(error, {
        isMessage: true,
        message: 'Необходимо авторизоваться',
      });

      return { name: 'Login' };
    }
  }

  // Если нет токена, проверяем сессию, если существует, получаем новый токен и получаем пользоватея.
  if (!userStore.token) {
    const redirect = await checkTokenAndGetUser();
    if (redirect) return redirect;
  }

  // Если есть токен, но нет пользователя, получаем пользователя. Убирает лишний запрос на checkToken.
  if (!userStore.user) {
    try {
      await userStore.getInfo();
    } catch (error) {
      const redirect = await checkTokenAndGetUser();
      if (redirect) return redirect;
    }
  }

  // Проверяем группы доступа для пользователя.
  const userGroups = userStore.user?.groups;
  const metaAccessGroups = to.meta.accessGroups;

  async function logoutOnRoleNotFound() {
    ElMessage.info('У пользователя отсутствует необходимая роль.');
    await userStore.logout({ disableRouterPush: true });
    return { name: 'Login' };
  }

  if (metaAccessGroups?.length && !userGroups?.length) {
    return await logoutOnRoleNotFound();
  }

  if (metaAccessGroups?.length && userGroups?.length) {
    const userHasGroup = metaAccessGroups.some((metaGroup) =>
      userGroups.includes(metaGroup)
    );

    if (userHasGroup) return true;

    return await logoutOnRoleNotFound();
  }

  return true;
});
