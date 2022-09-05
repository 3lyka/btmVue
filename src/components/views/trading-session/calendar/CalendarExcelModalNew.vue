<template>
  <ElButton class="sub-header__el-button" @click="dialogVisible = true">
    <DocumentIcon class="sub-header__button-icon" />
    Выгрузить в Excel
  </ElButton>

  <ElDialog
    modal-class="calendar-excel-modal"
    v-model="dialogVisible"
    title="Выгрузка в Excel"
    width="237px"
    :close-on-click-modal="false"
  >
    <ElForm
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-position="top"
    >
      <ElFormItem label="Базис" prop="factoryId">
        <ElSelect class="basis__select" v-model="ruleForm.factoryId">
          <ElOption
            v-for="factory in factoryList"
            :key="factory.ID"
            :label="factory.SHORT_NAME || factory.NAME"
            :value="factory.ID"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="Период выгрузки" prop="dateRange">
        <ElDatePicker
          class="calendar-excel-modal__date-picker"
          v-model="ruleForm.dateRange"
          type="daterange"
          :clearable="false"
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          start-placeholder="__.__.____"
          end-placeholder="__.__.____"
        >
        </ElDatePicker>
      </ElFormItem>

      <ElFormItem>
        <ElButton
          class="calendar-excel-modal__button"
          type="primary"
          size="large"
          @click="submitForm('ruleForm')"
        >
          Выгрузить
        </ElButton>
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>

<script>
import DocumentIcon from '@/components/components-helpers/icons/DocumentIcon.vue';
import axios from '@/utils/axios';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'CalendarExcelModalNew',
  components: { DocumentIcon },
  props: {},
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        dateRange: '',
      },
      rules: {
        dateRange: [
          {
            required: true,
            message: 'Пожалуйста выберите дату',
            trigger: 'blur',
          },
        ],
      },
      factoryList: {},
    };
  },
  computed: {
    ...mapGetters('User', ['isTrader', 'isUmiop']),
    ...mapState({
      userId: (state) => state.User.id,
    }),
  },
  methods: {
    buildSendData() {
      return {
        lotId: '',
        datePeriodStart: this.ruleForm.dateRange[0],
        datePeriodEnd: this.ruleForm.dateRange[1],
        type: this.$router.name === 'Trading' ? 'offer' : 'lot',
        factoryId: this.ruleForm.factoryId,
      };
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.buildSendData());
        if (valid) {
          this.$router.push({
            name: 'ExportToExcel',
            query: this.buildSendData(),
          });
        } else {
          console.log('error submit!');
          return false;
        }
      });
    },
  },
  mounted() {
    this.getFactoryListByUserId(this.userId);
  },
};
</script>

<style lang="scss">
.calendar-excel-modal {
  &__date-picker {
    max-width: 100%;
  }

  &__button {
    margin-top: 24px;
    width: 100%;
  }
}
</style>
