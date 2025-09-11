const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const createApiOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    }
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  return options;
};
/*
method：httpメソッド（GET,POSTなど）
headers:Json形式での通信を指定、Bearerトークンで認証
body:POSTなどで送信するbodyがある場合はJSON化して追加
*/

const handleApiResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};
/**
response.ok:レスポンスが200番台かどうかを確認
エラーの場合はエラーハンドリングをして、成功の場合はJSONを返す
 */

export const tmdbApi = {
  // 現在公開中の映画
  async getNowPlayingMovies(page = 1, region = 'JP', language = 'ja-JP') {
    const url = new URL(`${API_BASE_URL}/movie/now_playing`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('region', region);
    url.searchParams.set('language', language);

    const response = await fetch(url.toString(), createApiOptions());
    return handleApiResponse(response);
  },
  /*
  /movie/now_playing エンドポイントを使用
  ページ番号、地域、言語をクエリパラメータとして指定
  */

  // 人気の映画
  async getPopularMovies(page = 1, language = 'ja-JP', region = 'JP') {
    const url = new URL(`${API_BASE_URL}/movie/popular`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('language', language);
    url.searchParams.set('region', region);

    const response = await fetch(url.toString(), createApiOptions());
    return handleApiResponse(response);
  },
  /**
  /movie/popular エンドポイントを使用
  ページ番号、地域、言語をクエリパラメータとして指定
   */

  // レビューズ
  async getReviews(movieId, language = 'en-US', page = 1,) {
    const url = new URL(`${API_BASE_URL}/movie/${movieId}/reviews`);
    url.searchParams.set('language', language);
    url.searchParams.set('page', page.toString());
    const response = await fetch(url.toString(), createApiOptions());
    return handleApiResponse(response);
  },
  // fetch('https://api.themoviedb.org/3/movie/movie_id/reviews?language=en-US&page=1', options)

  // 公開予定の映画
  async getUpcomingMovies(page = 1, language = 'ja-JP', region = 'JP') {
    const url = new URL(`${API_BASE_URL}/movie/upcoming`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('language', language);
    url.searchParams.set('region', region);

    const response = await fetch(url.toString(), createApiOptions());
    return handleApiResponse(response)
  },
  /**
  /movie/upcoming エンドポイントを使用
  ページ番号、地域、言語をクエリパラメータとして指定
   */

  // 映画の詳細
  async getMovieDetails(movieId, language = 'ja-JP') {
    const url = `${API_BASE_URL}/movie/${movieId}?language=${language}`;
    const response = await fetch(url, createApiOptions());
    return handleApiResponse(response);
  },
  /**
  /movie/{movieId} エンドポイントを使用
  特定の映画の詳細を取得
   */

  // 映画検索メソッド
  async searchMovies({
    query,
    page = 1,
    year,
    include_adult = false,
    language = 'ja-JP',
    // フィルター用の追加パラメータ
    with_genres,
    'vote_average.gte': voteAverageGte,
    'vote_average.lte': voteAverageLte,
    primary_release_year
  } = {}) {
    const url = new URL(`${API_BASE_URL}/search/movie`);

    // 基本パラメータ
    url.searchParams.set('query', query);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('language', language);
    url.searchParams.set('include_adult', include_adult.toString());

    // オプショナルパラメータ
    if (year) {
      // search API は year と primary_release_year の両方を指定して精度を上げる
      url.searchParams.set('year', year.toString());
      url.searchParams.set('primary_release_year', year.toString());
    }
    if (primary_release_year) url.searchParams.set('primary_release_year', primary_release_year.toString());
    if (with_genres) url.searchParams.set('with_genres', with_genres);
    if (voteAverageGte) url.searchParams.set('vote_average.gte', voteAverageGte.toString());
    if (voteAverageLte) url.searchParams.set('vote_average.lte', voteAverageLte.toString());

    const response = await fetch(url.toString(), createApiOptions());
    const data = await handleApiResponse(response);
    // ジャンル情報が無い作品を除外（genre_ids または genres が空/未定義）
    const filteredByGenre = (data.results || []).filter((item) => {
      if (Array.isArray(item.genre_ids)) return item.genre_ids.length > 0;
      if (Array.isArray(item.genres)) return item.genres.length > 0;
      return false;
    });
    // 年指定がある場合はクライアント側でも厳密にフィルタ
    const strictlyFiltered = (year || primary_release_year)
      ? filteredByGenre.filter((item) => {
          const d = item.release_date;
          if (!d || typeof d !== 'string' || d.length < 4) return false;
          const y = parseInt(d.slice(0, 4), 10);
          const target = year || primary_release_year;
          return y === Number(target);
        })
      : filteredByGenre;
    return { ...data, results: strictlyFiltered };
  },

  // ジャンル一覧を取得するメソッド（フィルター用）
  async getGenres(language = 'ja-JP') {
    const url = new URL(`${API_BASE_URL}/genre/movie/list`);
    url.searchParams.set('language', language);

    const response = await fetch(url.toString(), createApiOptions());
    return handleApiResponse(response);
  },

  // 新たなジャンルを取得するＡＰＩ
  async discoverMovies({
    page = 1,
    include_adult = false,
    language = 'ja-JP',
    region = 'JP',
    with_genres,
    year,
    'vote_average.gte': voteAverageGte,
    'vote_average.lte': voteAverageLte,
    sort_by = 'popularity.desc'
  } = {}) {
    const url = new URL(`${API_BASE_URL}/discover/movie`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('include_adult', include_adult.toString());
    url.searchParams.set('language', language);
    url.searchParams.set('region', region);
    url.searchParams.set('sort_by', sort_by);

    if (with_genres) url.searchParams.set('with_genres', with_genres.toString());
    if (year) {
      // discover API は year ではなく primary_release_year を使う
      url.searchParams.set('primary_release_year', year.toString());
      // さらに日付レンジで絞る（厳密化）
      url.searchParams.set('primary_release_date.gte', `${year}-01-01`);
      url.searchParams.set('primary_release_date.lte', `${year}-12-31`);
    }
    if (voteAverageGte) url.searchParams.set('vote_average.gte', voteAverageGte.toString());
    if (voteAverageLte) url.searchParams.set('vote_average.lte', voteAverageLte.toString());

    const response = await fetch(url.toString(), createApiOptions());
    const data = await handleApiResponse(response);
    // ジャンル情報が無い作品を除外
    const filteredByGenre = (data.results || []).filter((item) => {
      if (Array.isArray(item.genre_ids)) return item.genre_ids.length > 0;
      if (Array.isArray(item.genres)) return item.genres.length > 0;
      return false;
    });
    // 年指定がある場合はクライアント側でも厳密にフィルタ
    const strictlyFiltered = year
      ? filteredByGenre.filter((item) => {
          const d = item.release_date;
          if (!d || typeof d !== 'string' || d.length < 4) return false;
          const y = parseInt(d.slice(0, 4), 10);
          return y === Number(year);
        })
      : filteredByGenre;
    return { ...data, results: strictlyFiltered };
  }
};
