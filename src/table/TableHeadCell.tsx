/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent } from '@vue/composition-api'
import { SORT_TYPE, TableHeadCellProps, tableHeadCellProps } from './types'

export default defineComponent({
  name: 'TableHeaderCell',
  props: tableHeadCellProps,
  setup(props, { emit }) {
    const classes = useClasses(props);
    const onClick = () => {
      props.sortable && emit('update:sortKey', props.dataIndex);
    };
    return {
      classes,
      onClick
    };
  },
  render() {
    const content = this.$slots.default;
    return <th onClick={this.onClick} class={this.classes}>{content}</th>;
  }
})

function useClasses(props: TableHeadCellProps) {
  return computed(() => {
    return {
      'fy-table-cell': true,
      'fy-table-cell_sortable': props.sortable,
      'fy-table-cell_sortable_desc': props.sortType === SORT_TYPE.DESC,
      'fy-table-cell_sortable_asc': props.sortType === SORT_TYPE.ASC
    };
  });
}
