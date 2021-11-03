<template>
  <div>
    <fy-table
      :data="tableOptions1.data"
      :columns.sync="tableOptions1.columns"
      :sortOptions.sync="tableOptions1.sortOptions"
      :paginationOptions.sync="tableOptions1.paginationOptions"
      :selectOptions.sync="tableOptions1.selectOptions"
      @cell:click="onCellClick"
      @row:click="onRowClick"
      @pagination:change="onPaginationChange"
      @sort:change="onSortChange"
    >
      <div slot="header__name">
        NAME
      </div>

      <div slot="body__account" slot-scope="scope">
        {{ scope.data.name + ' ' + scope.data.account }}
      </div>

    </fy-table>
  </div>
</template>

<script lang="ts">
import { FyTable } from '../src/table'
import { defineComponent } from '@vue/composition-api'
import { ICellClickEvent, IRowClickEvent, SORT_TYPE } from '../src/table/types';

export default defineComponent({
  name: 'App',
  components: {
    FyTable
  },
  data() {
    return {
      tableOptions1: {
        data: [
          { name: 'name-1', account: 'account-1' },
          { name: 'name-2', account: 'account-2' },
          { name: 'name-3', account: 'account-3' },
          { name: 'name-4', account: 'account-4' }
        ],
        columns: [
          { header: 'Name', dataIndex: 'name', visible: true },
          { header: 'Account', dataIndex: 'account', visible: true, sortable: true }
        ],
        sortOptions: {
          sortKey: '',
          sortType: SORT_TYPE.NONE
        },
        paginationOptions: {
          enable: true,
          limit: 2,
          page: 1
        },
        // selectOptions: {
        //   selectType: SELECT_TYPE.MULTI,
        //   selected: [],
        //   idProperty: 'account',
        //   selectRenderFn: (record: ITableData, idx: number) => record.name === 'xxx' ? '-' : undefined,
        //   onBeforeSelect: (record: ITableData, idx: number) => {
        //     if (record.account === 'boss') {
        //       alert('how dare you');
        //       return false;
        //     }
        //     return true;
        //   }
        // }
      }
    };
  },
  methods: {
    onCellClick(data: ICellClickEvent) {
      console.log('cell:click', data);
    },
    onRowClick(data: IRowClickEvent) {
      console.log('row:click', data);
    },
    onPaginationChange() {},
    onSortChange() {}
  },
  mounted() {
  }
})
</script>
