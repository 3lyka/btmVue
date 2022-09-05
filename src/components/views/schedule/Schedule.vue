<template>
  <section class="schedule">
    <div class="main-content__head">
      <div class="main-content__head-row">
        <ElForm
          :inline="true"
          :model="form"
          label-position="top"
          class="demo-form-inline"
        >
          <ElFormItem label="Отгрузка">
            <ElDatePicker
              v-model="curDate"
              type="month"
              placeholder="Выбирите месяц отгрузки"
              format="MM.YYYY"
              :suffix-icon="Calendar"
            />
          </ElFormItem>
          <ElFormItem label="Базис">
            <ElSelect
              v-model="basis"
              class="el-input-basis"
              placeholder="Базис"
            >
              <ElOption
                v-for="item in basisOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </div>
    </div>

    <ScheduleFilter v-bind:curDate="curDate" v-bind:form="form" />

    <ScheduleFull :curDate="curDate" :daysArr="daysArr" />

    <ScheduleSmall :curDate="curDate" :daysArr="daysArr" />
  </section>
</template>

<script>
import ScheduleFilter from '@/components/views/schedule/ScheduleFilter';
import ScheduleSmall from '@/components/views/schedule/ScheduleSmall';
import ScheduleFull from '@/components/views/schedule/ScheduleFull';
import { mapState } from 'vuex';

export default {
  name: 'Schedule',
  ...mapState({
    //lots: state => state.lot.lots,
  }),
  data: () => ({
    curDate: new Date(),
    form: [],
    basisOptions: [
      { id: 1, name: 'ГАЗПРОМНЕФТЬ-ТОТАЛЬ ПМБ' },
      { id: 2, name: 'МНПЗ' },
      { id: 3, name: 'НОВА-БРИТ' },
      { id: 4, name: 'ОНПЗ' },
      { id: 5, name: 'Рязанский завод БМ' },
      { id: 6, name: 'ЯРОСЛАВНЕФТЕОРГСИНТЕЗ' },
    ],
    basis: 5,
  }),
  methods: {
    scheduleGrouping: function ({ row }) {
      if (row[0].length !== 0) {
        return 'el-table__total';
      }

      return '';
    },
  },
  computed: {
    daysArr: function () {
      const daysCount = new Date(
          this.curDate.getFullYear(),
          this.curDate.getMonth() + 1,
          0
        ).getDate(),
        daysArr = [];

      for (let i = 1; i <= daysCount; i++) {
        daysArr[i - 1] = i < 10 ? '0' + i : '' + i;
      }

      return daysArr;
    },
  },
  components: { ScheduleFilter, ScheduleSmall, ScheduleFull },
};
</script>

<style scoped></style>
