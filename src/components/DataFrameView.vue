<template>
  <v-table>
    <thead>
    <th v-for="column in dataframe.columns" :key="column" class="text-left">
      {{column}}
    </th>
    </thead>
    <tbody>
    <tr v-for="row in dataframe.values" :key="row.index">
      <td v-for="(cell, index) in row" :key="index">{{ cell }}</td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
import * as dfd from "danfojs";

export default {
  name: "DataFrameView",
  props: {
    dataframe: {
      type: dfd.DataFrame
    }
  }
}
</script>

<style scoped>

</style>