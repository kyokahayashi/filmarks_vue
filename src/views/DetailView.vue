<template>
  <Header />
  <TopNavigation />
  <v-container>
    <!-- ローディング中 -->
    <div v-if="loading">
      <v-progress-circular indeterminate />
      <p>映画詳細を読み込み中．．．</p>
    </div>

    <!-- エラー状態 -->
    <v-alert v-else-if="error" type="error">
      {{ error }}
      <div class="mt-3">
        <v-btn @click="retry" color="primary">再試行</v-btn>
        <v-btn @click="goBack" color="secondary" class="ml-2">戻る</v-btn>
      </div>
    </v-alert>

    <!-- 映画詳細表示 -->
    <div v-else-if="movieDetail">
      <v-row>
        <v-col cols="12" md="4">
          <v-img
            :src="getImageUrl(movieDetail.poster_path)"
            :alt="movieDetail.title"
            height="600"
            cover
          />
        </v-col>
        <v-col cols="12" md="8">
          <div class="movie-info">
            <h1 class="text-h4 mb-4">{{ movieDetail.title }}</h1>
            <p
              class="text-subtitle-1 mb-2"
              v-if="movieDetail.original_title !== movieDetail.title"
            >
              原題：{{ movieDetail.original_title }}
            </p>
            <div class="movie-meta mb-4">
              <p>
                <strong>公開日：</strong
                >{{ formatDate(movieDetail.release_date) }}
              </p>
              <p><strong>上映時間：</strong>{{ movieDetail.runtime }}分</p>
              <p><strong>平均評価：</strong>{{ movieDetail.vote_average }}</p>
            </div>

            <!-- ジャンル -->

            <!-- あらすじ -->
            <div class="overview">
              <h3 class="text-h6 mb-2">あらすじ</h3>
              <p class="text-body-1">
                {{ movieDetail.overview || 'あらすじが登録されていません' }}
              </p>
            </div>

            <!-- アクションボタン -->
            <div class="actions mt-6">
              <v-btn
                @click="goBack"
                prependIcon="mdi-arrow-left"
                color="secondary"
              >
                戻る
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
      <ReviewList :movieId="movieId"></ReviewList>
    </div>
    <!-- データが存在しない場合 -->
    <div v-else class="no-data">
      <p>映画情報が見つかりませんでした</p>
      <v-btn @click="goBack" color="primary">戻る</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMoviesStore } from '@/stores/movieStore';
import ReviewList from '@/components/Review/ReviewList.vue';
import Header from '@/components/common/Header.vue';
import TopNavigation from '@/components/common/TopNavigation.vue';

const route = useRoute();
const router = useRouter();
const movieStore = useMoviesStore();

// 映画IDをルートパラメータから取得
const movieId = computed(() => Number(route.params.id));

// 現在表示中の映画詳細
const movieDetail = computed(() => movieStore.selectedMovie);
const loading = computed(() => movieStore.loading.movieDetails);
const error = computed(() => movieStore.errors.movieDetails);

// TMDBの画像URLを生成
const getImageUrl = (posterPath) => {
  if(!posterPath) return'/placeholder-image.jpg';
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
}

// 日付フォーマット関数
const formatDate = (dateString) => {
  if (!dateString) return '不明';
  try{
    return new Date(dateString).toLocaleDateString('ja-Jp', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch(error) {
    return dateString;
  }
};

// 映画詳細を取得
const fetchMovieDetails = async () => {
  const id = movieId.value
  if(!id || isNaN(id)) {
    console.error('無効な映画ID：', id);
    return;
  }
  try {
      console.log('映画詳細を取得中...', id);
      await movieStore.fetchMovieDetail(id);
    } catch (error){
      console.error('映画詳細の取得に失敗:', error);
    }
};

// 再試行
const retry = () => {
  fetchMovieDetails();
};

// 戻る
const goBack = () => {
  router.go(-1); //ブラウザの戻るボタンと同じ
}

// ルートパラメータが変更されたときに再取得
watch(movieId, (newId) => {
  if(newId && !isNaN(newId)){
  fetchMovieDetails();
  }
}, {immediate: true});

// コンポーネントマウント時の処理（必要に応じて）
// onMounted(async() => {
//   console.log('DetailView mounted, movieId:', movieId.value);
// })
</script>

<style scoped>
.movie-info{
  padding:20px 0
}
.movie-meta p{
  margin: 8px 0;
}
.overview{
  margin:20px 0;
}
.overview p{
  line-height: 1.6;
}
.actions{
  margin-top: 30px;
}
.no-data{
  text-align: center;
  padding: 40px;
}
</style>
