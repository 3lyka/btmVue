<template>
  <div class="regions__item">
    <ElFormItem prop="regions">
      <ElSelect
        class="regions__select"
        ref="regionsSelect"
        v-model="regionIds"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="Введите данные..."
        v-on:change="onSelectRegion"
        size="default"
        :disabled="isUmiop"
      >
        <ElOption
          v-for="region in regionList"
          :disabled="!isAvailableRegion(region)"
          :key="region.ID"
          :label="region.NAME"
          :value="region.ID"
        />
      </ElSelect>
    </ElFormItem>
    <!-- class="regions__price" :disabled="isUmiop" -->
    <ElInput
      class="regions__price"
      v-model="priceMin"
      :min="minNomenclaturePrice"
      @input="noText"
      v-on:change="onSelectRegion"
      disabled
      :maxLength="6"
    >
      <template #suffix>
        <RubleIcon class="regions__price-icon" />
      </template>
    </ElInput>
    <ElButton
      class="regions__remove-button"
      text
      title="Удалить строку"
      @click="handleRemoveItem"
      :disabled="isUmiop"
    >
      <CloseIcon class="regions__remove-button-icon" />
    </ElButton>
  </div>
</template>

<script>
import RubleIcon from '@/components/components-helpers/RubleIcon.vue';
import CloseIcon from '@/components/components-helpers/icons/CloseIcon.vue';
import { useUserStore } from '@/stores/user';
import { mapState as mapStatePinia } from 'pinia';

export default {
  name: 'CalendarLotFormAddRegionsItem',
  props: [
    'index',
    'availableRegions',
    'regionList',
    'minNomenclaturePrice',
    'region',
  ],
  data: () => ({
    previousRegionIds: [],
    regionIds: [],
    priceMin: null,
  }),
  watch: {
    region: {
      handler() {
        if (this.regionIds.length || this.priceMin) return;

        this.regionIds = this.region.regionIds;
        this.priceMin = this.region.priceMin;
      },
      immediate: true,
      deep: true,
    },
    /** После выбора региона, если фильтровали с клавиатуры, сбрасываем напечатанный текст и показываем весь список */
    async regionIds() {
      const regionsSelectRef = this.$refs.regionsSelect;
      if (regionsSelectRef && regionsSelectRef.query) {
        regionsSelectRef.query = '';
        await regionsSelectRef.toggleMenu();
        await regionsSelectRef.toggleMenu();
      }
    },
  },
  computed: {
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
    customMinPricePrefix() {
      return RubleIcon;
    },
  },
  emits: ['onChangeRegions', 'removeItem'],
  methods: {
    onSelectRegion() {
      const selectedRegions = this.regionIds.filter(
        (id) => !this.previousRegionIds.includes(id)
      );
      const removedRegions = this.previousRegionIds.filter(
        (id) => !this.regionIds.includes(id)
      );
      const data = {
        index: this.index,
        priceMin: this.priceMin,
        regionIds: this.regionIds,
      };

      this.$emit('onChangeRegions', selectedRegions, removedRegions, data);

      this.previousRegionIds = [...this.regionIds];
    },
    noText() {
      this.priceMin = this.priceMin.replace(/^0/g, '');
      this.priceMin = this.priceMin.replace(/[^0-9]/g, '');
    },
    isAvailableRegion(region) {
      // если регион в текущей строке выбора региона уже выбран, позволяем его удалить.
      if (this.regionIds?.some((r) => r === region.ID)) return true;

      // не даем выбрать уже выбранные регионы.
      return this.availableRegions?.some((r) => r.ID === region.ID);
    },
    handleRemoveItem() {
      this.regionIds = [];
      this.priceMin = null;
      this.onSelectRegion();
      this.$emit('removeItem', this.index);
    },
  },
  components: { RubleIcon, CloseIcon },
};
</script>

<style scoped></style>
