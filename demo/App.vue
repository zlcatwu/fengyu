<template>
  <div>
    <fy-table v-model="data" :options="tableOptions" />
  </div>
</template>

<script lang="ts">
import { FyTable } from '../src/table'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'App',
  components: {
    FyTable
  },
  data() {
    return {
      tableOptions: {
        columns: [
          { dataIndex: 'index', header: 'Index', sortable: false },
          { dataIndex: 'name', header: 'Name', sortable: true },
          { dataIndex: 'level', header: 'Level', sortable: true }
        ],
        pagination: {
          enable: true,
          limit: 5
        }
      },
      data: {
        data: [
          { index: 1, name: 'xxx', level: 1 },
          { index: 2, name: 'yyy', level: 3 },
          { index: 3, name: 'zzz', level: 2 },
          { index: 4, name: 'weq', level: 2 },
          { index: 5, name: 'zzsadaz', level: 4 },
          { index: 6, name: 'cx', level: 2 },
          { index: 7, name: 'zzsdz', level: 7 },
          { index: 8, name: 'zzxzczxcz', level: 2 }
        ],
        page: 1
      }
    };
  },
  mounted() {
    // setTimeout(() => {
    //   this.data.page = 1;
    //   this.data.data = [
    //     { index: 1, name: 'yyyyy', level: 4 }
    //   ];
    // }, 1000);
  }
})
</script>
