/**
 * Created by uedc on 2021/10/11.
 */

 import { defineComponent } from '@vue/composition-api'
import TableBodyCell from './TableBodyCell';
 import { tableBodyProps } from './types';

 export default defineComponent({
     name: 'TableBody',
     props: tableBodyProps,
     render() {
         return <tbody>
            {this.data.map(record => <tr class="fy-table__body-row">
                {this.columns.map(column => <TableBodyCell column={column} data={record} />)}
            </tr>)}
         </tbody>
     }
 })

