<template>
  <v-container>
    <v-progress-circular v-if="movieStore.loading" indeterminate />
    <v-alert
      v-if="nowPlayingError"
      type="error"
      >{{ movieStore.nowPlayingError }}</v-alert
    >
    <h3>公開中の映画</h3>
    <v-row>
      <v-col
        v-for="movie in movieStore.nowPlayingMovies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        @click="navigateToDetail(movie.id)"
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
import { useMoviesStore } from '@/stores/movieStore';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const movieStore = useMoviesStore();

// propsで受け取る映画配列
const props = defineProps({
  movieType: {
    type: String,
    default: 'nowPlayingMovies'
  }
})

//  computedでリアクティブにデータを取得
const nowPlayingMovies = computed(() => movieStore.nowPlayingMovies);
const isLoadingNowPPlaying = computed(() => movieStore.nowPlayingMovies);
const nowPlayingError = computed(() => movieStore.errors.nowPlaying);

const navigateToDetail = (movieId) => {
  router.push(`/movie/${movieId}`);
}
onMounted(async () => {
  // 複数のデータを並行して取得
  await Promise.all([
    movieStore.fetchNowPlayingMovies()
  ]);
})
</script>
