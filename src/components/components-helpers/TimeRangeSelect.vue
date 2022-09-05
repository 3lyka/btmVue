<script lang="ts" setup>
import { add0ToNumber } from '@/utils/helpers/add0ToNumber';
import { replaceChar } from '@/utils/helpers/replaceChar';
import { computed, ref } from 'vue';

type DateFormat = string | Date;
type TimeInterval = [dateStart: DateFormat, dateEnd: DateFormat];

const props = defineProps<{
  modelValue: TimeInterval;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: TimeInterval): void;
  (e: 'change', value: TimeInterval): void;
}>();

// ElSelect refs
const timeRangeDateStartRef = ref();
const timeRangeDateEndRef = ref();

// При активном одном select выделяем второй.
const isPickerFocused = ref(false);

// Получаем данные от родителя и конвертируем в формат который принимает ElTimeSelect (Date | String -> HH:MM)
function convertDateToHHMM(dateData: DateFormat) {
  const date = new Date(dateData);
  const hours = add0ToNumber(date.getHours());
  const min = add0ToNumber(date.getMinutes());

  return hours && min ? `${hours}:${min}` : '';
}

// Конвертируем формат времени полученный от ElTimeSelect в Date, для корректного взаимодействия с parent.
function convertHHMMToDate(timeHHMM: string) {
  const [hours, min] = timeHHMM.split(':').map((value) => Number(value));
  const date = new Date();
  date.setHours(hours, min);

  return date;
}

// Не изменяем props, а делаем через emit.
function handleModelEmit(timeInterval: TimeInterval) {
  emit('update:modelValue', timeInterval);
  emit('change', timeInterval);
}

// onEnter workaround
const dateStartPrev = ref('00:00');
const dateEndPrev = ref('00:00');

const dateStart = computed({
  get: () => {
    if (!props.modelValue[0]) return '';
    return convertDateToHHMM(props.modelValue[0]);
  },
  set: (value: string) => {
    dateStartPrev.value = dateStart.value;
    handleModelEmit([convertHHMMToDate(value), props.modelValue[1]]);
  },
});

const dateEnd = computed({
  get: () => {
    if (!props.modelValue[1]) return '';
    return convertDateToHHMM(props.modelValue[1]);
  },
  set: (value: string) => {
    dateEndPrev.value = dateEnd.value;
    handleModelEmit([props.modelValue[0], convertHHMMToDate(value)]);
  },
});

function onType(e: Event, type: 'dateStart' | 'dateEnd') {
  // HH:MM 24-hour format, optional leading 0
  const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const innerInput = e.target as HTMLInputElement;
  const isValidTime = timeRegex.test(innerInput.value);
  const selectRef =
    type === 'dateStart'
      ? timeRangeDateStartRef.value.$refs.select
      : timeRangeDateEndRef.value.$refs.select;

  // не даем вводить больше, чем 5 символов.
  if (innerInput.value.length > 5) {
    innerInput.value = innerInput.value.substring(0, 5);
  }

  // при вводе автоматически подставляем ':', если не проставлен вручную пользователем.
  if (innerInput.value.length === 3 && innerInput.value[2] !== ':') {
    const lastChar = innerInput.value.slice(innerInput.value.length - 1);
    const queryWithСolon = replaceChar(innerInput.value, 2, ':') + lastChar;

    selectRef.query = queryWithСolon;
    selectRef.selectedLabel = queryWithСolon;
  }

  // если время валидно, автоматически проставляем введеное знаение в v-model.
  if (isValidTime && type === 'dateStart') {
    dateStart.value = innerInput.value;
  }

  if (isValidTime && type === 'dateEnd') {
    dateEnd.value = innerInput.value;
  }
}

function setIsFocused(e: FocusEvent, type: 'dateStart' | 'dateEnd') {
  if (e.type === 'focus') {
    return (isPickerFocused.value = true);
  }

  if (e.type === 'focusout') {
    isPickerFocused.value = false;

    const selectEl = e.relatedTarget as HTMLElement | null;
    const isOnSelect = selectEl?.classList.contains('el-popper');

    // убираем focus с inputs, для одинакового стиля рамок после выбора значение в списке.
    // с isOnSelect проверяем, что выбор был сделан в select, или будет эффект переключением focus между inputs, если нет значений в modelValue.
    setTimeout(() => {
      if (type === 'dateStart') {
        timeRangeDateStartRef.value.$refs.select.blur();

        if (isOnSelect && !props.modelValue[1]) {
          // автоматически устанавливаем focus на следующий select, если в нем не выбрана дата, открывая список времени
          timeRangeDateEndRef.value.$refs.select.focus();
        }
      }
      if (type === 'dateEnd') {
        timeRangeDateEndRef.value.$refs.select.blur();

        if (isOnSelect && !props.modelValue[0]) {
          timeRangeDateStartRef.value.$refs.select.focus();
        }
      }
    }, 100);
  }
}

// не скидываем введенное значение на enter.
// @keyup.enter вызывается позже onConfirm, проставляем предыдущие значение в v-model.
function onEnter(e: KeyboardEvent, type: 'dateStart' | 'dateEnd') {
  if (e.key !== 'Enter') return;

  if (type === 'dateStart') dateStart.value = dateStartPrev.value;
  if (type === 'dateEnd') dateEnd.value = dateEndPrev.value;
}
</script>

<template>
  <div
    class="time-range-select"
    :class="{ 'time-range-select_disabled': disabled }"
  >
    <ElTimeSelect
      class="time-range-select__picker time-range-select__picker_start"
      :class="{ 'time-range-select__picker_is-focused': isPickerFocused }"
      v-model="dateStart"
      ref="timeRangeDateStartRef"
      format="HH:mm"
      :clearable="false"
      :disabled="disabled"
      placeholder=" "
      start="00:00"
      step="00:15"
      end="23:55"
      @input="onType($event, 'dateStart')"
      @focus="setIsFocused($event, 'dateStart')"
      @focusout="setIsFocused($event, 'dateStart')"
      @keyup.enter="onEnter($event, 'dateStart')"
    />
    <ElTimeSelect
      class="time-range-select__picker time-range-select__picker_end"
      :class="{ 'time-range-select__picker_is-focused': isPickerFocused }"
      v-model="dateEnd"
      ref="timeRangeDateEndRef"
      format="HH:mm"
      prefix-icon="null"
      :clearable="false"
      :disabled="disabled"
      placeholder=" "
      start="00:00"
      step="00:15"
      end="23:55"
      @input="onType($event, 'dateEnd')"
      @focus="setIsFocused($event, 'dateEnd')"
      @focusout="setIsFocused($event, 'dateEnd')"
      @keyup.enter="onEnter($event, 'dateEnd')"
    />
  </div>
</template>

<style lang="scss">
.time-range-select {
  display: flex;
  position: relative;

  &::after {
    content: '';
    width: 3px;
    height: calc(100% - 2px);
    position: absolute;
    top: 1px;
    left: calc(50% - 4px);
    background: var(--c-off-white);
  }

  &::before {
    content: '';
    position: absolute;
    width: 7px;
    height: 1px;
    left: calc(50% - 2px);
    top: 50%;
    z-index: 1;
    background-color: #303549;
  }

  &_disabled::after {
    background: var(--el-disabled-bg-color);
  }

  &__picker {
    .el-input__suffix {
      display: none;
    }

    &_start .el-input__wrapper {
      padding-right: 0;
      border-bottom-right-radius: unset;
      border-top-right-radius: unset;
      border-right: unset;
    }

    &_end .el-input__wrapper {
      padding-left: 14px;
      border-top-left-radius: unset;
      border-bottom-left-radius: unset;
    }

    &_end .el-input__prefix {
      display: none;
    }

    &_is-focused .el-input__wrapper {
      box-shadow: 0 0 0 1px var(--el-select-input-focus-border-color) inset !important;
    }
  }
}
</style>
