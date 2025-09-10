<template>
  <main>
    <Header />
    <TopNavigation />
    <MovieList movieType="nowPlaying" title="上映中" />
  </main>
</template>
<script setup>
import Header from '@/components/common/Header.vue';
import MovieList from '@/components/movie/MovieList.vue';
import TopNavigation from '@/components/common/TopNavigation.vue';
</script>
