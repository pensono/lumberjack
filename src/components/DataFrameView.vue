<template>
  <v-table fixed-header height="100%" density="compact" v-if="dataframe">
    <thead>
      <tr>
        <th v-for="column in dataframe.columns" :key="column" class="text-left">
          {{ column }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in dataframe.values" :key="row.index">
        <td v-for="(cell, index) in row" :key="index">{{ cell }}</td>
      </tr>
    </tbody>
  </v-table>
  <div v-if="!dataframe">Empty table</div>
</template>

<script lang="ts">
import type * as dfd from "danfojs";
import type { PropType } from "vue";

export default {
  name: "DataFrameView",
  props: {
    dataframe: {
      type: Object as PropType<dfd.DataFrame | null>,
    },
  },
};
</script>

<style scoped>
.v-table {
  width: 100%;
}

tbody tr:hover {
  background: lightgrey;
}
</style>
