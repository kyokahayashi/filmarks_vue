<template>
  <div v-if="loading">読み込み中…</div>
  <v-container v-else>
    <v-row>
      <v-col
        v-for="movie in movieStore.movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <router-link :to="`/movie/${movie.id}`">
          <MovieCard :movie="movie" />
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMovieStore } from '@/stores/movieStore';
import MovieCard from './MovieCard.vue';

const movieStore = useMovieStore()
const loading = ref(true)
onMounted(async () => {
  if(!movieStore.movies.length){
    await movieStore.fetchMovies()
  }
  loading.value = false
})
const emit = defineEmits(['select-movie'])
const handleDetail = (movie) => {
  emit('select-movie', movie);
}
</script>
