<script setup>
import { User } from '@element-plus/icons-vue';
</script>

<template>
  <ElDrawer
    v-model="isOpenPlanHistory"
    title="История плана"
    direction="rtl"
    :size="570"
  >
    <div class="planning__history">
      <div class="planning__history-head">
        <h1>Рязанский завод битумных материалов</h1>
        <label>Отгрузка: <span>12.02.2022</span></label>
      </div>

      <div class="planning__history-item">
        <div class="planning__history-item-head">
          <label>15.01.2022 15:41</label>
          <div
            class="planning__history-item-head-user planning__history-item-head-user--external"
          >
            Алексей Иванов <User />
          </div>
        </div>
        <div class="planning__history-item-status">
          <p>Не согласовал</p>
        </div>
        <div class="planning__history-item-comment">
          <label>Комментарий:</label>
          <p>
            Необходимо отдать объем по ПБВ-130 ОмскКрышСтрой (срочная отгрузка)
          </p>
        </div>
      </div>

      <div class="planning__history-item">
        <div class="planning__history-item-head">
          <label>15.01.2022 15:41</label>
          <div class="planning__history-item-head-user">Вы <User /></div>
        </div>
        <div class="planning__history-item-status">
          <p>Отправил на согласование</p>
        </div>
      </div>

      <div class="planning__history-items">
        <div class="planning__history-item">
          <div class="planning__history-item-head">
            <label>15.01.2022 15:41</label>
            <div class="planning__history-item-head-user">Вы <User /></div>
          </div>
          <div class="planning__history-item-status">
            <p>Создал план</p>
          </div>
        </div>
      </div>
    </div>
  </ElDrawer>
</template>

<script>
export default {
  name: 'PlanHistory',
  props: ['planId'],
  data: () => ({}),
  computed: {},
  methods: {},
  components: {},
};
</script>

<style scoped></style>
