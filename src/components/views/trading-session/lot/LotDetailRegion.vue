<template>
  <div class="lot-detail__info-regions">
    <div v-if="regions" class="lot-detail__info-title-region">Регион</div>
    <template v-for="(region, index) in regions" :key="index">
      <template v-for="regionItem in region.regionIds" :key="regionItem.id">
        <div class="lot-detail__info-region">
          {{ regionItem.name }}
          <span class="lot-detail__info-region-price" v-if="region.priceMin">
            от {{ prettify(region.priceMin) }} ₽</span
          >
          <!-- <span class="lot-detail__info-region-no-price" v-else>нет цены</span> -->
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { prettify } from '@/utils/helpers/prettify';

export default {
  name: 'LotDetailRegion',
  props: ['regions'],
  methods: {
    prettify,
  },
};
</script>

<style scoped></style>
