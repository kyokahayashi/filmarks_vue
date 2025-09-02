<template>
  <v-container>
    <!-- ローディング状態 -->
    <v-row v-if="isLoading" justify="center">
      <v-col cols="auto">
        <v-progress-circular indeterminate color="primary" />
        <p class="text-center mt-2">レビューを読み込み中...</p>
      </v-col>
    </v-row>
    <!-- エラー状態 -->
    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>
    <!-- レビューコンテンツ -->
    <div v-if="!isLoading && !error">
      <v-row align="center" class="mb-4">
        <v-col>
          <h3 class="text-h5">レビュー</h3>
        </v-col>
        <v-col cols="auto">
          <v-chip
            v-if="reviews && reviews.length > 0"
            color="primary"
            variant="outlined"
          >
            {{ reviews.length }}件
          </v-chip>
        </v-col>
      </v-row>
      <!-- レビューが無い場合 -->
      <v-card v-if="!reviews || reviews.length === 0" class="text-center pa-8">
        <v-card-text>
          <v-icon size="48" color="grey-lighten-1" class="mb-4"
            >mdi-comment-outline</v-icon
          >
          <p class="text-h6 text-grey-darken-1">まだレビューがありません</p>
        </v-card-text>
      </v-card>
      <!-- レビューリスト -->
      <v-row v-else>
        <v-col
          v-for="review in reviews"
          :key="review.id"
          cols="12"
          class="mb-4"
        >
          <v-card elevation="2" class="review-card">
            <v-card-title class="d-flex align-center">
              <div>
                <div class="text-h6">{{ review.author }}</div>
                <div
                  v-if="review.created_at"
                  class="text-caption text-grey-darken-1"
                >
                  {{ formatDate(review.created_at) }}
                </div>
              </div>
              <v-spacer />
              <!-- レーティングがある場合 -->
              <v-chip
                v-if="review.author_details?.rating"
                color="yellow"
                variant="elevated"
                size="small"
              >
                <v-icon start>mdi-star</v-icon>
                {{ review.author_details.rating }}/10
              </v-chip>
            </v-card-title>

            <v-card-text>
              <!-- 長いレビューの場合は折りたたみ機能付き -->
              <div v-if="review.content && review.content.length > 300">
                <p
                  class="review-content"
                  :class="{ 'review-collapsed': !expandedReviews[review.id] }"
                >
                  {{ review.content }}
                </p>
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  @click="toggleReviewExpansion(review.id)"
                  class="mt-2"
                >
                  {{ expandedReviews[review.id] ? '折りたたむ' : 'もっと読む' }}
                  <v-icon end>
                    {{ expandedReviews[review.id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </v-btn>
              </div>
              <!-- 短いレビューはそのまま表示 -->
              <p v-else class="review-content">
                {{ review.content || 'レビュー内容がありません' }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useReviewStore } from '@/stores/reviewStore';
import { useRouter } from 'vue-router';

const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
})
const router = useRouter();
const reviewStore = useReviewStore();
const expandedReviews = ref({});
const reviews = computed(() => reviewStore.reviews)
const isLoading = computed(() => {
  if(typeof reviewStore.loading === 'object'){
    return reviewStore.loading ?? false;
  }
  console.log('ReviewListのloading２', reviewStore.loading)
  return reviewStore.loading;
});

const error = computed(() => {
  return reviewStore.error ? reviewStore.error : null;
})

// ユーティリティ関数
const formatDate = (dateString) => {
  if(!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP',{
    year:'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const toggleReviewExpansion = (reviewId) => {
  expandedReviews.value[reviewId] = !expandedReviews.value[reviewId];
}

const navigateToMovie = (movieId) => {
  router.push({name:'MovieDetail', params:{
    id:movieId
  }})
}

onMounted(async() => {
    await reviewStore.fetchMovieReviews(props.movieId);
    console.log('ReviewListのonMountedのreviews',reviews.value)
})
</script>

<style scoped>
.review-card {
  transition: transform 0.2s ease-in-out;
}
.review-card:hover {
  transform: translateY(-2px);
}

.review-content {
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.review-collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
