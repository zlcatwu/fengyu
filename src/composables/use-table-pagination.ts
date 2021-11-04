import { computed } from '@vue/composition-api';
import { TablePublicProps, ITableData } from '../table/types';

export function useTablePagination (props: TablePublicProps, data: ITableData[]) {
  // 远端分页的话 total 由外部传入，本地分页的话 total = data.length
  const total = computed(() =>  props.paginationOptions?.remote ? props.paginationOptions.total : data.length);
  return {
    total
  };
}
