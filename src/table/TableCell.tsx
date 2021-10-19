/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent } from '@vue/composition-api'
import { tableCellProps } from './types'

export default defineComponent({
  name: 'TableCell',
  props: tableCellProps,
  // setup(props, { slots }) {
  //   const defaultSlot = slots.default;
  //   return { defaultSlot };
  // },
  render() {
    const content = this.$slots.default;
    return <td class="fy-table-cell">{content}</td>;
  }
})

