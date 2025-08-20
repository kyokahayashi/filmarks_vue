<template>
  <div>
    <h2 class="text-h4 mb-4">新着レビュー</h2>
    <v-container>
      <v-row>
        <v-col v-for="review in latestReviews" :key="review" cols="12" md="4">
          <v-card class="ma-3" elevation="10" max-width="500" height="240">
            <v-card-title>🎞️{{ getMovieTitle(review.movieId) }}</v-card-title>
            <v-card-subtitle>★{{ review.rating }}</v-card-subtitle>
            <v-card-text>{{ review.comment }}</v-card-text>
            <v-card-text>{{ review.author }}</v-card-text>
            <v-card-actions>
              <small class="text-gray">
                {{ new Date(review.createdAt).toLocaleDateString() }}
              </small>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useMovieStore } from '@/stores/movieStore';
import { useReviewStore } from '@/stores/review';
import { computed, onMounted } from 'vue';

const reviewStore = useReviewStore()
const movieStore = useMovieStore()

onMounted(() => {
  reviewStore.fetchReviews()
})

// 新着レビューを取得（computedでリアクティブに保つ）
const latestReviews = computed(() => reviewStore.getLatestReviews())

// 各レビューに対応する映画タイトルを取得するヘルパー
const getMovieTitle = (movieId) => {
  const movie = movieStore.getMovieById(movieId)
  return movie ? movie.title : 'タイトル不明'
}
</script>

<style lang="scss" scoped></style>
