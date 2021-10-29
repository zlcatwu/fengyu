/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent, computed } from '@vue/composition-api'
import {
  tableProps, Slots, IColumnOptions,
  ISortOptions, ITablePaginationOptions,
  ITableData, SORT_TYPE
} from './types'
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from '../pagination/Pagination';
import { DEBUG, TRACE } from '../utils';

export default defineComponent({
  name: 'FyTable',
  props: tableProps,
  setup(props, { emit, slots }) {
    const { headerColumns, bodyColumns } = useColumns(props.columns, slots);
    const { displayedData } = useDisplayData(props);
    const { total } = usePagination(props.paginationOptions, props.data);

    const onSortChange = (sortOptions: ISortOptions) => {
      TRACE({
        msg: `onSortChange trigger update:sortOptions ${JSON.stringify(sortOptions)}`,
        module: 'Table'
      });
      emit('update:sortOptions', sortOptions);
    };
    const onPageChange = (page: number) => {
      const opt = {
        ...props.paginationOptions,
        page
      };
      TRACE({
        msg: `onPageChange trigger update:paginationOptions ${JSON.stringify(opt)}`,
        module: 'Table'
      });
      emit('update:paginationOptions', opt);
    };
    return {
      headerColumns,
      bodyColumns,
      onSortChange,
      onPageChange,
      displayedData,
      total
    };
  },
  render() {
    return <div class="fy-table">
      <table class="fy-table__table">
        <TableHeader
          on={{
            'update:sortOptions': this.onSortChange
          }}
          columns={this.headerColumns}
          sortOptions={this.sortOptions} />
        <TableBody columns={this.bodyColumns} data={this.displayedData} />
      </table>
      {this.paginationOptions.enable && <Pagination
        limit={this.paginationOptions.limit}
        page={this.paginationOptions.page}
        total={this.total}
        on={{
          'update:page': this.onPageChange
        }}
      />}
    </div>;
  }
})

function useDisplayData (props: {
  data: ITableData[],
  sortOptions: ISortOptions,
  columns: IColumnOptions[],
  paginationOptions: ITablePaginationOptions,
}) {
  const sortWrapper = ({ data, sortOptions, columns }: {
    data: ITableData[],
    sortOptions: ISortOptions,
    columns: IColumnOptions[]
  }) => {
    const sortedData = [...data];
    if (sortOptions.remote || sortOptions.sortType === SORT_TYPE.NONE) {
      return sortedData;
    }

    const sortColumn = columns?.find(col => col.dataIndex === sortOptions.sortKey);
    let defaultFn = (a: ITableData, b: ITableData) => a[sortOptions.sortKey] > b[sortOptions.sortKey] ? 1 : -1;
    const sortFn = sortColumn?.sortFn || defaultFn;
    const descSortFn = (a: ITableData, b: ITableData) => -sortFn(a, b);

    sortedData.sort(sortOptions.sortType === SORT_TYPE.ASC ? sortFn : descSortFn);

    return sortedData;
  };
  const paginationWrapper = ({ data, paginationOptions }: {
    data: ITableData[],
    paginationOptions: ITablePaginationOptions
  }) => {
    const paginationData = [...data];
    if (paginationOptions.remote || !paginationOptions.enable) {
      return paginationData;
    }

    const start = paginationOptions.limit * (paginationOptions.page - 1);
    const end = start + paginationOptions.limit;
    return paginationData.slice(start, end);
  };
  const displayedData = computed(() => {
    // 数据处理函数均遵循 (options: tableProps) => ITableData[]
    // TODO: 后续可新增一个 filterWrapper 暴露出去做自定义筛选，加入到数据流最前面即可
    // filter => sort => pagination
    let data = sortWrapper({
      data: props.data,
      sortOptions: props.sortOptions,
      columns: props.columns
    });
    data = paginationWrapper({
      data: data,
      paginationOptions: props.paginationOptions
    });
    return data;
  });
  return {
    displayedData
  };
}

function useColumns (columns: IColumnOptions[], slots: Slots) {
  DEBUG({
    msg: `useColumns get slots ${Object.keys(slots).join(', ')}}`,
    module: 'Table'
  });
  // 根据名称取 slot，注入到 column 配置中
  const headerColumns = (columns?.map(column => ({
    ...column,
    slot: slots[`header__${column.dataIndex}`]
  })) || []) as IColumnOptions[];
  const bodyColumns = (columns?.map(column => ({
    ...column,
    slot: slots[`body__${column.dataIndex}`]
  })) || []) as IColumnOptions[];

  return {
    headerColumns,
    bodyColumns
  };
};

function usePagination (paginationOptions: ITablePaginationOptions, data: ITableData[]) {
  // 远端分页的话 total 由外部传入，本地分页的话 total = data.length
  const total = computed(() =>  paginationOptions.remote ? paginationOptions.total : data.length);
  return {
    total
  };
}
