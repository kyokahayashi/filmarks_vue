<template>
  <div v-if="movie">
    <h3>{{ movie.title }}</h3>
    <img :src="movie.image" alt="映画の画像" width="200" />
    <p>詳細：{{ movie.description }}</p>
    <p>監督：{{ movie.director }}</p>
    <p>公開年：{{ movie.year }}</p>
    <p>avg rating</p>
    <ReviewList />
  </div>
  <div v-else>
    <p>読み込み中、または映画が見つかりません</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMovieStore } from '@/stores/movieStore';
import ReviewList from '@/components/Review/ReviewList.vue';

const route = useRoute()
const movieStore = useMovieStore()
const movie = ref(null)
onMounted(async() => {
  if(!movieStore.movies.length){
    await movieStore.fetchMovies()
  }

  const movieId = Number(route.params.id)
  movie.value = movieStore.getMovieById(movieId)
})
</script>

<style lang="scss" scoped></style>
