/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent } from '@vue/composition-api'
import { tableBodyCellProps } from './types';

export default defineComponent({
    name: 'TableBodyCell',
    props: tableBodyCellProps,
    setup(props) {
      const value = computed(() => props.data[props.column.dataIndex]);

      return {
        value
      };
    },
    render() {
        return <td class="fy-table__body-column">
        <span class="fy-table__body-column__value">
          {this.column.slot ? this.column.slot({ value: this.value, data: this.data }) : this.value}
        </span>
      </td>
    }
})

