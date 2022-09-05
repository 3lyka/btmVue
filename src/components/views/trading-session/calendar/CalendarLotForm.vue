<template>
  <aside class="aside">
    <ElForm :model="ruleForm" :rules="rules" ref="ruleForm" class="lot-form">
      <div class="lot-form__header">
        <p class="lot-form__header-title">
          {{ lotTitle }}
        </p>
        <ElButton
          class="lot-form__header-close"
          text
          @click="closeFormWithConfirm"
        >
          <IconClose />
        </ElButton>
      </div>
      <div class="lot-form__content">
        <h3 class="lot-form__title">Даты</h3>
        <div class="lot-form__item" v-if="isCalendarLotFormOpen">
          <div class="lot-form__item-box">
            <h4 class="lot-form__item-box-subtitle">Торги</h4>
            <div class="period-interval">
              <ElFormItem prop="dateStart">
                <ElDatePicker
                  type="date"
                  class="period-interval__item"
                  :prefix-icon="customCalendarPrefix"
                  format="DD.MM.YYYY"
                  v-model="ruleForm.dateStart"
                  :disabled-date="disabledDate"
                  placement="top-start"
                  :disabled="isUmiop"
                  @change="setIsRuleFormEdited"
                />
              </ElFormItem>
              <ElFormItem prop="timeInterval">
                <TimeRangeSelect
                  class="period-interval__item"
                  v-model="ruleForm.timeInterval"
                  :disabled="isUmiop"
                  @change="setIsRuleFormEdited"
                />
              </ElFormItem>
            </div>
          </div>
          <div class="lot-form__item-box">
            <h4 class="lot-form__item-box-subtitle">Отгрузка</h4>
            <ElFormItem prop="shippingDate">
              <ElDatePicker
                class="period-interval__item"
                :prefix-icon="customCalendarPrefix"
                format="DD.MM.YYYY"
                v-model="ruleForm.shippingDate"
                :disabled-date="disabledShippingDate"
                :disabled="isUmiop"
                @change="setIsRuleFormEdited"
              />
            </ElFormItem>
          </div>
        </div>
        <h3 class="lot-form__title">Продукт</h3>
        <div class="lot-form__item">
          <div class="lot-form__item-box">
            <h4 class="lot-form__item-box-subtitle">Базис отгрузки</h4>
            <div class="basis">
              <ElFormItem prop="factoryId">
                <ElSelect
                  class="basis__select"
                  v-model="ruleForm.factoryId"
                  @change="setFactory($event)"
                  :disabled="
                    lot.isSaleButtonClicked || lot.lot.isResold || isUmiop
                  "
                >
                  <ElOption
                    v-for="factory in factoryList"
                    :key="factory.ID"
                    :label="factory.SHORT_NAME || factory.NAME"
                    :value="factory.ID"
                  />
                </ElSelect>
              </ElFormItem>
            </div>
          </div>

          <div class="lot-form__item-box">
            <h4 class="lot-form__item-box-subtitle">Номенклатура</h4>
            <div class="mark-bm">
              <ElFormItem prop="productId">
                <ElSelect
                  class="mark-bm__select"
                  v-model="ruleForm.productId"
                  filterable
                  :change="getProductListByFactoryId(this.ruleForm.factoryId)"
                  :disabled="
                    lot.isSaleButtonClicked || lot.lot.isResold || isUmiop
                  "
                >
                  <ElOption
                    v-for="product in productsList"
                    :key="product.ID"
                    :label="product.SHORT_NAME || product.SHORT_NAME"
                    :value="product.ID"
                  />
                </ElSelect>
              </ElFormItem>
            </div>
          </div>
        </div>

        <div class="lot-form__item">
          <div class="lot-form__item-box">
            <h4 class="lot-form__item-box-subtitle">Объем, т</h4>
            <div class="prepend">
              <ElFormItem prop="weight">
                <ElInputNumber
                  type="number"
                  class="prepend__select"
                  v-model.number="ruleForm.weight"
                  :min="0"
                  :max="999999"
                  :step="ruleForm.multiplicity"
                  step-strictly
                  :disabled="disabledWeight(ruleForm.factoryId) || isUmiop"
                  @change="setIsRuleFormEdited"
                />
              </ElFormItem>
            </div>
          </div>

          <div
            v-if="ruleForm.factoryId"
            class="lot-form__item-box lot-form__multiplicity"
          >
            <h4 class="lot-form__item-box-subtitle">
              Кратность <label>{{ ruleForm.multiplicity }} т</label>
            </h4>
          </div>
        </div>
        <h3 class="lot-form__title">Регион продаж</h3>
        <div class="lot-form__item">
          <CalendarLotFormAddRegions
            :key="resetFormKey"
            :regionListResponse="regionListResponse"
            :minNomenclaturePrice="this.ruleForm.minNomenclaturePrice"
            :currentRegions="this.ruleForm.regions"
            @onChangeRegions="onChangeRegions"
          />
        </div>
        <div class="comment-form">
          <div class="lot-form__item-box-subtitle">
            <h4 class="lot-form__item-box-subtitle">Комментарий для КА</h4>
          </div>
          <ElFormItem>
            <ElInput
              v-model="ruleForm.comment"
              type="textarea"
              :rows="3"
              placeholder="Введите данные..."
              :disabled="isUmiop"
              @change="setIsRuleFormEdited"
            />
          </ElFormItem>
        </div>
      </div>
      <div class="lot-form__footer">
        <div class="lot-form__submit">
          <ElButton
            type="primary"
            @click="onSubmit('ruleForm')"
            class="lot-form__submit-button"
            :disabled="isDisable || isUmiop"
          >
            {{ button.submit.text }}
          </ElButton>
          <ElButton
            class="lot-form__submit-button-close"
            @click="clickClose"
            :disabled="isUmiop"
          >
            {{ button.close.text }}
          </ElButton>
        </div>
      </div>

      <ConfirmModal
        v-model="confirmModal.isVisible"
        v-bind="confirmModal.text"
        @handleAction="handleConfirmAction"
        ref="confirmModal"
      />
    </ElForm>
  </aside>
</template>

<script>
import TimerIcon from '@/components/components-helpers/TimerIcon';
import CalendarIcon from '@/components/components-helpers/CalendarIcon';
import axios from '@/utils/axios';
import CalendarLotFormAddRegions from '@/components/views/trading-session/calendar/CalendarLotFormAddRegions';
import { mapState } from 'vuex';
import { ElDatePicker } from 'element-plus';
import IconClose from '@/components/components-helpers/IconClose.vue';
import TimeRangeSelect from '@/components/components-helpers/TimeRangeSelect.vue';
import ConfirmModal from '@/components/components-helpers/ConfirmModal.vue';
import { mapState as mapStatePinia } from 'pinia';
import { useUserStore } from '@/stores/user';

const CONFIRM_MODAL_TEXT = {
  save: {
    title: 'Сохранение изменений',
    message: 'Сохранить изменения в лоте?',
    confirmButtonText: 'Сохранить',
    cancelButtonText: 'Отменить',
  },
  delete: {
    title: 'Удаление лота',
    message: 'Лот будет удален без возможности восстановления',
    confirmButtonText: 'Удалить',
    cancelButtonText: 'Отменить',
  },
  close: {
    title: 'Уверены, что хотите закрыть?',
    message: 'Все внесенные изменения будут потеряны',
    confirmButtonText: 'Закрыть лот',
    cancelButtonText: 'Продолжить редактирование',
  },
};

function checkWeightValidator(rule, value, callback) {
  if (!value) {
    return callback(new Error('Укажите объем'));
  } else {
    callback();
  }
}

function checkTimeEndValidator(rule, value, callback) {
  const [lotStartDate, lotEndDate] = value;

  if (!(lotStartDate & lotEndDate)) {
    return callback(new Error('Выберите время'));
  }

  const selectedDateStart = new Date(this.ruleForm.dateStart);
  const dateStartWithoutTime = new Date(
    selectedDateStart.getFullYear(),
    selectedDateStart.getMonth(),
    selectedDateStart.getDate()
  );
  const isStartDateToday =
    this.isToday.toLocaleDateString() ===
    dateStartWithoutTime.toLocaleDateString();

  const currentDate = new Date();
  currentDate.setSeconds(0, 0);

  const lotStartTime = new Date(lotStartDate);
  const lotEndTime = new Date(lotEndDate);

  if (!isStartDateToday) {
    // нет проверки на конкретный день даты, т.к. добавление времени в запрос на edit и add делается в другом месте.
    // поэтому достаточно сбросить время на 00:00.
    currentDate.setTime(this.isToday);
  }

  const isEndTimeMoreThanStartTime =
    lotEndTime.getTime() < lotStartTime.getTime();
  if (isEndTimeMoreThanStartTime)
    return callback(
      new Error('Время окончания не может быть раньше времени начала')
    );

  if (
    currentDate.getTime() > lotStartTime.getTime() ||
    currentDate.getTime() > lotEndTime.getTime()
  ) {
    callback(
      new Error(
        'Время начала и окончания не может быть раньше текущего времени'
      )
    );
  } else {
    callback();
  }
}

function checkFirstRegionSelected(rule, value, callback) {
  const isAnyRegionSelected = value?.some(
    (region) => region?.regionIds?.length
  );

  if (!isAnyRegionSelected) {
    return callback(new Error('Выберите регион'));
  } else {
    callback();
  }
}

export default {
  name: 'CalendarLotForm',
  emits: ['onSelectRegions', 'onChangeRegions'],

  props: {
    isCalendarLotFormOpen: Boolean,
  },

  data: (ctx) => ({
    resetFormKey: 1,

    confirmModal: {
      isVisible: false,
      text: { ...CONFIRM_MODAL_TEXT.delete },
      confirmCb: null,
      declineCb: null,
    },

    regionListResponse: [],
    button: {
      submit: {
        text: 'Создать',
      },
      close: {
        text: 'Отменить',
        code: 'close',
      },
    },
    factoryList: {},
    productsList: [],
    id: null,

    method: 'addLot',
    isRuleFormEdited: false,
    ruleForm: {
      dateStart: null,
      timeInterval: [],
      shippingDate: null,
      factoryId: '',
      productId: '',
      weight: 0,
      multiplicity: 0,
      isMumultiplicityDisabled: true,
      regions: [],
      minNomenclaturePrice: 0,
      comment: '',
    },
    rules: {
      dateStart: [
        {
          type: 'date',
          required: true,
          message: 'Выберите дату',
          trigger: 'submit',
        },
      ],
      timeInterval: [
        {
          validator: checkTimeEndValidator.bind(ctx),
          trigger: 'change',
        },
      ],
      shippingDate: [
        {
          type: 'date',
          required: true,
          message: 'Выберите дату',
          trigger: 'blur',
        },
      ],
      factoryId: [
        {
          required: true,
          message: 'Выберите базис отгрузки',
          trigger: 'change',
        },
      ],
      productId: [
        {
          required: true,
          message: 'Выберите номенклатуру',
          trigger: 'change',
        },
      ],
      weight: [
        {
          validator: checkWeightValidator,
          trigger: 'submit',
        },
      ],
      regions: [
        {
          required: true,
          validator: checkFirstRegionSelected,
          trigger: 'change',
        },
      ],
    },
  }),
  computed: {
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
    ...mapStatePinia(useUserStore, { userId: (state) => state.user?.userId }),

    ...mapState({
      lot: (state) => state.lot,
    }),

    customTimePrefix() {
      return TimerIcon;
    },
    customCalendarPrefix() {
      return CalendarIcon;
    },
    isDisable() {
      return this.$store.state.lot.isCalendarLotFormDisable;
    },
    isToday() {
      return new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      );
    },
    hourNow() {
      return new Date().getHours();
    },
    lotTitle() {
      const lotId = this.$store?.state?.lot?.lot?.id;
      if (lotId) return `Лот №${lotId}`;
      return 'Лот';
    },
  },
  mounted() {
    axios
      .post('rest/regions/getList/')
      .then((response) => {
        this.regionListResponse = [{ ID: 'all', NAME: 'Все регионы' }].concat(
          response.data
        );
      })
      .catch((error) => {
        console.log('getRegionsList error => ', error);
      })
      .finally(() => (this.loading = false));

    this.$store.subscribe((mutations) => {
      if (mutations.type === 'lot/lotFormEdit') {
        this.resetRuleForm({ isFormEdit: true });

        this.button.submit.text = 'Сохранить';
        this.button.close.text = 'Удалить';
        this.button.close.code = 'delete';
        this.clearEmptyItemValidate('ruleForm', 'productId');

        const dateStart = new Date(this.$store.state.lot.lot.dateStart);
        const timeInterval = [];
        timeInterval[0] = dateStart;
        timeInterval[1] = new Date(this.$store.state.lot.lot.dateEnd);
        let arShippingDate = [];
        arShippingDate = this.$store.state.lot.lot.shippingDate.split('.');
        const shippingDate = new Date(
          arShippingDate[2],
          arShippingDate[1] - 1,
          arShippingDate[0]
        );

        this.id = this.$store.state.lot.lot.id;
        this.method = 'editLot';

        // if(mutations.type === 'lot/setLotForm') {
        //   this.method = 'addLot'
        // }
        this.ruleForm.dateStart = dateStart;
        this.ruleForm.timeInterval = timeInterval;
        this.ruleForm.shippingDate = shippingDate;
        this.ruleForm.factoryId = this.$store.state.lot.lot.factory.id;
        this.ruleForm.productId = this.$store.state.lot.lot.product.id;
        this.ruleForm.weight = Number(this.$store.state.lot.lot.weight);
        this.ruleForm.multiplicity = Number(
          this.$store.state.lot.lot.multiplicity
        );
        this.ruleForm.regions = this.$store.state.lot.lot.regions; //todo: добавить массив регионов
        this.ruleForm.comment = this.$store.state.lot.lot.comment;
      }

      if (
        mutations.type === 'lot/lotFormClose' ||
        mutations.type === 'lot/lotFormSuccess'
      ) {
        this.resetRuleForm();
      }

      // mutations.type === 'lot/getListSuccess' вызывается при нажатии "продать товар", отслеживаем здесь и заполняем данные карточки создания из хранилища.
      if (
        mutations.type === 'lot/getListSuccess' &&
        this.$store.state.lot.isSaleButtonClicked
      ) {
        this.resetRuleForm({ isSaleButtonClicked: true });

        this.id = null;
        this.method = 'addLot';
        // let dateStart = new Date()
        // let timeInterval = []
        // timeInterval[0] = dateStart
        // timeInterval[1] = new Date(storeLot.dateEnd)
        let arShippingDate = [];
        arShippingDate = this.$store.state.lot.lot.shippingDate.split('.');
        const shippingDate = new Date(
          arShippingDate[2],
          arShippingDate[1] - 1,
          arShippingDate[0]
        );

        this.ruleForm.dateStart = new Date(this.$store.state.lot.lot.dateStart);
        this.ruleForm.timeInterval = [];
        this.ruleForm.shippingDate = shippingDate;
        this.ruleForm.factoryId = this.$store.state.lot.lot.factory.id;
        this.ruleForm.productId = this.$store.state.lot.lot.product.id;
        this.ruleForm.weight = Number(this.$store.state.lot.lot.weight);
        this.ruleForm.multiplicity = Number(
          this.$store.state.lot.lot.multiplicity
        );
        this.ruleForm.regions = this.$store.state.lot.lot.regions; //todo: добавить массив регионов
        this.ruleForm.comment = this.$store.state.lot.lot.comment;

        this.ruleForm.saleLotId = this.$store.state.lot.lot.id;
        this.$store.state.lot.lot.id = null;
      }

      if (mutations.type === 'lot/lotFormStart') {
        this.resetRuleForm();
        this.clearEmptyItemValidate('ruleForm', 'productId');
        this.ruleForm.dateStart = this.$store.state.lot.createLotDate;
      }
    });

    this.getFactoryListByUserId(this.userId);
  },

  unmounted() {
    this.$store.commit('lot/setIsSaleButtonClicked', { value: false });
  },

  methods: {
    resetRuleForm(options) {
      this.$store.commit('lot/setIsSaleButtonClicked', {
        value: options?.isSaleButtonClicked || false,
      });
      this.$refs?.ruleForm?.resetFields();

      if (options?.isFormEdit || options?.isSaleButtonClicked || false) {
        this.resetFormKey++;
      }

      this.id = null;
      this.method = 'addLot';
      this.ruleForm.dateStart = null;
      this.ruleForm.timeInterval = [];
      this.ruleForm.shippingDate = '';
      this.ruleForm.factoryId = '';
      this.ruleForm.productId = '';
      this.ruleForm.weight = 0;
      this.ruleForm.multiplicity = 1;
      this.ruleForm.regions = [];
      this.ruleForm.comment = '';
      this.ruleForm.saleLotId = '';

      this.button.submit.text = 'Создать';
      this.button.close.text = 'Отменить';
      this.button.close.code = 'close';

      this.$store.state.lot.isCalendarLotFormDisable = false;
    },
    // setWeight(weight) {
    //   if(weight % this.ruleForm.multiplicity === 0) {
    //     this.ruleForm.weight = weight
    //   } else {
    //     this.ruleForm.weight = this.ruleForm.weight - weight % this.ruleForm.multiplicity
    //   }
    // },

    onChangeRegions(data) {
      this.ruleForm.regions = data;
      this.setIsRuleFormEdited();
    },
    clearValidate(formName) {
      this.$refs[formName].clearValidate();
    },
    clearEmptyItemValidate(formName, itemName) {
      if (this.productsList) {
        itemName = { props: itemName };
        this.$refs[formName]?.clearValidate(itemName);
      }
    },
    setFactory(factoryId) {
      this.clearProductId();
      this.ruleForm.weight = 0;
      this.setMultiplicity(factoryId);

      this.setIsRuleFormEdited();
    },
    setMultiplicity(factoryId) {
      const arMultiplicity = this.factoryList
        .map((factory) => {
          if (factory.ID === factoryId) {
            return factory.MULTIPLICITY;
          }
        })
        .filter((element) => element !== undefined && element !== null);

      this.ruleForm.multiplicity = Number(...arMultiplicity)
        ? Number(...arMultiplicity)
        : 1;
    },
    clearProductId() {
      this.ruleForm.productId = '';
    },
    getFactoryListByUserId(id) {
      axios
        .post('rest/factory/getListByUserId/', { userId: id })
        .then((response) => {
          this.factoryList = response.data;
        })
        .catch((error) => {
          console.log('getFactoryListByUserId error => ', error);
          return {};
        })
        .finally(() => (this.loading = false));
    },
    getProductListByFactoryId(factoryId) {
      if (factoryId) {
        axios
          .post('rest/products/getByFactoryId/', { id: factoryId })
          .then((response) => {
            this.productsList = response.data.sort((a, b) =>
              a.SHORT_NAME.localeCompare(b.SHORT_NAME, 'ru', { numeric: true })
            );
            this.ruleForm.minNomenclaturePrice = this.productsList
              .map((p) => {
                if (p.ID === this.ruleForm.productId) {
                  return p.MIN_PRICE ? Number(p.MIN_PRICE) : 0;
                }
              })
              .filter((element) => element !== undefined);
          })
          .catch((error) => {
            console.log('getProductsList error => ', error);
            this.productsList = {};
          })
          .finally(() => {
            this.loading = false;
            // this.setIsRuleFormEdited()
          });
      }
    },
    addArrLot() {
      const arTimeStartAndEnd = [];
      let dateStart = '';
      let dateEnd = '';
      let shippingDate = '';
      let arRegions = [];

      if (this.ruleForm.timeInterval !== null) {
        this.ruleForm.timeInterval.forEach(function (date) {
          let min = date.getMinutes();
          min = ('0' + min).slice(-2);

          let hours = date.getHours();
          hours = ('0' + hours).slice(-2);

          arTimeStartAndEnd.push(hours + ':' + min + ':00');
        });
      }
      if (this.ruleForm.dateStart !== null) {
        dateStart =
          this.ruleForm.dateStart.toLocaleDateString('ru-RU') +
          ' ' +
          arTimeStartAndEnd[0];
        dateEnd =
          this.ruleForm.dateStart.toLocaleDateString('ru-RU') +
          ' ' +
          arTimeStartAndEnd[1];
      }
      if (this.ruleForm.shippingDate !== null) {
        shippingDate = this.ruleForm.shippingDate.toLocaleDateString('ru-RU');
      }

      arRegions = this.ruleForm.regions?.map((region) => {
        // для отправки приводим [{id: '3', name: 'Москва'}, {id: '4', name: 'Нижний новгород'] в [3, 4];
        const regionIds = region?.regionIds?.map((regionId) => {
          if (typeof regionId === 'string') return regionId;
          if (typeof regionId === 'object' && regionId?.id) return regionId.id;
          return regionId;
        });

        return {
          priceMin: region?.priceMin,
          regionIds: regionIds || region.regionIds,
        };
      });

      return {
        id: this.id,
        userId: this.userId,
        dateStart: dateStart,
        dateEnd: dateEnd,
        shippingDate: shippingDate,
        factoryId: this.ruleForm.factoryId,
        productId: this.ruleForm.productId,
        weight: Number(this.ruleForm.weight),
        multiplicity: Number(this.ruleForm.multiplicity),
        regions: arRegions,
        comment: this.ruleForm.comment,
        saleLotId: this.ruleForm.saleLotId,
      };
    },
    makeRange(start, end) {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    },
    disabledHours() {
      if (this.ruleForm.dateStart) {
        if (
          this.ruleForm.dateStart.toLocaleDateString() ===
          this.isToday.toLocaleDateString()
        ) {
          return this.makeRange(0, this.hourNow - 1);
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    disabledMinutes(hour) {
      if (hour === this.hourNow) {
        const minuteStart = new Date().getMinutes() - 1;
        return this.makeRange(0, minuteStart);
      }
    },
    disabledDate(day) {
      return (
        day.getTime() < this.isToday.getTime() &&
        day.getTime() !== this.isToday.getTime()
      );
    },
    disabledShippingDate(day) {
      if (this.ruleForm.dateStart) {
        return (
          day.getTime() < this.ruleForm.dateStart.getTime() &&
          day.getTime() !== this.ruleForm.dateStart.getTime()
        );
      } else {
        return (
          day.getTime() < this.isToday.getTime() &&
          day.getTime() !== this.isToday.getTime()
        );
      }
    },
    disabledWeight(factoryId) {
      if (factoryId) {
        return false;
      }

      return true;
    },

    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.state.lot.isCalendarLotFormDisable = true;

          const submitCallback = () => {
            this.handleSubmit();
            this.$store.state.lot.isCalendarLotFormDisable = false;
            this.closeForm();
          };

          if (this.button.submit.text === 'Создать') return submitCallback();

          if (!this.isRuleFormEdited) return submitCallback();

          this.confirmModal = {
            isVisible: true,
            text: { ...CONFIRM_MODAL_TEXT.save },
            confirmCb: () => {
              submitCallback();
            },
            declineCb: () => {
              this.$store.state.lot.isCalendarLotFormDisable = false;
            },
          };
        } else {
          console.log('CalendarLotForm validate error ');
          return false;
        }
      });
    },

    handleSubmit() {
      if (this.method === 'addLot') {
        this.$store.dispatch('lot/add', this.addArrLot());
      } else if (this.method === 'editLot') {
        this.$store.dispatch('lot/edit', this.addArrLot());
      }
    },

    clickClose() {
      if (this.button.close.code === 'delete') {
        return this.deleteLot();
        // this.closeForm()
      }

      if (this.isRuleFormEdited && this.button.close.code === 'close') {
        return (this.confirmModal = {
          isVisible: true,
          text: { ...CONFIRM_MODAL_TEXT.close },
          confirmCb: () => {
            this.closeForm();
          },
        });
      }

      this.closeForm();
    },

    deleteLot() {
      this.confirmModal = {
        isVisible: true,
        text: { ...CONFIRM_MODAL_TEXT.delete },
        confirmCb: () => {
          this.$store.dispatch('lot/delete', { id: this.id });
          this.closeForm();
        },
      };
    },
    closeForm() {
      this.resetFormKey++;
      this.$store.commit('lot/lotFormClose');
      this.clearValidate('ruleForm');

      this.setIsRuleFormEdited(false);
    },

    /**
     * @param {'confirm' | 'decline'} action
     */
    handleConfirmAction(action) {
      if (action === 'confirm' && this.confirmModal.confirmCb) {
        return this.confirmModal.confirmCb();
      }

      if (action === 'decline' && this.confirmModal.declineCb) {
        return this.confirmModal.declineCb();
      }

      // ElMessage({ type: 'info', message: 'Действие отменено' });
    },

    closeFormWithConfirm() {
      if (this.isRuleFormEdited) {
        return (this.confirmModal = {
          isVisible: true,
          text: { ...CONFIRM_MODAL_TEXT.close },
          confirmCb: () => {
            this.closeForm();
          },
        });
      }

      this.closeForm();
    },

    setIsRuleFormEdited(isEdited = true) {
      this.isRuleFormEdited = Boolean(isEdited);
    },
  },
  components: {
    CalendarLotFormAddRegions,
    ElDatePicker,
    IconClose,
    TimeRangeSelect,
    ConfirmModal,
  },
};
</script>

<style scoped></style>
