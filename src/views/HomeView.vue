<template>
  <Header></Header>
  <main>
    <MovieList :movies="movies" @select-movie="movies"></MovieList>
  </main>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Header from '@/components/Header.vue';
import MovieList from '@/components/MovieList.vue';

// const reviews = ref([])
const movies = ref([])

onMounted(async () => {
  try {
    // 必要になるかも
    // const reviewResponse = await axios.get('/data/review.json')
    // reviews.value = reviewResponse.data

    const movieResponse = await axios.get('/data/movies.json')
    movies.value = movieResponse.data

    console.log('映画:', movies.value)
  } catch (error) {
    console.error('データ取得エラー:', error)
  }
})
</script>
