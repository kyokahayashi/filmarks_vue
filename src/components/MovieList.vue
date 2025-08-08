<template>
  <v-container v-if="movies && movies.length">
    <v-row>
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard :movie="movie" @view-detail="handleDetail"></MovieCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import MovieCard from './MovieCard.vue';
const props = defineProps({
  movies: {
    type: Object,
    required: true,
  }
})

const emit = defineEmits(['select-movie'])
const handleDetail = (movie) => {
  emit('select-movie', movie);
}
</script>
