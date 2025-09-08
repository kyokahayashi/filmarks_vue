<template>
  <Header />
  <TopNavigation />
  <v-container fluid class="pa-4">
    <!-- ページヘッダー -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="text-center">
          <h1 class="text-h3 text-primary mb-2">
            <v-icon size="large" class="me-3">mdi-movie-search</v-icon>
            映画検索
          </h1>
          <p class="text-h6 text-grey-darken-1">お気に入りの映画を見つけよう</p>
        </div>
      </v-col>
    </v-row>

    <!-- 検索コンポーネント -->
    <v-row class="mb-6">
      <v-col cols="12" lg="8" offset-lg="2">
        <TextSearch
          :loading="isLoading"
          @search="handleSearch"
          @clear="handleClear"
          ref="textSearchRef"
        />
        <!-- @searchは子コンポーネントからemitを受信 -->
      </v-col>
    </v-row>
    <!-- 検索結果セクション -->
    <v-row v-if="searchResults.length > 0 || hasSearched">
      <v-col cols="12">
        <!-- 結果ヘッダー -->
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5">
            <v-icon class="me-2">mdi-movie-roll</v-icon>
            検索結果
            <v-chip
              v-if="totalResults > 0"
              color="primary"
              variant="outlined"
              class="ms-3"
            >
              {{ totalResults }}件
            </v-chip>
          </h2>

          <!-- 表示形式切り替え -->
          <v-btn-toggle
            v-model="viewMode"
            variant="outlined"
            color="primary"
            mandatory
          >
            <v-btn value="grid" size="small">
              <v-icon>mdi-view-grid</v-icon>
            </v-btn>
            <v-btn value="list" size="small">
              <v-icon>mdi-view-list</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- 検索結果なしの場合 -->
        <v-card
          v-if="hasSearched && searchResults.length === 0 && !isLoading"
          class="text-center pa-8"
          elevation="2"
        >
          <v-icon size="64" color="grey-lighten-1" class="mb-4">
            mdi-movie-off-outline
          </v-icon>
          <h3 class="text-h6 mb-2">映画が見つかりませんでした</h3>
          <p class="text-grey-darken-1 mb-4">
            検索条件を変更してもう一度お試しください
          </p>
          <v-btn color="primary" @click="handleClear" variant="outlined">
            検索をリセット
          </v-btn>
        </v-card>

        <!-- グリッド表示 -->
        <v-row v-else-if="viewMode === 'grid'">
          <v-col
            v-for="movie in searchResults"
            :key="movie.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
          >
            <DetailView
              :movie="movie"
              @click="navigateToMovieDetail(movie.id)"
            />
          </v-col>
        </v-row>

        <!-- リスト表示 -->
        <v-card v-else-if="viewMode === 'list'" elevation="2">
          <v-list>
            <template v-for="(movie, index) in searchResults" :key="movie.id">
              <v-list-item
                @click="navigateToMovieDetail(movie.id)"
                class="movie-list-item"
              >
                <template #prepend>
                  <v-avatar size="80" rounded="lg" class="me-4">
                    <v-img
                      v-if="movie.poster_path"
                      :src="getImageUrl(movie.poster_path, 'w154')"
                      :alt="movie.title"
                      cover
                    />
                    <v-icon v-else size="40" color="grey">mdi-movie</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-h6 mb-1">
                  {{ movie.title }}
                  <v-chip
                    v-if="movie.release_date"
                    size="small"
                    variant="outlined"
                    color="primary"
                    class="ms-2"
                  >
                    {{ new Date(movie.release_date).getFullYear() }}
                  </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 mb-2">
                  {{ truncateText(movie.overview, 150) }}
                </v-list-item-subtitle>
                <template #append>
                  <div class="d-flex flex-column align-end">
                    <v-rating
                      v-if="movie.vote_average > 0"
                      :model-value="movie.vote_average / 2"
                      color="amber"
                      density="compact"
                      size="small"
                      readonly
                      half-increments
                      class="mb-1"
                    />
                    <v-chip size="small" color="success" variant="outlined">
                      {{ movie.vote_average?.toFixed(1) || 'N/A' }}
                    </v-chip>
                  </div>
                </template>
              </v-list-item>
              <v-divider v-if="index < searchResults.length - 1" />
            </template>
          </v-list>
        </v-card>

        <!-- ページネーション -->
        <v-row v-if="totalPages > 1" class="mt-6">
          <v-col cols="12" class="d-flex justify-center">
            <v-pagination
              v-model="currentPage"
              :length="Math.min(totalPages, 500)"
              :total-visible="7"
              @update:model-value="handlePageChange"
              color="primary"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- ローディング表示 -->
    <v-row v-if="isLoading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          class="mb-4"
        />
        <p class="text-h6">映画を検索しています</p>
      </v-col>
    </v-row>

    <!-- エラー表示 -->
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      closable
      class="mt-4"
      @click:close="error = null"
    >
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// import SearchResults from './SearchResults.vue';

import { tmdbApi } from './../../api/tmdbApi';
import { onMounted } from 'vue';
// import MovieCard from '../MovieCard.vue';
import DetailView from '@/views/DetailView.vue';
import TextSearch from '@/components/Search/TextSearch.vue';
import TopNavigation from '@/components/TopNavigation.vue';
import Header from '@/components/Header.vue';

const router = useRouter();

const isLoading = ref(false);
const error = ref(null);
const searchResults = ref([]);
const totalResults = ref(0);
const totalPages = ref(0);
const currentPage = ref(1);
const hasSearched = ref(false);
const viewMode = ref('grid');
const currentSearchParams = ref(null);
const textSearchRef = ref(null);

// 計算プロパティ
const hasResults = computed(() => searchResults.value.length > 0);

// メソッド
const handleSearch = async (searchParams) => {
  try {
    isLoading.value = true;
    error.value = null;
    currentPage.value = 1;
    currentSearchParams.value = searchParams;
    hasSearched.value = true;

    console.log('検索パラメータ:', searchParams);

    // TMDB APIで検索実行
    const response = await tmdbApi.searchMovies({
      query: searchParams.query,
      page: currentPage.value,
      ...(searchParams.year && { year:searchParams.year}),
      include_adult: searchParams.include_adult || false
    });
    searchResults.value = response.results || [];
    totalResults.value = response.total_results || 0;
    totalPages.value = response.total_pages || 0;

    // TextSearchコンポーネントに結果を通知
    if(textSearchRef.value) {
      textSearchRef.value.updateSearchResults(response)
    }
    console.log('検索結果:', response);
  } catch (err) {
    console.error('検索エラー:', err);
    error.value = '検索中にエラーが発生しました。もう一度お試しください。';
    searchResults.value = [];
    totalResults.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const handleClear = () => {
  searchResults.value = [];
  totalResults.value = 0;
  totalPages.value = 0;
  currentPage.value = 1;
  hasSearched.value = false;
  error.value = null;
  currentSearchParams.value = null;
};
const handlePageChange = async (page) => {
    if (!currentSearchParams.value) return;

    try {
      isLoading.value = true;
      error.value = null;

      const response = await tmdbApi.searchMovies({
        ...currentSearchParams.value,
        page: page
      });

      searchResults.value = response.results || [];
      currentPage.value = page;

      // ページトップにスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('ページ変更エラー:', err);
      error.value = 'ページの読み込み中にエラーが発生しました。';
    } finally {
      isLoading.value = false;
  }
};

const navigateToMovieDetail = (movieId) => {
  router.push({name: 'MovieDetail', params: {id: movieId}})
};

const getImageUrl = (path, size = 'w500') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// ページ読み込み時の処理
onMounted(() => {
  console.log('SearchContainer mounted');
});
</script>

<style lang="scss" scoped>
.movie-list-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.movie-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-pagination {
  margin-top: 2rem;
}
</style>
