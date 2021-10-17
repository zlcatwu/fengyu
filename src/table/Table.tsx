/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent } from '@vue/composition-api'
import { TablePublicProps, tableProps } from './types'

export default defineComponent({
  name: 'Table',
  props: tableProps,
  setup(props, { slots }) {
    const classes = useClasses(props)
    return () => {
      return (
        <p class={classes.value}>Hello World. {slots?.default?.()}</p>
      )
    }
  },
})

function useClasses (props: TablePublicProps) {
  return computed(() => {
    return {
      'test-class': props.test,
    }
  })
}
