/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent } from '@vue/composition-api'
import { paginationProps } from './types'
import './Table.less';

export default defineComponent({
  name: 'Pagination',
  props: paginationProps,
  setup(props, { emit }) {
    const pageTotal = computed(() => Math.ceil(props.total / props.limit));
    const onTogglePage = (targetPage: number) => {
      if (targetPage < 0 || targetPage > pageTotal.value) {
        return;
      }
      emit('update:page', targetPage);
    };

    return {
      pageTotal,
      onTogglePage
    };
  },
  render() {
    return <div class="fy-table-pagination">
      <span
        onClick={() => this.onTogglePage(this.page - 1)}
        class="fy-table-pagination__prev">
          prev
      </span>
      <span
        onClick={() => this.onTogglePage(this.page + 1)}
        class="fy-table-pagination__next">
          next
      </span>
      <span
        class="fy-table-pagination__page">
          ({this.page} / {this.pageTotal})
      </span>
    </div>
  }
})
