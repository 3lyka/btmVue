<script setup lang="ts">
import { ElTable } from 'element-plus';

defineProps<{
  elTableProps: Partial<InstanceType<typeof ElTable>['$props']>;
  showCustomHeader?: boolean;
}>();
</script>

<template>
  <div class="base-table">
    <div class="base-table__header">
      <div class="base-table__header-left">
        <slot name="headerLeft" />
      </div>

      <div class="base-table__header-middle">
        <slot name="headerMiddle" />
      </div>

      <div class="base-table__header-right">
        <slot name="headerRight" />
      </div>
    </div>

    <ElTable class="base-table__table" v-bind="elTableProps">
      <template #default><slot name="default" /></template>
      <template #append><slot name="append" /></template>
      <template #empty><slot name="empty" /></template>
    </ElTable>
  </div>
</template>

<style lang="scss">
// todo: small refactoring
.base-table {
  &__header {
    margin: 0 16px 16px;
    display: flex;
  }

  &__header-left {
    margin-right: 24px;
  }

  &__header-middle {
    flex-grow: 1;
  }

  &__header-right {
    margin-left: 24px;
  }

  .el-table {
    --el-table-border-color: #d7e2f2 !important;
    --el-table-header-text-color: #8c99b2 !important;
    --el-table-text-color: #303549 !important;

    font-size: 13px !important;

    thead {
      height: 40px;
    }

    &__row {
      position: relative;
    }

    .el-table__cell {
      font-weight: normal;
      padding: 4px 0 !important;
      z-index: 0 !important;

      &--active {
        background-color: #f5f8fd;
      }
    }

    .cell {
      word-break: break-word;
      line-height: 16px;
    }

    .el-table__body {
      .cell {
        padding: 0 14px;
      }

      .el-table__total {
        .el-table__cell {
          position: relative;
          background-color: #f5f8fd;
        }

        &:not(:first-of-type) {
          .el-table__cell {
            &:before {
              content: '';
              display: flex;
              width: 100%;
              height: 2px;
              position: absolute;
              top: 0;
              left: 0;
              background: #c4d3e9;
            }
          }
        }
      }

      // .el-button + .el-button {
      //   margin-left: 30px;
      // }
    }

    &:not(.el-table--border) {
      .el-table__header,
      .el-table__body {
        .el-table__cell {
          padding: 12px 0 !important;

          &:first-of-type {
            .cell {
              padding-left: 25px;
            }
          }
        }
      }
    }

    &--border {
      .el-table__body {
        .el-table__row:first-of-type {
          .el-table__cell {
            &:before {
              content: '';
              display: flex;
              width: 100%;
              height: 1px;
              position: absolute;
              top: -1px;
              left: 0;
              box-shadow: 0px 0 6px #8c99b2;
            }
          }
        }
      }
    }

    &__row {
      @for $i from 0 through 2 {
        &--level-#{$i} {
          background-color: #f5f8fd !important;
        }
      }

      @for $i from 0 through 1 {
        &--level-#{$i} {
          .el-table__cell .cell {
            font-weight: bold;
          }
        }
      }
    }

    &.has-footer
      .el-table__inner-wrapper
      .el-table__row:last-of-type
      .el-table__cell {
      &:after {
        content: '';
        display: flex;
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
        box-shadow: 0px 0 6px #8c99b2;
      }
    }

    &__footer {
      height: 40px;

      .el-table__cell {
        --el-table-row-hover-bg-color: #ffffff;
        font-weight: bold;
      }
    }
  }
}
</style>
