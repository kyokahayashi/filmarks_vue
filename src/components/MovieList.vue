<template>
  <v-container>
    <v-progress-circular v-if="isLoading" indeterminate />
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <h1 class="text-h3 text-primary mb-2">{{ title }}</h1>
    <v-row>
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          role="button"
          tabindex="0"
          @click="navigateToDetail(movie.id)"
          @keyup.enter="navigateToDetail(movie.id)"
        >
          <v-img
            :src="getImageUrl(movie.poster_path)"
            :alt="movie.title"
            @error="handleImageError"
            aspect-ratio="0.675"
          />
          <v-card-title>{{ movie.title }}</v-card-title>
          <v-card-text>{{ shortOverview(movie.overview) }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
/** v-container:
Vutifyのレスポンシブなラッパー。グリッド(v-row/v-col)と組み合わせてレイアウトを整える。
v-progress-ciercular:ローディング表示 v-alert v-if="popularError" type="error":
エラー表示。テンプレートはpopularError(computed)を条件にしているが、内部で表示しているのはmovieStore.popularError
v-row/v-col v-for="movie in movieStore.popularMovies"
v-forでムービー配列をループ。keyにmovie.id。cols="12" sm="6" md="4"
lg="3"レスポンシブ設定（モバイルは1列、タブレットは2列。デスクトップは4列）。クリックハンドラーがv-colについている
v-card内：v-img
画像表示。画像のエラー時ハンドリング関数（handleImageError）が定義されているがtemplateにバインドされていない(@errorなどがない)。またalt属性がないためスクリーンリーダーに不親切。
*/

<script setup>
/**
  useMoviesStore()でPiniaストアのインスタンス（リアクティブボブジェクト）を取得。テンプレート内でmovieStore.*を直接参照すれば自動的にリアクティブに再レンダリングされる。
 */
import { useMoviesStore } from '@/stores/movieStore';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  movieType: { type: String, default: 'popular' }
});
const router = useRouter();
const movieStore = useMoviesStore();

// propsで受け取る映画配列
/* propsでmovieTypeを受け取る設計。
しかしこのmovieTypeはコード内で実際には使われていない（将来的に汎用化したいが未完成）
 */


//  computedでリアクティブにデータを取得
// computedによってstoreから必要データを派生している
const movies = computed(() => {
  switch (props.movieType) {
    case 'nowPlaying' : return movieStore.nowPlaying;
    case 'upcoming' : return movieStore.upcoming;
    case 'popular':
    default: return movieStore.popular;
  }});

const isLoading = computed(() => {
  if(typeof movieStore.loading === 'object') {
    return movieStore.loading[props.movieType] ?? false;
  }
  return movieStore.loading;
});

const error = computed(() => {
  return movieStore.errors ? movieStore.errors[props.movieType] : null;
});

const title = computed(() => {
  return {
    popular: '人気作品',
    nowPlaying: '公開中の作品',
    upcoming: '公開予定'
  }[props.movieType] ?? 'Movies'
})


// const popularMovies = computed(() => movieStore.popularMovies);
// const isLoading = computed(() => movieStore.loading.popular);
// const error = computed(() => {return movieStore.errors.popular ? movieStore.errors.popular[props.movieType] : null;})

//　詳細ページへの遷移
// パス文字列で遷移。
const navigateToDetail = (movieId) => {
  /* router.push()でプログラム上でルート(ページ)を遷移するメソッド
   * ルート定義でname:'MovieDetail'として登録されたルートを指定
    params:{id:movieId}でルートの動的セグメント:idに対応するパラメータとして値を渡す*/
  router.push({name: 'MovieDetail', params:{
    id: movieId
  }})
}
const placeholder = '/placeholder-image.jpg';
const getImageUrl = (posterPath) => posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : placeholder;

// TMDBの画像URLを生成
/*TMDBの画像URLを組み立てる。w500はサイズオプションの１つ。
  ポスター画像のデータがなかったときはデフォルトの画像を表示させる*/
// const getImageUrl = (posterPath) => {
//   if(!posterPath) return'/placeholder-image.jpg';
//   return `https://image.tmdb.org/t/p/w500${posterPath}`;
// }

// 画像読み込みエラー時の処理
const handleImageError = (event) => {
  if (event?.target) event.target.src = placeholder;
};

const shortOverview = (text, n = 120) => {
  if (!text) return '';
  return text.length > n ? text.slice(0, n) + '...' : text;
};

onMounted(async () => {
  // props.movieTypeに応じて必要なデータのみ取得
  try{
    if (props.movieType === 'popular') await movieStore.fetchPopularMovies();
    else if (props.movieType === 'nowPlaying') await movieStore.fetchNowPlayingMovies();
    else if (props.movieType === 'upcoming') await movieStore.fetchUpcomingMovies();
  }catch(e) {
    //　エラーのログを残す
    console.error('fetch error', e);
  }
})
</script>
