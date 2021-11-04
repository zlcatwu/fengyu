import { mount } from '@vue/test-utils'
import { FyTable } from '../table'
import TableBodyCell from '../table/TableBodyCell'
import Pagination from '../pagination/Pagination'

const PREV_CLASS = 'fy-pagination__prev';
const NEXT_CLASS = 'fy-pagination__next';

describe('Table:pagination', () => {
  const columns = [
    { dataIndex: 'name', header: 'Name', sortable: true },
    { dataIndex: 'account', header: 'Account' }
  ];
  const data = [
    { name: 'name-1', account: 'account-1' },
    { name: 'name-2', account: 'account-2' },
    { name: 'name-3', account: 'account-3' },
    { name: 'name-4', account: 'account-4' },
    { name: 'name-5', account: 'account-5' }
  ];

  const TableMount = options => mount(FyTable, options)

  beforeAll(() => {
    jest.spyOn(console, 'trace')
      .mockImplementation(() => {});
  });

  test('limit < data.length', () => {
    const wrapper = TableMount({
      propsData: {
        columns,
        data,
        paginationOptions: {
          enable: true,
          limit: 5,
          page: 1
        }
      }
    });
    expect(wrapper.findComponent(Pagination).exists()).toBeTruthy();
    expect(wrapper.findAllComponents(TableBodyCell).length).toEqual(data.length * columns.length);
  });

  test('limit > data.length', async () => {
    const limit = Math.ceil(data.length / 2);
    const wrapper = TableMount({
      propsData: {
        columns,
        data,
        paginationOptions: {
          enable: true,
          limit,
          page: 1
        }
      }
    });
    // 共2页，当前第1页
    expect(wrapper.findComponent(Pagination).html().includes(`(1 / ${Math.ceil(data.length / limit)})`)).toBeTruthy();
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:paginationOptions', (opt) => {
      wrapper.setProps({
        paginationOptions: opt
      })
    });

    // 在第一页点上一页，应该无效果
    await wrapper.findComponent(Pagination).find('.' + PREV_CLASS).trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes(data[0].name)).toBeTruthy();

    // 正常跳转下一页
    await wrapper.findComponent(Pagination).find('.' + NEXT_CLASS).trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes(data[limit].name)).toBeTruthy();

    // 在最后一页点下一页，应该无效果
    await wrapper.findComponent(Pagination).find('.' + NEXT_CLASS).trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes(data[limit].name)).toBeTruthy();
  });

  test('remote pagination', async () => {
    const limit = 2;
    const total = 10;
    const wrapper = TableMount({
      propsData: {
        columns,
        data,
        paginationOptions: {
          limit,
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

    expect(wrapper.findComponent(Pagination).html().includes(`1 / ${Math.ceil(total / limit)}`)).toBeTruthy();

    // 有下一页，但点击只触发事件，数据更新交由外部去做
    await wrapper.findComponent(Pagination).find('.' + NEXT_CLASS).trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes(data[0].name)).toBeTruthy();
  });

})
