<template>
  <div>
    <fy-table
      :data="options1.data"
      :options.sync="options1.options"
      :columns.sync="options1.columns"
      :sortOptions.sync="options1.sortOptions"
      :paginationOptions.sync="options1.paginationOptions"
      @cell:click="onCellClick"
      @cell:hover="onCellHover"
      @row:click="onRowClick"
      @row:hover="onRowHover"
      @row:select="onRowSelect"
      @pagination:change="onPaginationChange"
      @sort:change="onSortChange"
      @columns:visible-change="onColumnsVisibleChange"
    />

    <fy-table
      :data="options2.data"
      :columns.sync="options2.columns"
      :sortOptions.sync="options2.sortOptions"
      :paginationOptions.sync="options2.paginationOptions"
      @cell:click="onCellClick"
      @cell:hover="onCellHover"
      @row:click="onRowClick"
      @row:hover="onRowHover"
      @row:select="onRowSelect"
      @pagination:change="onPaginationChange"
      @sort:change="onSortChange"
      @columns:visible-change="onColumnsVisibleChange"
    >
      <fy-table-column slot="name" :slot-scope="scope">
        {{ scope.record.name }}
      </fy-table-column>
      <fy-table-column slot="header__name">
        Name!!!
      </fy-table-column>
    </fy-table>
  </div>
</template>

<script lang="ts">
import { FyTable } from '../src/table'
import { defineComponent } from '@vue/composition-api'
import { SORT_TYPE, SELECT_TYPE } from 'src/table/types copy';
import { ITableData } from 'src/table/types';

export default defineComponent({
  name: 'App',
  components: {
    FyTable
  },
  data() {
    return {
      tableOptions1: {
        data: [
          { name: 'xxx', account: 'xxx' },
          { name: 'yyy', account: 'yyy' },
          { name: 'zzz', account: 'zzz' }
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
          limit: 10,
          page: 1
        },
        options: {
          selectType: SELECT_TYPE.MULTI
        }
      },
      tableOptions2: {
        data: [
          { name: 'xxx', account: 'xxx' },
          { name: 'yyy', account: 'yyy' },
          { name: 'zzz', account: 'zzz' }
        ],
        columns: [
          { header: 'Name', dataIndex: 'name', visible: true },
          { header: 'Account', dataIndex: 'account', visible: true, sortable: true }
        ],
        sortOptions: {
          sortKey: '',
          sortType: SORT_TYPE.NONE,
          remote: true
        },
        paginationOptions: {
          limit: 10,
          page: 1,
          total: 15,
          remote: true
        },
        options: {
          selectType: SELECT_TYPE.MULTI,
          selectRenderFn: (record: ITableData) => record.account === 'xxx' ? '-' : undefined
        }
      },
    };
  },
  methods: {
    onCellClick() {},
    onCellHover() {},
    onRowClick() {},
    onRowHover() {},
    onRowSelect() {},
    onPaginationChange() {},
    onSortChange() {},
    onColumnsVisibleChange() {}
  },
  mounted() {
  }
})
</script>
