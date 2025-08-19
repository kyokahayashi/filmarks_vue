<template>
  <Header></Header>
  <main>
    <h1>映画一覧</h1>
    <MovieList></MovieList>
    <LatestReview />
  </main>
</template>
<script setup>
import Header from '@/components/Header.vue';
import MovieList from '@/components/MovieList.vue';
import LatestReview from '@/components/Review/LatestReview.vue';
</script>
