<script lang="ts" setup>
import { ElTree } from 'element-plus';
import { nextTick, ref, watch } from 'vue';
import OperationIcon from './icons/OperationIcon.vue';
import SearchIcon from './icons/SearchIcon.vue';
import DragAndDropIcon from './icons/DragAndDropIcon.vue';
import { DropType } from 'element-plus/es/components/tree/src/tree.type';
import type Node from 'element-plus/es/components/tree/src/model/node';
import DialogCloseIcon from './icons/DialogCloseIcon.vue';

type Column = { id: number; label: string; show: boolean };

const props = defineProps<{
  columns: Column[];
}>();

const emit = defineEmits<{
  (event: 'handleSave', columns: Column[]): void;
}>();

const isTableSettingsDialog = ref(false);

// Данные колонок из такой переменной, т.к. ElTree мутирует props.
const data = ref<Column[]>([...props.columns]);

// Содержит methods и inner state
const treeRef = ref<InstanceType<typeof ElTree>>();

// --- Поиск start ---
const filterText = ref('');

watch(filterText, (newVal) => {
  treeRef.value?.filter(newVal);
});

function filterColumns(value: string, data: Column) {
  if (!value) return true;
  return data.label
    .toLocaleLowerCase()
    .includes(value.trim().toLocaleLowerCase());
}
// --- Поиск end ---

// --- dragAndDrop start ---
/** Запрещает drop внутрь\на node */
function allowDrop(draggingNode: Node, dropNode: Node, type: DropType) {
  return type !== 'inner';
}

/** @todo: keep a node checked on drop */
function handleDrop(
  draggingNode: Node,
  dropNode: Node,
  dropType: DropType,
  event: DragEvent
) {
  console.log(draggingNode, dropNode, dropType, event);
}
// --- dragAndDrop end ---

function setCheckedColumns() {
  const checkedColumns = props.columns.filter((column) => column.show);
  treeRef.value?.setCheckedNodes(checkedColumns as unknown as Node[], false);
}

/** Возращает Column[] с проставленными show значениями, в зависимости, если node был checked в treeRef. Для передачи в родителя при сохранении.   */
function getCheckedColumns(): Column[] {
  const checkedNodes = treeRef.value?.getCheckedNodes(false) as
    | Column[]
    | undefined;

  const columnsChecked = data.value.map((column) => {
    const checkedNode = checkedNodes?.find((node) => node.id === column.id);

    if (checkedNode) return { ...column, show: true };

    return { ...column, show: false };
  });

  return columnsChecked;
}

function handleSave() {
  const checkedColumns = getCheckedColumns();

  emit('handleSave', checkedColumns);
  isTableSettingsDialog.value = false;
}

function handleDialogOpened() {
  data.value = [...props.columns]; // Проставляет верный порядок с props во внутренний state. Для случая закрытия без сохранения (синхронизирует с props).

  nextTick(() => {
    setCheckedColumns();
  });
}
</script>

<template>
  <div class="base-table-settings">
    <ElButton
      class="base-table-settings__open-button"
      type="info"
      @click="isTableSettingsDialog = true"
    >
      <OperationIcon class="base-table-settings__open-icon" />
      Настройка таблицы
    </ElButton>

    <ElDialog
      customClass="base-table-settings__dialog"
      v-model="isTableSettingsDialog"
      draggable
      :showClose="false"
      @opened="handleDialogOpened"
    >
      <template #header="{ close }">
        <div class="base-table-settings__header">
          <h4 class="base-table-settings__header-title">Настройка таблицы</h4>
          <ElButton
            class="base-table-settings__header-close"
            text
            @click="close"
          >
            <DialogCloseIcon />
          </ElButton>
        </div>
      </template>

      <div class="base-table-settings__search">
        <ElInput
          class="base-table-settings__search-input"
          v-model="filterText"
          placeholder="Поиск..."
          :prefixIcon="SearchIcon"
        />
      </div>

      <div class="base-table-settings__body">
        <ElScrollbar>
          <ElTree
            class="base-table-settings__tree"
            ref="treeRef"
            :data="data"
            nodeKey="id"
            draggable
            showCheckbox
            :icon="DragAndDropIcon"
            :filterNodeMethod="(value: string, data: Column) => filterColumns(value, data)"
            :allow-drop="allowDrop"
            @nodeDrop="handleDrop"
          />
        </ElScrollbar>
      </div>

      <template #footer>
        <div class="base-table-settings__footer">
          <ElButton
            class="base-table-settings__save-button"
            type="primary"
            @click="handleSave"
          >
            Применить
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss">
.base-table-settings {
  &__open-icon {
    margin-right: 8px;
  }

  &__dialog {
    max-width: 400px;
    max-height: 784px;
  }

  &__dialog .el-dialog__header {
    padding: 0;
    margin: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: var(--c-off-white);
    padding: 4px 0 4px 10px;
  }

  &__header-title {
    color: var(--c-grey);
    font-weight: 400;
    font-size: 15px;

    margin: 0;
  }

  &__header-close {
    padding: 9px;
  }

  &__search {
    padding: 16px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--c-white-2);
  }

  &__search-input .el-input__icon {
    margin-right: 12px;
    margin-left: -3px !important;
    font-size: 16px;
  }

  &__dialog .el-dialog__body {
    padding-top: 0;
    padding-right: 0;
    padding-left: 0;
  }

  &__body {
    padding-left: 16px;
    padding-right: 5px;
  }

  &__tree .el-tree-node {
    margin-bottom: 8px;

    border: 1px solid var(--c-white-2);
    border-radius: 4px;
  }

  &__tree .el-tree-node__content {
    height: 30px;
  }

  &__tree .el-tree-node__expand-icon {
    margin-right: 13px;
    font-size: 16px;
  }

  &__dialog .el-dialog__footer {
    box-shadow: 0px -4px 8px rgba(140, 153, 178, 0.25);
    padding-top: 16px;
    padding-bottom: 24px;
  }

  &__footer {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__save-button {
    padding: 8px 61px;
  }
}
</style>
