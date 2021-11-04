import { computed } from '@vue/composition-api';
import { SORT_TYPE, IColumnOptions, ISortOptions } from '../table/types';

export function useSortStates(options: {
  column: IColumnOptions,
  sortOptions: ISortOptions
}) {
  const sortClsMap = {
      [SORT_TYPE.NONE]: '',
      [SORT_TYPE.ASC]: 'fy-table__header-column_sortable_asc',
      [SORT_TYPE.DESC]: 'fy-table__header-column_sortable_desc',
  };
  const nextSortTypeMap = {
      [SORT_TYPE.NONE]: SORT_TYPE.ASC,
      [SORT_TYPE.ASC]: SORT_TYPE.DESC,
      [SORT_TYPE.DESC]: SORT_TYPE.NONE
  };
  const curType = computed(() => options.column.dataIndex === options.sortOptions.sortKey ? options.sortOptions.sortType : SORT_TYPE.NONE);
  const nextType = computed(() => nextSortTypeMap[curType.value]);
  const sortCls = computed(() => [
    'fy-table__header-column_sortable',
    sortClsMap[options.column.dataIndex === options.sortOptions.sortKey ? options.sortOptions.sortType : SORT_TYPE.NONE]
  ].join(' '));
  return {
      sortCls,
      nextType
  };
}
