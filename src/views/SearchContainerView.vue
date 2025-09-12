<template>
  <Header />
  <TopNavigation />
  <v-container fluid class="pa-4">
    <!-- 検索フォーム -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-form @submit.prevent="handleSearch">
          <v-row align="center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchQuery"
                label="映画を検索"
                placeholder="映画のタイトルを入力してください"
                prepend-icon="mdi-magnify"
                variant="outlined"
                clearable
                :loading="movieStore.loading.search"
                @keyup.enter="handleSearch"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                type="submit"
                color="primary"
                size="large"
                :loading="movieStore.loading.search"
                :disabled="!searchQuery?.trim() && !filters.genre && !filters.year && (filters.rating[0] === 0 && filters.rating[1] === 10)"
                block
              >
                <v-icon start>mdi-magnify</v-icon>
                検索
              </v-btn>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn variant="outlined" @click="toggleFilters" block>
                <v-icon start>mdi-filter</v-icon>
                フィルター
                <v-icon end>
                  {{ showFilters ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon
                >
              </v-btn>
            </v-col>
          </v-row>

          <!-- フィルター -->
          <v-expand-transition>
            <div v-show="showFilters">
              <v-divider class="my-4"></v-divider>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="filters.year"
                    label="公開年"
                    type="number"
                    variant="outlined"
                    :min="1900"
                    :max="new Date().getFullYear() + 5"
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="filters.genre"
                    :items="genreItems"
                    label="ジャンル"
                    variant="outlined"
                    clearable
                    :return-object="false"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-range-slider
                    v-model="filters.rating"
                    label="評価"
                    :min="0"
                    :max="10"
                    :step="0.1"
                    thumb-label="always"
                    class="mt-6"
                  />
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- 検索履歴 -->
    <v-card
      v-if="movieStore.recentSearchHistory.length > 0 && !movieStore.currentSearchQuery"
      class="mb-6"
      elevation="1"
    >
      <v-card-title class="text-h6">
        <v-icon start>mdi-history</v-icon>
        検索履歴
        <v-spacer></v-spacer>
        <v-btn
          size="small"
          variant="text"
          @click="movieStore.clearSearchHistory"
        >
          クリア
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-chip-group column>
          <v-chip
            v-for="query in movieStore.recentSearchHistory"
            :key="query"
            variant="outlined"
            closable
            @click="searchFromHistory(query)"
            @click:close="movieStore.removeFromSearchHistory(query)"
          >
            {{ query }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>

    <!-- 検索結果のヘッダー -->
    <div v-if="movieStore.currentSearchQuery" class="mb-4">
      <h2 class="text-h4 mb-2">
        「{{ movieStore.currentSearchQuery }}」の検索結果
      </h2>
      <p class="text-subtitle-1 text-medium-emphasis">
        {{ movieStore.searchResults.length }}件の映画が見つかりました
      </p>
      <v-btn variant="outlined" size="small" @click="clearSearch" class="mt-2">
        <v-icon start>mdi-close</v-icon>
        検索をクリア
      </v-btn>
    </div>

    <!-- エラー表示 -->
    <v-alert
      v-if="movieStore.errors.search"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="movieStore.errors.search = null"
    >
      {{ movieStore.errors.search }}
    </v-alert>

    <!-- 初回ローディング（結果がまだ無い時のみ表示） -->
    <div v-if="movieStore.loading.search && movieStore.searchResults.length === 0" class="text-center py-12">
      <v-progress-circular size="64" color="primary" indeterminate />
      <p class="text-h6 mt-4">検索中...</p>
    </div>

    <!-- 検索結果なし -->
    <v-card
      v-else-if="movieStore.currentSearchQuery && movieStore.searchResults.length === 0 && !movieStore.loading.search"
      class="text-center py-12"
    >
      <v-card-text>
        <v-icon size="64" color="grey">mdi-movie-search-outline</v-icon>
        <h3 class="text-h5 mt-4 mb-2">検索結果が見つかりません</h3>
        <p class="text-body-1 text-medium-emphasis">
          別のキーワードで検索してみてください
        </p>
      </v-card-text>
    </v-card>

    <!-- 検索結果の映画一覧（追加読み込み中も表示を維持） -->
    <v-row v-else-if="movieStore.searchResults.length > 0 || (movieStore.loading.search && movieStore.searchResults.length > 0)">
      <v-col
        v-for="movie in movieStore.searchResults"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard :movie="movie" @click="goToMovieDetail(movie.id)" />
      </v-col>
      <!-- 無限スクロール用のトリガー -->
      <v-col cols="12">
        <div ref="infiniteScrollTrigger"></div>
        <div v-if="movieStore.loading.search" class="text-center py-6">
          <v-progress-circular color="primary" indeterminate />
        </div>
        <div v-else-if="!movieStore.searchPagination.hasNextPage" class="text-center py-4 text-medium-emphasis">
          以上です
        </div>
      </v-col>
    </v-row>
    <!-- デフォルト状態（検索前） -->
    <v-card v-else class="text-center py-12">
      <v-card-text>
        <v-icon size="64" color="primary">mdi-movie-search</v-icon>
        <h3 class="text-h5 mt-4 mb-2">映画を検索してください</h3>
        <p class="text-body-1 text-medium-emphasis">
          上の検索フォームに映画のタイトルを入力してください
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import MovieCard from '@/components/movie/MovieCard.vue';
import { useMoviesStore } from '@/stores/movieStore';
import { onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { tmdbApi } from '../../api/tmdbApi';
import Header from '@/components/common/Header.vue';
import TopNavigation from '@/components/common/TopNavigation.vue';

const router = useRouter();
const movieStore = useMoviesStore();

// リアクティブデータ
const searchQuery = ref('');
const showFilters = ref(false);
const genreItems = ref([]);

// フィルター
const filters = reactive({
  year: null,
  genre: null,
  rating: [0, 10]
});

// 無限スクロール監視用
const infiniteScrollTrigger = ref(null);
let observer = null;

// メソッド
const handleSearch = async () => {
  const hasSearchQuery = searchQuery.value?.trim().length > 0;
  const hasFilters = filters.genre || filters.year || filters.rating[0] > 0 || filters.rating[1] < 10;
  if (!hasSearchQuery && !hasFilters) return;

  // if (!searchQuery.value?.trim() && !filters.genre && !filters.year ) return;
  // searchQueryが空で、ジャンルも選択されていない場合は何もしない
  try {
    const searchFilters = {};
    //
    if (filters.year) searchFilters.year = parseInt(filters.year);
    if (filters.genre) searchFilters.with_genres = filters.genre;
    if (filters.rating[0] > 0) searchFilters['vote_average.gte'] = filters.rating[0];
    if (filters.rating[1] < 10) searchFilters['vote_average.lte'] = filters.rating[1];

    if (hasSearchQuery) {
      // タイトル検索
      await movieStore.searchMovies(searchQuery.value, searchFilters, 1, false);
    } else {
      // ジャンル検索やフィルタのみ
      if (typeof movieStore.discoverMoviesForSearch === 'function') {
        await movieStore.discoverMoviesForSearch(searchFilters, 1, false);
      } else {
        // HMRの不整合などでアクションが未定義な場合のフォールバック
        const data = await tmdbApi.discoverMovies({ ...searchFilters, page: 1 });
        const filtered = movieStore.filterMovies(data.results || []);
        movieStore.searchResults = filtered;
        movieStore.currentSearchQuery = 'ジャンル検索';
        movieStore.searchPagination = {
          currentPage: data.page,
          totalPages: data.total_pages,
          hasNextPage: data.page < data.total_pages,
          mode: 'discover',
          lastQuery: '',
          lastFilters: { ...searchFilters }
        };
      }
    }
  } catch (error) {
    console.error('検索エラー:', error);
  }
};

const searchFromHistory = (query) => {
  searchQuery.value = query;
  handleSearch();
}

const clearSearch = () => {
  searchQuery.value = '';
  movieStore.clearSearchResults();
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const goToMovieDetail = (movieId) => {
  router.push({ name: 'MovieDetail', params: { id: movieId } });
};

// ジャンル一覧を取得
const loadGenres = async () => {
  try {
    const response = await tmdbApi.getGenres();
    genreItems.value = response.genres.map(genre => ({
      title: genre.name,
      value: genre.id
    }));
  } catch (error) {
    console.error('ジャンル取得エラー:', error);
  }
};

// URL　パラメータから検索クエリを取得
const initializeFromQuery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  if(query) {
    searchQuery.value = query;
    handleSearch();
  }
};

onMounted(() => {
  loadGenres();
  initializeFromQuery();
  // IntersectionObserver 設定
  observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      movieStore.loadMoreSearch();
    }
  }, {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
  });
  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value);
  }
});

// 要素が後から描画された場合にも監視を開始
watch(() => infiniteScrollTrigger.value, (el, prev) => {
  if (observer && el) observer.observe(el);
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<style lang="scss" scoped>
.v-chip {
  cursor: pointer;
}
</style>
