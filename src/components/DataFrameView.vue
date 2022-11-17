<template>
  <table v-if="dataframe">
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
  </table>
  <p v-else>No results yet :)</p>
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
table {
  padding: 1em;
  border-collapse: separate;
  border-spacing: 0 0;

  width: 100%;
  height: 100%;
  display: block;
}

tbody {
  height: 100%;
  display: block;
  overflow-y: scroll;
  overflow-x: auto;
}

thead {
  width: 100%;
}

td {
  border-bottom: 1px solid lightgray;
  height: 1.5em;
}

tbody tr:hover {
  background: lightgrey;
}
</style>
