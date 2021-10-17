/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, toRefs, toRef } from '@vue/composition-api'
import { TablePublicProps, tableProps } from './types'

export default defineComponent({
  name: 'Table',
  props: tableProps,
  setup(props, { slots }) {
    const columns = props.options.columns;
    const data = props.data;

    return () => (
      <table>
        <thead>
          <tr>
            {columns.map(column => <th>
              {column.header} {column.sortable ? 'sortable' : 'unsortable'}
            </th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(row => <tr>
            {columns.map(col => <td>{row[col.key]}</td>)}
          </tr>)}
        </tbody>
      </table>
    );
  },
})

function useClasses (props: TablePublicProps) {
  return computed(() => {
    return {}
  })
}
