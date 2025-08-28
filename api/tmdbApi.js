const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

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
  async getNowPlayingMovies(page = 1, region = 'JP', language = 'ja') {
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
  async getPopularMovies(page = 1, language = 'ja', region = 'JP') {
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

  // 公開予定の映画
  async getUpcomingMovies(page = 1, language = 'ja', region = 'JP') {
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
  async getMovieDetails(movieId, language = 'ja') {
    const url = `${API_BASE_URL}/movie/${movieId}?language=${language}`;
    const response = await fetch(url, createApiOptions());
    return handleApiResponse(response);
  }
  /**
  /movie/{movieId} エンドポイントを使用
  特定の映画の詳細を取得
   */
}
