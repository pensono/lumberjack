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
          <DataFrameView v-if="outputTable" :dataframe="outputTable" />
        </pane>
      </splitpanes>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css';
import {computed, ref} from "vue";
import {evaluate} from "@/lib/evaluator";
import {toDataFrame} from "@/lib/raw_input";
import {SimpleContext} from "@/lib/types";
import DataFrameView from "@/components/DataFrameView.vue";

const code = ref("");
const dataRaw = ref("");
const outputTable = computed(() => {
  let input = toDataFrame(dataRaw.value);
  let context = new SimpleContext(new Map([["Input", input]]));
  return evaluate(code.value, context);
})
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
