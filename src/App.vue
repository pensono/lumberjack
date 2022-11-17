<template>
  <main>
    <splitpanes horizontal class="main-splitpane">
      <pane max-size="90" min-size="5">
        <splitpanes>
          <pane class="input-container" min-size="5">
            <codemirror
              class="editor"
              v-model="dataRaw"
              placeholder="Data goes here..."
            />
          </pane>
          <pane class="code-container" min-size="5">
            <codemirror
              class="editor"
              v-model="code"
              placeholder="Queries go here..."
            />
            <p v-if="errorMessage" class="error-box">{{ errorMessage }}</p>
          </pane>
        </splitpanes>
      </pane>
      <pane>
        <DataFrameView
          class="results"
          v-if="outputTable"
          :dataframe="outputTable"
        />
      </pane>
    </splitpanes>
  </main>
</template>

<script setup lang="ts">
import * as dfd from "danfojs";
import "splitpanes/dist/splitpanes.css";
import {computed, ref, watch} from "vue";
import { evaluate } from "@/lib/evaluator";
import { toDataFrame } from "@/lib/raw_input";
import { SimpleContext } from "@/lib/types";
import DataFrameView from "@/components/DataFrameView.vue";

const code = ref("");
const dataRaw = ref("");

const evaluatedResult = computed(() => {
  let input = toDataFrame(dataRaw.value);
  let context = new SimpleContext(new Map([["Input", input]]));
  let result = evaluate(code.value, context);
  return result;
});

const outputTable = ref<dfd.DataFrame | null>(null);

watch(evaluatedResult, (newValue) => {
  // Only update on success
  if (newValue.kind == "evaluationResult") {
    outputTable.value = newValue.result;
  }
});

const errorMessage = computed<string | null>(() => {
  // Only update on success
  let result = evaluatedResult.value;
  switch (result.kind) {
    case "syntaxError":
      return `Syntax error on line ${evaluatedResult.value.line} column ${evaluatedResult.value.column}`;
    case "evaluationError":
      return evaluatedResult.value.message;
    default:
      return null;
  }
});
</script>

<style>
main {
  display: flex;
}

.main-splitpane {
  height: 100%;
}

.splitpanes__pane {
  display: flex;
}

.splitpanes__splitter {
  padding: 5px;
}

.code-container {
  display: flex;
  flex-direction: column;
}

.cm-scroller {
  overflow-y: auto;
}

.cm-editor {
  flex-grow: 1;
}

.cm-editor.cm-focused {
  outline: none;
}

html {
  height: 100%;
}

body {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

main {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
