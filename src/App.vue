<template>
  <v-app>
    <v-app-bar title="Lumberjack" :elevation="0" density="compact">
      <v-btn>
        <a href="https://github.com/pensono/lumberjack" target="_blank" rel="noreferrer noopener" >
          <v-icon icon="fa-brands fa-github" />
        </a>
      </v-btn>
      <v-btn>
        Demo
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="demo in demos"
              :key="demo.name"
              @click="loadDemo(demo)"
            >
              <v-list-item-title>{{ demo.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-app-bar>
    <v-main>
      <splitpanes horizontal class="main-splitpane default-theme">
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
              <div v-if="errorMessage" class="error-box">
                {{ errorMessage }}
              </div>
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
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import * as dfd from "danfojs";
import "splitpanes/dist/splitpanes.css";
import { computed, ref, watch } from "vue";
import { evaluate } from "@/lib/evaluator";
import { toDataFrame } from "@/lib/raw_input";
import { SimpleContext } from "@/lib/types";
import DataFrameView from "@/components/DataFrameView.vue";
import { Demo, demos } from "@/demo_resources";
import axios from "axios";

const code = ref("");
const dataRaw = ref("");

const evaluatedResult = computed(() => {
  let input = toDataFrame(dataRaw.value);
  let context = new SimpleContext(new Map([["Input", input]]));
  return evaluate(code.value, context);
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

function loadDemo(demo: Demo) {
  axios.get(demo.log_url).then((result) => {
    dataRaw.value = result.data;
    code.value = demo.query;
  });
}
</script>

<style>
main {
  display: flex;
}

.main-splitpane {
  height: 100%;
}

.code-container {
  display: flex;
  flex-direction: column;
}

.splitpanes__pane {
  display: flex;
}

.splitpanes__splitter {
  padding: 0.25em;
}

.cm-editor {
  flex-grow: 1;
}

.cm-editor.cm-focused {
  outline: none;
}

.cm-content {
  /* I don't know why, but this gets exactly the correct scrollbar behavior */
  width: 0;
}

html {
  height: 100%;
  overflow-y: hidden;
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
