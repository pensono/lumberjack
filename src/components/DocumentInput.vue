<template>
  <div class="wrap">
    <div class="controls">
      <v-btn-toggle
        rounded="0"
        group
        density="compact"
        v-model="document.format"
      >
        <v-btn :value="{ kind: 'csv' }" size="small">CSV</v-btn>
        <v-btn :value="{ kind: 'log' }" size="small">Log</v-btn>
      </v-btn-toggle>
    </div>
    <codemirror
      class="editor"
      v-model="document.contents"
      placeholder="Data goes here..."
    />
  </div>
</template>

<script setup lang="ts">
import type * as dfd from "danfojs";
import { computed, defineEmits, defineProps, ref, watch } from "vue";
import { toDataFrame } from "@/lib/raw_input";
import type { LumberjackDocument } from "@/lib/types";

const props = defineProps<{
  document: LumberjackDocument;
}>();

const emit = defineEmits<{
  (e: "update:document", newValue: string): void;
  (e: "updateDataframe", newValue: dfd.DataFrame): void;
}>();

watch(
  () => props.document,
  (v) => {
    let newDataframe = toDataFrame(props.document);
    emit("updateDataframe", newDataframe);
    return newDataframe;
  },
  { deep: true }
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
