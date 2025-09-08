<template>
  <Header />
  <TopNavigation />
  <MovieList movieType="popular" title="人気作品" />
</template>

<script setup>
import Header from '@/components/Header.vue';
import MovieList from '@/components/MovieList.vue';
import TopNavigation from '@/components/TopNavigation.vue';
</script>

<style lang="scss" scoped></style>
