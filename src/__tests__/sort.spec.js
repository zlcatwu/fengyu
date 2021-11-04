import { mount } from '@vue/test-utils'
import { FyTable } from '../table'
import TableBodyCell from '../table/TableBodyCell'
import TableHeaderCell from '../table/TableHeaderCell'
import { SORT_TYPE } from '../table/types'

const SORTABLE_CLASS = 'fy-table__header-column_sortable';
const SORTABLE_ASC_CLASS = 'fy-table__header-column_sortable_asc';
const SORTABLE_DESC_CLASS = 'fy-table__header-column_sortable_desc';

describe('Table: sort', () => {
  const columns = [
    { dataIndex: 'name', header: 'Name' },
    { dataIndex: 'age', header: 'Age', sortable: true },
    { dataIndex: 'rank', header: 'Rank', sortable: true },
  ];
  const data = [
    { name: 'name-5', rank: 5, age: 1 },
    { name: 'name-3', rank: 3, age: 3 },
    { name: 'name-2', rank: 2, age: 8 },
    { name: 'name-4', rank: 4, age: 10 },
    { name: 'name-1', rank: 1, age: 4 }
  ];
  const ageIdx = 1;
  const rankIdx = 2;
  const TableMount = options => mount(FyTable, options)

  beforeAll(() => {
    jest.spyOn(console, 'trace')
      .mockImplementation(() => {});
    jest.spyOn(console, 'info')
      .mockImplementation(() => {});
  });

  test('sort: sortable class should exits', () => {
    const wrapper = TableMount({
      propsData: {
        columns
      }
    });
    expect(wrapper.findAllComponents(TableHeaderCell).at(ageIdx).html().includes(SORTABLE_CLASS)).toBeTruthy();
    expect(wrapper.findAllComponents(TableHeaderCell).at(rankIdx).html().includes(SORTABLE_CLASS)).toBeTruthy();
  });

  test('sort: built-in sort', async () => {
    const wrapper = TableMount({
      propsData: {
        columns,
        data,
        sortOptions: {
          sortKey: '',
          sortType: SORT_TYPE.NONE
        }
      }
    });
    let sortedData = [...data];
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:sortOptions', (opt) => {
      wrapper.setProps({
        sortOptions: opt
      })
    });
    // 点一次升序
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).find('.' + SORTABLE_CLASS).trigger('click');
    sortedData.sort((a, b) => a.rank > b.rank ? 1 : -1);
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length + rankIdx).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    // 再点一次降序
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).find('.' + SORTABLE_CLASS).trigger('click');
    sortedData.sort((a, b) => a.rank > b.rank ? -1 : 1);
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length + rankIdx).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    // 再点一次不排序
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).find('.' + SORTABLE_CLASS).trigger('click');
    for (let i = 0; i < data.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length).html().includes(data[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length + rankIdx).html().includes(data[i].rank)).toBeTruthy();
    }

    // sortable: false 的列头应该找不到对应的排序样式
    expect(wrapper.findAllComponents(TableHeaderCell).at(0).find('.' + SORTABLE_CLASS).exists()).toBeFalsy();
  });

  test('sort: custom sort', async () => {
    const sortFn = (a, b) => a.rank < b.rank ? 1 : -1;
    const wrapper = TableMount({
      propsData: {
        columns: columns.map(column => ({
          ...column,
          sortFn: column.dataIndex === 'rank' ? sortFn : undefined
        })),
        data
      }
    });
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:sortOptions', (opt) => {
      wrapper.setProps({
        sortOptions: opt
      })
    });

    const rankHeaderCell = wrapper.findAllComponents(TableHeaderCell).at(rankIdx);
    // 升序
    // 检验数据与样式
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).find('.' + SORTABLE_CLASS).trigger('click');
    const sortedData = [...data];
    sortedData.sort(sortFn);
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length + rankIdx).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    expect(rankHeaderCell.html().includes(SORTABLE_ASC_CLASS)).toBeTruthy();

    // 降序
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).find('.' + SORTABLE_CLASS).trigger('click');
    sortedData.sort((a, b) => -sortFn(a, b));
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length + rankIdx).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    expect(rankHeaderCell.html().includes(SORTABLE_DESC_CLASS)).toBeTruthy();

    // 恢复
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).find('.' + SORTABLE_CLASS).trigger('click');
    for (let i = 0; i < data.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length).html().includes(data[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length + rankIdx).html().includes(data[i].rank)).toBeTruthy();
    }
  })

  test('sort: remote sort', async () => {
    const wrapper = TableMount({
      propsData: {
        columns,
        data,
        sortOptions: {
          sortKey: '',
          sortType: SORT_TYPE.NONE,
          remote: true
        }
      }
    });
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:sortOptions', (opt) => {
      wrapper.setProps({
        sortOptions: opt
      })
    });
    // 配了 remote 的点击后不会引起数据更新，单纯外发事件交由外部处理
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).trigger('click');
    for (let i = 0; i < data.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length).html().includes(data[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * columns.length + rankIdx).html().includes(data[i].rank)).toBeTruthy();
    }
  });

  test('sort: different column sort', async () => {
    const wrapper = TableMount({
      propsData: {
        data,
        columns,
        sortOptions: {
          sortKey: '',
          sortType: SORT_TYPE.NONE,
        }
      }
    });
    const headerCells = wrapper.findAllComponents(TableHeaderCell);
    const ageCell = headerCells.at(ageIdx);
    const rankCell = headerCells.at(rankIdx);
    const bodyCells = wrapper.findAllComponents(TableBodyCell);
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:sortOptions', (opt) => {
      wrapper.setProps({
        sortOptions: opt
      })
    });
    // 点击 age，数据按 sort 进行排序，age 有排序类，rank 没有排序类
    await ageCell.find('.' + SORTABLE_CLASS).trigger('click');
    const sortedData = [...data].sort((a, b) => a.age - b.age);
    sortedData.forEach((record, idx) => {
      expect(bodyCells.at(idx * columns.length + ageIdx).html().includes(record.age)).toBeTruthy();
    });
    expect(ageCell.find('.' + SORTABLE_ASC_CLASS).exists()).toBeTruthy();
    expect(rankCell.find('.' + SORTABLE_ASC_CLASS).exists()).toBeFalsy();

    // 点击 rank，数据按 sort 进行排序，rank 有排序类，age 没有排序类
    await rankCell.find('.' + SORTABLE_CLASS).trigger('click');
    sortedData.sort((a, b) => a.rank - b.rank);
    sortedData.forEach((record, idx) => {
      expect(bodyCells.at(idx * columns.length + rankIdx).html().includes(record.rank)).toBeTruthy();
    });
    expect(ageCell.find('.' + SORTABLE_ASC_CLASS).exists()).toBeFalsy();
    expect(rankCell.find('.' + SORTABLE_ASC_CLASS).exists()).toBeTruthy();
  });
})
