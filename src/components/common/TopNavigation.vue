<template>
  <v-tabs
    v-model="tab"
    background-color="teal"
    dark
    grow
    fixed-tabs
    class="mb-7"
  >
    <v-tab to="/search">
      <v-icon start>mdi-movie-search</v-icon>
      映画を検索する
    </v-tab>
    <v-tab to="/popular">
      <v-icon start>mdi-movie</v-icon>
      人気の映画
    </v-tab>
    <v-tab to="/upcoming">
      <v-icon start>mdi-message-fast-outline</v-icon>
      公開予定の映画
    </v-tab>
  </v-tabs>
</template>
<script setup>
import { ref } from 'vue'

const tab = ref(null);
</script>
