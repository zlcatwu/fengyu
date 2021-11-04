/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent } from '@vue/composition-api'
import { IPaginationOptions, paginationProps } from './types'
import './Pagination.less';
import { INFO, TRACE } from '../utils';

export default defineComponent({
  name: 'Pagination',
  props: paginationProps,
  setup(props, { emit }) {
    const pageTotal = computed(() => Math.ceil(props.total / props.limit));
    const { prevCls, nextCls } = useClasses(props, pageTotal.value);
    const onTogglePage = (targetPage: number) => {
      if (targetPage <= 0 || targetPage > pageTotal.value) {
        INFO({
          msg: `invalid toggle page ${targetPage} / ${pageTotal.value}`,
          module: 'Pagination'
        });
        return;
      }
      TRACE({
        msg: `onTogglePage trigger update:page ${targetPage}`,
        module: 'Pagination',
        devOnly: true
      });
      emit('update:page', targetPage);
    };

    return {
      pageTotal,
      onTogglePage,
      prevCls,
      nextCls
    };
  },
  render() {
    return <div class="fy-pagination">
      <span
        onClick={() => this.onTogglePage(this.page - 1)}
        class={this.prevCls}>
          prev
      </span>
      <span
        onClick={() => this.onTogglePage(this.page + 1)}
        class={this.nextCls}>
          next
      </span>
      <span
        class="fy-pagination__page">
          ({this.page} / {this.pageTotal})
      </span>
    </div>
  }
})

function useClasses (options: IPaginationOptions, pageTotal: number) {
  const prevCls = computed(() => `fy-pagination__prev ${options.page <= 1 ? 'disabled' : ''}`);
  const nextCls = computed(() => {
    return `fy-pagination__next ${options.page >= pageTotal ? 'disabled' : ''}`;
  });
  return {
    prevCls,
    nextCls
  };
}
