<template>
  <div class="wrapper">
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
  </div>
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
.wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
}

table {
  padding: 1em;
  border-collapse: separate;
  border-spacing: 0 0;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: block;
  overflow-y: scroll;
  overflow-x: auto;
}

td {
  border-bottom: 1px solid lightgray;
  height: 1.5em;
}

tbody tr:hover {
  background: lightgrey;
}
</style>
