/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent, provide } from '@vue/composition-api'
import {
  tableProps, ISortOptions,
  IRowClickEvent, ICellClickEvent,
} from './types'
import { useDisplayedData } from '../composables/use-displayed-data';
import { useColumns } from '../composables/use-columns';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from '../pagination/Pagination';
import { TRACE, tableCommonSymbol } from '../utils';
import { useTablePagination } from '../composables/use-table-pagination';

export default defineComponent({
  name: 'FyTable',
  props: tableProps,
  setup(props, { emit, slots }) {
    const { headerColumns, bodyColumns } = useColumns(props, slots);
    const { displayedData } = useDisplayedData(props);
    const { total } = useTablePagination(props, props.data);

    const onCellClick = (data: ICellClickEvent) => emit('cell:click', data);
    const onRowClick = (data: IRowClickEvent) => emit('row:click', data);
    const onSortChange = (sortOptions: ISortOptions) => {
      TRACE({
        msg: `onSortChange trigger update:sortOptions ${JSON.stringify(sortOptions)}`,
        module: 'Table',
        devOnly: true
      });
      emit('update:sortOptions', sortOptions);
      emit('sort:change', sortOptions);
    };
    provide(tableCommonSymbol, {
      onSortChange,
      onRowClick,
      onCellClick
    });
    const onPageChange = (page: number) => {
      const opt = {
        ...props.paginationOptions,
        page
      };
      TRACE({
        msg: `onPageChange trigger update:paginationOptions ${JSON.stringify(opt)}`,
        module: 'Table',
        devOnly: true
      });
      emit('update:paginationOptions', opt);
      emit('pagination:change', opt);
    };

    return {
      headerColumns,
      bodyColumns,
      onPageChange,
      displayedData,
      total
    };
  },
  render() {
    return <div class="fy-table">
      <table class="fy-table__table">
        <TableHeader
          columns={this.headerColumns}
          sortOptions={this.sortOptions} />
        <TableBody
          columns={this.bodyColumns}
          data={this.displayedData} />
      </table>
      {this.paginationOptions.enable && <Pagination
        limit={this.paginationOptions.limit}
        page={this.paginationOptions.page}
        total={this.total}
        on={{
          'update:page': this.onPageChange,
        }}
      />}
    </div>;
  }
})
