import { mount } from '@vue/test-utils'
import { FyTable } from '../table'
import TableBodyCell from '../table/TableBodyCell'
import Pagination from '../pagination/Pagination'

const PREV_CLASS = 'fy-pagination__prev';
const NEXT_CLASS = 'fy-pagination__next';

describe('Table:pagination', () => {
  const TableMount = options => mount(FyTable, options)

  test('limit < data.length', () => {
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name', sortable: true }
        ],
        data: [
          { name: 'xxx' },
          { name: 'yyy' },
          { name: 'zzz' }
        ],
        paginationOptions: {
          enable: true,
          limit: 5,
          page: 1
        }
      }
    });
    expect(wrapper.findComponent(Pagination).exists()).toBeTruthy();
  });

  test('limit > data.length', async () => {
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' }
        ],
        data: [
          { name: 'name-1' },
          { name: 'name-2' },
          { name: 'name-3' }
        ],
        paginationOptions: {
          enable: true,
          limit: 2,
          page: 1
        }
      }
    });
    // 共2页，当前第1页
    expect(wrapper.findComponent(Pagination).html().includes('(1 / 2)')).toBeTruthy();
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:paginationOptions', (opt) => {
      wrapper.setProps({
        paginationOptions: opt
      })
    });

    // 在第一页点上一页，应该无效果
    await wrapper.findComponent(Pagination).find('.' + PREV_CLASS).trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('name-1')).toBeTruthy();

    // 正常跳转下一页
    await wrapper.findComponent(Pagination).find('.' + NEXT_CLASS).trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('name-3')).toBeTruthy();

    // 在最后一页点下一页，应该无效果
    await wrapper.findComponent(Pagination).find('.' + NEXT_CLASS).trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('name-3')).toBeTruthy();
  });

  test('remote pagination', async () => {
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' }
        ],
        data: [
          { name: 'name-1' },
          { name: 'name-2' }
        ],
        paginationOptions: {
          limit: 2,
          page: 1,
          total: 10,
          remote: true,
          enable: true
        }
      }
    });
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:paginationOptions', (opt) => {
      wrapper.setProps({
        paginationOptions: opt
      })
    });

    expect(wrapper.findComponent(Pagination).html().includes('1 / 5')).toBeTruthy();

    // 有下一页，但点击只触发事件，数据更新交由外部去做
    await wrapper.findComponent(Pagination).find('.' + NEXT_CLASS).trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('name-1')).toBeTruthy();
  });

})
