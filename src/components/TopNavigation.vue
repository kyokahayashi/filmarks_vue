<template>
  <v-tabs v-model="tab" background-color="teal" dark grow fixed-tabs>
    <v-tab to="/search">
      <v-icon start>mdi-movie-search</v-icon>
      映画を検索する
    </v-tab>
    <v-tab to="/popular">
      <v-icon start>mdi-movie</v-icon>
      人気の映画
    </v-tab>
    <v-tab to="/reviewForm">
      <v-icon start>mdi-message-fast-outline</v-icon>
      投稿したレビュー
    </v-tab>
  </v-tabs>
</template>
<script setup>
import { ref } from 'vue'

const tab = ref(null);
</script>
