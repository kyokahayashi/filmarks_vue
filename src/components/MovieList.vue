<template>
  <v-container>
    <v-progress-circular v-if="movieStore.loading" indeterminate />
    <v-alert v-if="error" type="error">{{ movieStore.popularError }}</v-alert>
    <h3>公開中の映画</h3>
    <v-row>
      <v-col
        v-for="movie in movieStore.nowPlayingMovies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" />
          <v-card-title>{{ movie.title }}</v-card-title>
          <v-card-text>{{ movie.overview }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <h3>popular系</h3>
    <v-row>
      <v-col
        v-for="movie in movieStore.popularMovies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" />
          <v-card-title>{{ movie.title }}</v-card-title>
          <v-card-text>{{ movie.overview }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useMovieStore } from '@/stores/movieStore';
import { onMounted, computed } from 'vue';

const movieStore = useMovieStore();
//  computedでリアクティブにデータを取得
const popularMovies = computed(() => movieStore.popularMovies);
const isLoadingPopular = computed(() => movieStore.loading.popular);
const popularError = computed(() => movieStore.errors.popular);

const nowPlayingMovies = computed(() => movieStore.nowPlayingMovies);
const isLoadingNowPPlaying = computed(() => movieStore.nowPlayingMovies);
const nowPlayingError = computed(() => movieStore.errors.nowPlaying);
onMounted(async () => {
  // 複数のデータを並行して取得
  await Promise.all([
    movieStore.fetchPopularMovies(),
    movieStore.fetchNowPlayingMovies()
  ]);
})
</script>
