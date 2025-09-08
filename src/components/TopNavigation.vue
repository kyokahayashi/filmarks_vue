<template>
  <v-layout class="overflow-visible" style="height: 56px;">
    <v-bottom-navigation v-model="value" color="teal" grow>
      <v-btn to="/search" value="search">
        <v-icon>mdi-movie-search</v-icon>

        映画を検索する
      </v-btn>

      <v-btn to="/popular" value="Popular">
        <v-icon>mdi-movie</v-icon>

        人気の映画
      </v-btn>

      <v-btn to="/reviewForm" value="reviewForm">
        <v-icon>mdi-message-fast-outline</v-icon>

        投稿したレビュー
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
<script setup>
import { ref } from 'vue'

const value = ref(1)
</script>
