<template>
  <codemirror
    class="editor"
    v-model="contents"
    placeholder="Data goes here..."
  />
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

<style scoped></style>
