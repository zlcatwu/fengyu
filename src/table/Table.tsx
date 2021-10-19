/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent } from '@vue/composition-api'
import { ITableData, SORT_TYPE, tableProps } from './types'
import TableRow from './TableRow';
import Pagination from './Pagination';

export default defineComponent({
  name: 'FyTable',
  props: tableProps,
  setup(props, { emit }) {
    const columns = computed(() => props.options.columns || []);
    const limit = computed(() => props.options.pagination?.limit || 10);
    const page = computed(() => props.value.page || 1);
    const sortKey = computed(() => props.value.sortKey || '');
    const sortType = computed(() => props.value.sortType || SORT_TYPE.NONE);
    const displayData = computed(() => {
      let data = [...(props.value.data || [])];

      // sort
      const sortFnMap = {
        [SORT_TYPE.NONE]: null,
        [SORT_TYPE.ASC]: (colA: ITableData, colB: ITableData) => colA[sortKey.value] > colB[sortKey.value] ? 1 : -1,
        [SORT_TYPE.DESC]: (colA: ITableData, colB: ITableData) => colA[sortKey.value] < colB[sortKey.value] ? 1 : -1,
      };
      const sortFn = sortFnMap[sortType.value];
      typeof sortFn === 'function' && data.sort(sortFn);

      // pagination
      if (props.options.pagination?.enable) {
        data = data.slice((page.value - 1) * limit.value, page.value * limit.value);
      }

      return data;
    });

    const nextSortTypeMap = {
      [SORT_TYPE.NONE]: SORT_TYPE.ASC,
      [SORT_TYPE.ASC]: SORT_TYPE.DESC,
      [SORT_TYPE.DESC]: SORT_TYPE.NONE
    };

    // handler
    const onUpdateSortKey = (key: string) => {
      emit('input', {
        ...props.value,
        sortKey: key,
        sortType: nextSortTypeMap[key === sortKey.value ? sortType.value : SORT_TYPE.NONE]
      });
    };
    const onUpdatePage = (page: number) => {
      emit('input', {
        ...props.value,
        page
      });
    };
    return {
      columns,
      limit,
      page,
      sortKey,
      sortType,
      displayData,
      onUpdatePage,
      onUpdateSortKey
    };
  },
  render() {
    return <div class="fy-table__wrapper">
      <table class="fy-table">
        <TableRow
          isHead={true}
          sortType={this.sortType}
          sortKey={this.sortKey}
          on={{
            'update:sortKey': this.onUpdateSortKey
          }}
          columns={this.columns.map(col => ({
            content: col.header,
            sortable: col.sortable,
            dataIndex: col.dataIndex
          }))}
          ></TableRow>
        {this.displayData.map(item =>
          <TableRow columns={this.columns.map(col => ({
            content: item[col.dataIndex],
            dataIndex: col.dataIndex
          }))} />)}
      </table>
      {this.options.pagination?.enable && <Pagination
        page={this.page}
        limit={this.limit}
        total={this.value.data?.length}
        on={{
          'update:page': this.onUpdatePage
        }}
      />}
    </div>
  }
})
