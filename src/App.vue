<template>
  <v-app>
    <v-main>
      <splitpanes horizontal class="default-theme">
        <pane>
          <splitpanes class="default-theme">
            <pane class="code-container" min-size="5">
              <codemirror class="editor" v-model="dataRaw" placeholder="Data goes here..."/>
            </pane>
            <pane class="code-container" min-size="5">
              <codemirror class="editor" v-model="code" placeholder="Queries go here..."/>
            </pane>
          </splitpanes>
        </pane>
        <pane max-size="90" min-size="5">
          <v-table>
            <thead>
              <th v-for="column in outputTable.columns" :key="column" class="text-left">
                {{column}}
              </th>
            </thead>
            <tbody>
              <tr v-for="row in outputTable.values" :key="row.index">
                <td v-for="(cell, index) in row" :key="index">{{ cell }}</td>
              </tr>
            </tbody>
          </v-table>
        </pane>
      </splitpanes>
    </v-main>
  </v-app>
</template>

<script setup>
import 'splitpanes/dist/splitpanes.css';
import {ref} from "vue";
import * as dfd from "danfojs";

const code = ref("");
const dataRaw = ref("");
const outputTable = ref(new dfd.DataFrame({"column":["value=4","value=5"],"value":["4","5"]}));
</script>

<style>
.splitpanes__splitter {
  padding: 5px;
}

.code-container {
  display: flex;
}

.cm-editor {
  flex-grow: 1;
}

.cm-editor.cm-focused {
  outline: none;
}
</style>
