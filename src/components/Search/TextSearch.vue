<template>
  <v-card class="search-card" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon color="primary" class="me-2">mdi-magnify</v-icon>
      <span class="text-h6">映画を検索</span>
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="handleSearch">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="searchQuery"
              label="映画のタイトルを入力してください"
              placeholder="例： アベンジャーズ"
              variant="outlined"
              density="comfortable"
              clearable
              :loading="isLoading"
              :disabled="isLoading"
              @keyup.enter="handleSearch"
              @click:clear="clearSearch"
            >
              <template #prepend-inner>
                <v-icon color="gray-darken-1">mdi-movie-search</v-icon>
              </template>
              <template #append-inner>
                <v-btn
                  v-if="searchQuery && searchQuery.length > 0"
                  variant="text"
                  size="small"
                  color="primary"
                  @click="handleSearch"
                  :loading="isLoading"
                  :disabled="isLoading || searchQuery.length < 2"
                >
                  検索
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <!-- 検索オプション -->
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="searchYear"
              :items="yearOptions"
              label="公開年（オプション）"
              variant="outlined"
              density="compact"
              clearable
              placeholder="すべての年"
            />
          </v-col>
          <v-col cols="12" md="6">
            <!-- <v-switch
              v-model="includeAdult"
              label="成人向けコンテンツを含む"
              color="primary"
              hide-details
              density="compact"
            /> -->
          </v-col>
        </v-row>

        <!-- 検索ボタン -->
        <v-row class="mt-2">
          <v-col cols="12">
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="isLoading"
              :disabled="!canSearch"
              variant="elevated"
            >
              <v-icon start>mdi-magnify</v-icon>
              {{ isLoading ? '検索中...' : '映画を検索' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <!-- 検索履歴 -->
      <v-row v-if="searchHistory.length > 0" class="mt-4">
        <v-col cols="12">
          <v-divider class="mb-3" />
          <p class="text-subtitle2 text-grey-darken-1 mb-2">
            <v-icon size="small" class="me-1">mdi-history</v-icon>
            最近の検索
          </p>
          <v-chip-group>
            <v-chip
              v-for="(term, index) in searchHistory"
              :key="index"
              variant="outlined"
              size="small"
              @click="selectFromHistory(term)"
              class="me-1 mb-1"
            >
              {{ term }}
            </v-chip>
          </v-chip-group>
          <v-btn
            variant="text"
            size="small"
            color="grey"
            @click="clearHistory"
            class="mt-1"
          >
            履歴をクリア
          </v-btn>
        </v-col>
      </v-row>

      <!-- エラー表示 -->
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mt-4"
        closable
        @click:close="error = null"
      >
        {{ error }}
      </v-alert>

      <!-- 検索結果のサマリー -->
      <v-row v-if="lastSearchResults" class="mt-4">
        <v-col cols="12">
          <v-divider class="mb-3" />
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="text-center"
          >
            <v-icon start>mdi-information</v-icon>
            「{{lastSearchQuery











            }}」の検索結果：{{ lastSearchResults.total_results }}件
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  loading:{
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'clear']);

// Reactive data
const searchQuery = ref('');
const searchYear = ref(null);
const includeAdult = ref(false);
const error = ref(null);
const searchHistory = ref(JSON.parse(localStorage.getItem('movieSearchHistory') || '[]'));
/** 1. localStorage.getItem('movieSearchHistory')
- ブラウザの Local Storage から、キーが 'movieSearchHistory' のデータを取得
- 返ってくるのは 文字列（例: "[\"映画A\",\"映画B\"]"）か、存在しなければ null
2. || '[]'
- もし getItem が null（データがない）なら、代わりに '[]'（空配列を表すJSON文字列）を使う
- これで JSON.parse が必ず動くようにしている
3. JSON.parse(...)
- JSON文字列 → JavaScriptの配列やオブジェクトに変換
- 例: "[\"映画A\",\"映画B\"]" → ["映画A", "映画B"]
4. ref(...)
- ref でラップして、リアクティブな変数にする.これにより、searchHistory.value を更新するとUIも自動で更新される*/
const lastSearchQuery = ref('');
const lastSearchResults = ref(null);

const isLoading = computed(() => props.loading);
const canSearch = computed(() => {
  return searchQuery.value && searchQuery.value.trim().length >= 2;
});
// searchQueryの値がtruthyかつtrim後の長さが2文字以上の場合はtruthを返す。そうでなければ、falseや''を返す。
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push({
      title: year.toString(),
      value: year
    });
  }
  return years;
});

const handleSearch = () => {
  if(!canSearch.value) {
    error.value = '検索するには2文字以上入力してください'
    return;
  }
  error.value = null;
  const trimmedQuery = searchQuery.value.trim();

  // 検索履歴に追加
  addToHistory(trimmedQuery);

  // 検索パラメータを構築
  const searchParams = {
    query: trimmedQuery,
    ...(searchYear.value && {year: searchYear.value}),
    include_adult: includeAdult.value
  };
  /**
  - query: trimmedQuery→ 常に query プロパティを追加し、その値は trimmedQuery。
  - ...(searchYear.value && { year: searchYear.value })
    - searchYear.value が falsy（例: null, undefined, 0, ''）なら → false を返し、スプレッド構文は何も展開しない（プロパティ追加なし）。
  - searchYear.value が truthy（例: 2025）なら → { year: searchYear.value } というオブジェクトを返し、それをスプレッド展開して year プロパティを追加。
  - include_adult: includeAdult.value
  - 常に include_adult プロパティを追加し、その値は includeAdult.value。*/

  lastSearchQuery.value = trimmedQuery;
  // 親コンポーネントに検索イベントを発行
  emit('search', searchParams);
};

const clearSearch = () => {
  searchQuery.value = '';
  searchYear.value =null;
  includeAdult.value = false;
  error.value = null;
  lastSearchQuery.value = '';
  lastSearchResults.value = null;
  emit('clear');
};

const addToHistory = (q) => {
  // 重複を除去
  const history = searchHistory.value.filter(item => item !== q);
  // 先頭に追加
  history.unshift(q);
  // 最大10件まで保持
  if (history.length > 10) {
    history.pop();
  }
  searchHistory.value = history;
  localStorage.setItem('movieSearchHistory', JSON.stringify(history));
};

const selectFromHistory = (term) => {
  searchQuery.value = term;
  handleSearch();
};

const clearHistory = () => {
searchHistory.value = [];
localStorage.removeItem('movieSearchHistory');
};

const updateSearchResults = (results) => {
  lastSearchResults.value = results;
};

// 検索結果を受け取るためのメソッドを外部に公開
defineExpose({
  updateSearchResults,
  clearSearch
});

// Watch for external loading state changes
watch(() => props.loading, (newVal) => {
  if (newVal) {
    error.value = null;
  }
});
</script>

<style lang="scss" scoped></style>
