<template>
  <div class="regions">
    <div class="regions__title">
      <div class="regions__title-item">
        <h4 class="lot-form__item-box-subtitle">Регион</h4>
      </div>
      <div class="regions__title-item">
        <h4 class="lot-form__item-box-subtitle">
          Минимальная цена за тонну (без доставки)
        </h4>
      </div>
    </div>
    <CalendarLotFormAddRegionsItem
      v-for="(regionItem, index) in arRegions"
      :key="index"
      :index="index"
      :region="regionItem"
      :availableRegions="availableRegions"
      :regionList="regionListResponse"
      :minNomenclaturePrice="minNomenclaturePrice"
      @onChangeRegions="onChangeRegions"
      @removeItem="removeItem"
    />
    <div v-if="!isUmiop" class="lot-form__item-box">
      <div class="region-add">
        <ElButton
          @click="addItem"
          class="region-add__button"
          :disabled="isAddItemDisabled"
          type="primary"
          text
        >
          Добавить регион
          <PlusIcon class="region-add__button-icon" />
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarLotFormAddRegionsItem from '@/components/views/trading-session/calendar/CalendarLotFormAddRegionsItem';
import PlusIcon from '@/components/components-helpers/icons/PlusIcon.vue';
import { useUserStore } from '@/stores/user';
import { mapState as mapStatePinia } from 'pinia';

export default {
  name: 'CalendarLotFormAddRegions',
  props: ['regionListResponse', 'minNomenclaturePrice', 'currentRegions'],
  emits: ['onSelectRegions', 'onChangeRegions'],
  data: () => ({
    arRegionsItem: [{}],
    selectedRegions: [],
    arRegions: [],
  }),
  watch: {
    currentRegions: {
      handler(newRegions) {
        if (this.arRegions.length) return;

        const regions = newRegions?.map((region) => {
          if (!region?.regionIds)
            return { ...region, priceMin: region.priceMin };

          // приводим regionIds к формату который принимает ElSelect (string[])
          return {
            priceMin: region.priceMin,
            regionIds: region.regionIds.map((value) => value?.id),
          };
        });

        // убираем регионы у которых не выбраны регионы
        this.arRegions = regions?.filter((region) => region?.regionIds);

        if (!this.arRegions?.length) {
          this.arRegions = [{}];
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
    availableRegions() {
      // создаем array с ids ["1", "4", "3"]
      const selectedRegionsAll = this.arRegions
        .map((region) => region?.regionIds)
        .flat();
      // убираем дубликаты и через фильтр убирает undefined
      const selectedRegions = [...new Set(selectedRegionsAll)].filter(
        (value) => value
      );

      const isAllRegionsSelected = selectedRegions.includes('all');

      if (isAllRegionsSelected) {
        // если выбраны все регионы, то новые регионы нельзя выбирать.
        return [];
      }

      if (selectedRegions.length) {
        // убираем из выбора 'Все регионы' и если один из регионов выбран, убраем его для последущего выбора.
        return this.regionListResponse.filter((region) => {
          if (region.ID === 'all') return false;
          if (!selectedRegions.includes(region.ID)) return true;
        });
      }

      return this.regionListResponse;
    },

    isAddItemDisabled() {
      // если уже выбраны все возможные регионы, то 'disabled'
      // или выбранные значения включают 'all', то 'disabled',
      // или не выбраны никакие значения то также 'disabled'.
      return (
        !this.availableRegions?.length ||
        this.arRegions?.some(
          (region) =>
            region?.regionIds?.includes('all') || !region?.regionIds?.length
        )
      );
    },
  },
  methods: {
    onChangeRegions(selectRegions, removedRegions, data) {
      const { index, ...rest } = data;
      this.arRegions[index] = rest;

      this.$emit('onChangeRegions', this.arRegions);
    },
    addItem() {
      this.arRegions.push({});
    },
    removeItem(itemIndex) {
      if (this.arRegions.length > 1) this.arRegions.splice(itemIndex, 1);
      else {
        this.arRegions = [{}];
      }
    },
  },
  components: { CalendarLotFormAddRegionsItem, PlusIcon },
};
</script>

<style scoped></style>
