<template>
  <div class="calendar__lot" :class="{ calendar__lot_active: isLotSelected }">
    <div class="calendar__lot-wrap" @click="openLot">
      <div class="calendar__lot-title">
        <div class="calendar__lot-title-wrapper">
          <p class="calendar__lot-title-id">№{{ prettify(lot.id) }}</p>
          <img class="calendar__lot-title-img" src="@/assets/img/oil.svg" />
        </div>
        <div class="calendar__lot-title-shipment">
          <div class="calendar__lot-title-shipment-text">Отгрузка</div>
          <div class="calendar__lot-title-shipment-date">
            {{ lot.shippingDate }}
          </div>
        </div>
      </div>
      <div class="calendar__lot-description">
        <div class="calendar__lot-description-name">
          {{ lot.factory.shortName }}
        </div>
        <div class="calendar__lot-description-mark">
          {{ lot.product.shortName }}
        </div>
        <div class="calendar__lot-description-create">Выставлено</div>
        <div class="calendar__lot-description-count-weight">
          {{ prettify(lot.weight) }} т
        </div>
        <div
          v-if="showDescriptionReceipt"
          class="calendar__lot-description-box"
        >
          <div class="calendar__lot-description-receipt">
            <div class="calendar__lot-description-receipt-title">
              {{ getReceipt.title }}
            </div>
            <div class="calendar__lot-description-receipt-count-weight">
              {{ prettify(getReceipt.weight) }} т
            </div>
          </div>
          <div class="calendar__lot-description-receipt">
            <div class="calendar__lot-description-receipt-title">
              Участников
            </div>
            <div class="calendar__lot-description-receipt-count">
              {{ lot.uniqueCountContactor }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="showLotSale" class="calendar__lot-sale">
        <div class="calendar__lot-sale-wrap">
          <div class="calendar__lot-sale-description">
            <div class="calendar__lot-sale-description-balance">Остаток</div>
            <div class="calendar__lot-sale-description-count-weight">
              {{ prettify(getReceipt.remainder) }} т
            </div>
          </div>
          <div class="calendar__lot-sale-button-wrap">
            <LotSaleButton :unsoldBalance="getReceipt.remainder" :lot="lot" />
          </div>
        </div>
      </div>
      <div class="calendar__lot-info">
        <div class="calendar__lot-info-title">Торги</div>
        <div class="calendar__lot-info-time">
          <LotTradingTime :dateStart="lot.dateStart" :dateEnd="lot.dateEnd" />
        </div>
        <LotStatus :typeStatus="'status'" :status="lot.status" />
      </div>
    </div>

    <!-- todo: переиспользовать для комментария. -->
    <div class="calendar__lot-info-regions">
      <div
        class="calendar__lot-info-title-region"
        :class="{ 'calendar__lot-info-title-region_active': !isRegionsHidden }"
        v-if="lot.regions"
        @click="isRegionsHidden = !isRegionsHidden"
      >
        Регион
        <ShowMoreArrowIcon class="calendar__lot-info-title-icon" />
      </div>

      <template v-if="!isRegionsHidden">
        <template v-for="(region, index) in lot.regions" :key="index">
          <div
            class="calendar__lot-info-region"
            v-for="regionItem in region.regionIds"
            :key="regionItem.id"
          >
            <span class="calendar__lot-info-region-name">
              {{ regionItem.name }}
            </span>
            <span
              class="calendar__lot-info-region-price"
              v-if="region.priceMin"
            >
              {{ prettify(region.priceMin) }} ₽
            </span>
            <!-- <span class="calendar__lot-info-region-price calendar__lot-info-region_no-price" v-else>
            нет цены
          </span> -->
          </div>
        </template>
      </template>
    </div>

    <div v-if="lot.comment" class="calendar__lot-comment">
      <div
        v-on:click="isHiddenComment = !isHiddenComment"
        class="calendar__lot-comment-item"
        :class="{ 'calendar__lot-comment-item_hidden': !isHiddenComment }"
      >
        Комментарий
      </div>
      <div v-if="isHiddenComment === false" class="calendar__lot-comment-box">
        {{ lot.comment }}
      </div>
    </div>
  </div>
</template>

<script>
import LotTradingTime from '@/components/views/trading-session/lot/LotTradingTime';
import LotStatus from '@/components/views/trading-session/lot/LotStatus';
import LotSaleButton from '@/components/views/trading-session/lot/LotSaleButton';
import ShowMoreArrowIcon from '@/components/components-helpers/icons/ShowMoreArrowIcon.vue';
import { useUserStore } from '@/stores/user';
import { mapState as mapStatePinia } from 'pinia';

export default {
  props: {
    lot: Object,
    isLotSelected: Boolean,
  },
  data: () => ({
    isHiddenComment: true,
    isRegionsHidden: true,
  }),
  computed: {
    ...mapStatePinia(useUserStore, ['isTrader', 'isUmiop']),
    showDescriptionReceipt() {
      if (this.lot.status.code === 'new') {
        return false;
      }

      return true;
    },
    showLotSale() {
      if (
        this.lot.status.code === 'completed' ||
        this.lot.status.code === 'cancelled'
      ) {
        return true;
      }

      return false;
    },
    getLotSaleWeight() {
      if (
        this.lot.status.code === 'completed' ||
        this.lot.status.code === 'cancelled'
      ) {
        return true;
      }

      return false;
    },
    getReceipt() {
      const res = {};
      res.title = 'Распределено';
      if (
        this.lot.status.code === 'completed' ||
        this.lot.status.code === 'cancelled'
      ) {
        res.title = 'Продано';
      }

      if (
        this.lot.status.code === 'receiving' ||
        this.lot.status.code === 'waiting'
      ) {
        res.weight = 0;
      } else if (this.lot.status.code === 'cancelled') {
        res.weight = 0; //todo уточнить
        res.remainder = this.lot.weight - this.lot.weightSale;
      } else if (this.lot.status.code === 'completed') {
        res.weight = this.lot.weightSale;
        res.remainder = this.lot.weight - this.lot.weightSale;
      } else {
        res.weight = this.lot.weightSale;
      }

      return res;
    },
  },
  methods: {
    prettify(str) {
      try {
        str = String(str);
        return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
      } catch (e) {
        console.error('Error in helpers prettify', e);
      }
    },
    isSaleButtonClicked() {
      return this.$store.state.lot.isSaleButtonClicked;
    },
    openLot: function () {
      if (this.lot.status.code === 'new') {
        this.$store.commit('lot/lotFormEdit', this.lot);
      } else if (!this.isSaleButtonClicked()) {
        this.$store.commit('lot/lotFormClose');
        this.$store.commit('lot/setLot', this.lot);
        this.$router.push('/arm_trading/lot/' + this.lot.id);
      }
    },
  },
  name: 'CalendarWeekLot',
  components: { LotStatus, LotTradingTime, LotSaleButton, ShowMoreArrowIcon },
};
</script>

<style scoped></style>
