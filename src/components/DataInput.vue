<template>
  <div class="wrap">
    <div class="controls">
      <v-btn-toggle rounded="0" color="deep-purple-accent-3" group>
        <v-btn value="csv">CSV</v-btn>
        <v-btn value="log"> Log</v-btn>
      </v-btn-toggle>
    </div>
    <codemirror
      class="editor"
      v-model="contents"
      placeholder="Data goes here..."
    />
  </div>
</template>

<script setup lang="ts">
import type * as dfd from "danfojs";
import { defineEmits, defineProps, watch } from "vue";
import { toDataFrame } from "@/lib/raw_input";

const props = defineProps<{
  contents: string;
}>();

const emit = defineEmits<{
  (e: "update:contents", newValue: string): void;
  (e: "updateDataframe", newValue: dfd.DataFrame): void;
}>();

watch(
  () => props.contents,
  (newValue) => {
    let newDataframe = toDataFrame(newValue);
    emit("updateDataframe", newDataframe);
  }
);
</script>

<style scoped>
.wrap {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.controls {
  align-self: stretch;
}
</style>

<style>
.cm-editor {
  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;
}
</style>