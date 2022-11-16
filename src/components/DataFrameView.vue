<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="column in dataframe.columns"
          :key="column"
          class="text-left"
        >
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
</template>

<script>
import * as dfd from "danfojs";

export default {
  name: "DataFrameView",
  props: {
    dataframe: {
      type: dfd.DataFrame,
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
