<template>
  <div class="calendar">
    <ElAffix :z-index="1" :offset="60">
      <div class="calendar__title">
        <div class="calendar__title-left">
          <CalendarPagination
            @clickLast="decrease"
            @clickNext="increase"
            :activeTab="activeTab"
            :monthKey="monthKey"
            :year="year"
            :months="months"
            :calendar="calendar"
            :numberWeek="numberWeek"
          />
        </div>
        <div class="calendar__title-right">
          <SubHeader class="calendar__title-subheader" />
          <CalendarTab :onTab="onTab" :activeTab="activeTab" />
        </div>
      </div>
    </ElAffix>
    <CalendarWeek
      v-if="activeTab === 'week'"
      :lots="lots"
      :monthKey="monthKey"
      :year="year"
      :daysWeek="daysWeek"
      :months="months"
      :date="date"
      :calendar="calendar"
      :numberWeek="numberWeek"
    />
    <CalendarMonth
      v-else-if="activeTab === 'month'"
      ref="calendarMonth"
      :lots="lots"
      :monthKey="monthKey"
      :year="year"
      :daysWeek="daysWeek"
      :months="months"
      :date="date"
      :calendar="calendar"
    />
    <!-- <CalendarDay v-else-if="activeTab === 'day'" /> -->
  </div>
</template>

<script>
// import CalendarDay from "@/components/views/trading-session/calendar/CalendarDay";
import CalendarWeek from '@/components/views/trading-session/calendar/CalendarWeek';
import CalendarMonth from '@/components/views/trading-session/calendar/CalendarMonth';
import CalendarTab from '@/components/views/trading-session/calendar/CalendarTab';
import CalendarPagination from '@/components/views/trading-session/calendar/CalendarPagination';
import { mapState } from 'vuex';
import SubHeader from '../../../components-helpers/SubHeader.vue';
import { useInterval } from '@/composables/useInterval';
import { getCurrentInstance } from 'vue';

export default {
  name: 'Calendar',

  data: () => ({
    activeTab: 'week',
    monthKey: new Date().getMonth(),
    year: new Date().getFullYear(),
    dFirstMonth: '1',
    daysWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
    date: new Date(),
    numberWeek: 0,
  }),

  setup() {
    const { ctx } = getCurrentInstance();

    // делаем запрос на обновление данных, раз в 1 минуту.
    useInterval(() => ctx.getLots(), 60000);
  },
  mounted() {
    this.getActiveTabFromLocalStorage();

    // При переходе в лот с по клику с календаря возращаем на дату, с которой переходили.
    // В случае при переходе по прямой ссылке, возращаемся в календарь на текущую дату.
    const toCurrentDate = this.$route.params.toCurrentDate === 'true';
    if (toCurrentDate) {
      localStorage.removeItem('numberWeek');
      localStorage.removeItem('monthKey');
      localStorage.removeItem('year');

      localStorage.removeItem('activeTab'); // возращаем на недельный вид.
      this.activeTab = 'week'; // возращаем на недельный вид.
    }

    if (this.activeTab === 'week') {
      this.setDefaultWeek();
    } else {
      this.setDefaultMonth();
    }

    this.getLots();

    this.$store.subscribe((mutations) => {
      if (mutations.type === 'lot/lotFormSuccess') {
        this.getLots();
      }
    });
  },
  watch: {
    monthKey: {
      handler() {
        this.getLots();
      },
    },
  },
  computed: {
    ...mapState({
      lots: (state) => state.lot.lots,
    }),
    calendar: function () {
      const days = [[]];
      let week = 0;
      let lastDay = new Date(this.year, this.monthKey + 1, 0).getDate();

      for (let i = 1; i <= lastDay; i++) {
        if (new Date(this.year, this.monthKey, i).getDay() === 1) {
          week++;
          days[week] = [];
        }

        const date = new Date(this.year, this.monthKey, i);

        days[week].push({
          number: i,
          monthKey: this.monthKey,
          date,
          current: this.isToday(date),
        });
      }

      if (days[0].length > 0) {
        lastDay = new Date(this.year, this.monthKey, 0).getDate();
        const firstMonth = 0;
        let previousMonth = this.monthKey - 1;
        let previousYear = this.year;
        if (this.monthKey === firstMonth) {
          previousMonth = 11;
          previousYear = this.year - 1;
        }
        for (let i = days[0].length; i < 7; i++) {
          const date = new Date(previousYear, previousMonth, lastDay);
          days[0].unshift({
            number: lastDay,
            monthKey: previousMonth,
            current: this.isToday(date),
            date: date,
          });
          lastDay--;
        }
      }

      if (days[days.length - 1].length <= 6) {
        let dayFirst = 1;
        const lastMonth = 11;
        let nextMonth = this.monthKey + 1;
        let nextYear = this.year;

        if (this.monthKey === lastMonth) {
          nextMonth = 0;
          nextYear = this.year + 1;
        }

        for (let i = days[days.length - 1].length; i < 7; i++) {
          const date = new Date(nextYear, nextMonth, dayFirst);
          days[days.length - 1].push({
            number: dayFirst,
            monthKey: nextMonth,
            current: this.isToday(date),
            date: date,
          });
          dayFirst++;
        }
      }

      if (days[0].length === 0) {
        days.splice(0, 1);
      }

      if (this.$data.activeTab === 'week') {
        return days;
      } else {
        return [].concat(...days);
      }
    },
  },
  methods: {
    clickCloseLots() {
      this.$refs?.calendarMonth?.clickCloseLots();
    },

    getLots() {
      const dateStart =
          this.$data.activeTab === 'week'
            ? this.calendar.at(0).at(0).date
            : this.calendar.at(0).date,
        dateEnd =
          this.$data.activeTab === 'week'
            ? this.calendar.at(-1).at(-1).date
            : this.calendar.at(-1).date;

      this.$store.dispatch('lot/getListByMounts', {
        dateStart: dateStart.toLocaleDateString('ru-RU'),
        dateEnd: dateEnd.toLocaleDateString('ru-RU'),
      });
    },

    onTab(data) {
      this.activeTab = data.code;
      this.setActiveTabToLocalStorage();
    },
    setActiveTabToLocalStorage() {
      //try catch
      localStorage.setItem('activeTab', this.activeTab);
    },
    getActiveTabFromLocalStorage() {
      this.activeTab = localStorage.getItem('activeTab')
        ? localStorage.getItem('activeTab')
        : 'week';
    },
    decrease() {
      this.clickCloseLots();

      if (this.activeTab === 'week') {
        if (this.monthKey === 0 && this.numberWeek === 0) {
          const day = this.calendar[0].find(({ date }) => date.getDate() === 1);
          const dayOffset = day.date.getDay() > 1 ? 2 : 1;
          this.year--;
          this.numberWeek = this.calendar.length - dayOffset;
          this.monthKey = 11;
        } else if (this.numberWeek === 0) {
          const day = this.calendar[0].find(({ date }) => date.getDate() === 1);
          const dayOffset = day.date.getDay() !== 1 ? 2 : 1;
          this.numberWeek = this.calendar.length - dayOffset;
          this.monthKey--;
        } else {
          this.numberWeek--;
        }
      } else {
        this.monthKey--;
        if (this.monthKey < 0) {
          this.monthKey = 12;
          this.monthKey--;
          this.year--;
        }
      }
      this.setDataToLocalStorage();
    },
    setDefaultWeek() {
      let defaultWeek = 0;

      this.calendar.forEach(function (week, i) {
        if (week.find((day) => day.current === true)) {
          defaultWeek = i;
        }
      });

      this.numberWeek = localStorage.getItem('numberWeek')
        ? parseInt(localStorage.getItem('numberWeek'))
        : defaultWeek;
      this.monthKey = localStorage.getItem('monthKey')
        ? parseInt(localStorage.getItem('monthKey'))
        : this.monthKey;
      this.year = localStorage.getItem('year')
        ? parseInt(localStorage.getItem('year'))
        : this.year;
    },

    setDefaultMonth() {
      this.monthKey = localStorage.getItem('monthKey')
        ? parseInt(localStorage.getItem('monthKey'))
        : this.monthKey;
    },
    increase() {
      this.clickCloseLots();

      if (this.activeTab === 'week') {
        if (this.numberWeek < this.calendar.length - 1) {
          this.numberWeek++;
        } else {
          const day = this.calendar[this.calendar.length - 1].find(
            ({ date }) => date.getDate() === 1
          );
          this.numberWeek = day ? 1 : 0;
          this.monthKey++;
          const lastMonth = 11;
          if (this.monthKey > lastMonth) {
            this.monthKey = 0;
            this.year++;
          }
        }
      } else {
        this.monthKey++;
        if (this.monthKey > 11) {
          this.monthKey = -1;
          this.monthKey++;
          this.year++;
        }
      }
      this.setDataToLocalStorage();
    },
    isToday(date) {
      const today = new Date();

      return (
        date.getDate() === today.getDate() &&
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth()
      );
    },
    setDataToLocalStorage() {
      localStorage.setItem('monthKey', this.monthKey);
      localStorage.setItem('numberWeek', this.numberWeek);
      localStorage.setItem('year', this.year);
    },
  },
  components: {
    CalendarTab,
    CalendarPagination,
    CalendarMonth,
    CalendarWeek,
    SubHeader,
  },
};
</script>

<style scoped></style>
