<template>
  <v-container>
    <v-progress-circular v-if="movieStore.loading" indeterminate />
    <v-alert
      v-if="popularError"
      type="error"
      >{{ movieStore.popularError }}</v-alert
    >
    <h3>popular系</h3>
    <v-row>
      <v-col
        v-for="movie in movieStore.popularMovies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        @click="navigateToDetail(movie.id)"
      >
        <v-card>
          <v-img :src="getImageUrl(movie.poster_path)" />
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
    default: 'popularMovies'
  }
})

//  computedでリアクティブにデータを取得
const popularMovies = computed(() => movieStore.popularMovies);
const isLoadingPopular = computed(() => movieStore.loading.popular);
const popularError = computed(() => movieStore.errors.popular);

//　詳細ページへの遷移
const navigateToDetail = (movieId) => {
  router.push(`/movie/${movieId}`);
}

// TMDBの画像URLを生成
const getImageUrl = (posterPath) => {
  if(!posterPath) return'/placeholder-image.jpg';
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
}

// 画像読み込みエラー時の処理
const handleImageError = (event) => {
  event.target.src ='/placeholder-image.jpg';
};

onMounted(async () => {
  // 複数のデータを並行して取得
  await Promise.all([
    movieStore.fetchPopularMovies(),
  ]);
},
)
</script>
