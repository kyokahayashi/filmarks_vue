<template>
  <Header></Header>
  <main>
    <h1>映画一覧</h1>
    <MovieList movieType="popular" title="人気映画" />
    <MovieList movieType="nowPlaying" title="上映中" />
  </main>
</template>
<script setup>
import Header from '@/components/Header.vue';
import MovieList from '@/components/MovieList.vue';
</script>
