<template>
  <Header />
  <TopNavigation />
  <MovieList movieType="popular" title="人気作品" />
</template>

<script setup>
import Header from '@/components/common/Header.vue';
import MovieList from '@/components/movie/MovieList.vue';
import TopNavigation from '@/components/common/TopNavigation.vue';
</script>

<style lang="scss" scoped></style>
