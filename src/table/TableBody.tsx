/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent } from '@vue/composition-api'
import TableBodyCell from './TableBodyCell';
import { ICellClickEvent, IRowClickEvent, tableBodyProps } from './types';

export default defineComponent({
  name: 'TableBody',
  props: tableBodyProps,
  setup(props, { emit }) {
    const onCellClick = (data: ICellClickEvent) => {
      emit('cell:click', data);
    };
    const onRowClick = (data: IRowClickEvent) => {
      emit('row:click', data);
    };
    return {
      onCellClick,
      onRowClick
    };
  },
  render() {
    return <tbody>
      {this.data.map((record, rowIdx) => <tr
        onClick={() => this.onRowClick({ record, index: rowIdx })}
        class="fy-table__body-row">
        {this.columns.map((column, colIdx) => <TableBodyCell
          on={{
            'cell:click': () => this.onCellClick({ record, index: colIdx, column })
          }}
          column={column}
          data={record}
        />)}
      </tr>)}
    </tbody>
  }
})

