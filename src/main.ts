import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import store from './store';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ElementPlus from 'element-plus';
import ru from 'element-plus/es/locale/lang/ru';

import 'element-plus/dist/index.css';
import '@/assets/dist/style.scss';

dayjs.locale('ru');

const app = createApp(App);

app.use(createPinia());
app.use(store);
app.use(router);
app.use(ElementPlus, { locale: ru });

app.mount('#app');
