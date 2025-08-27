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

const handleApiResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

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

  // 人気の映画
  async getPopularMovies(page = 1, language = 'ja', region = 'JP') {
    const url = new URL(`${API_BASE_URL}/movie/popular`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('language', language);
    url.searchParams.set('region', region);

    const response = await fetch(url.toString(), createApiOptions());
    return handleApiResponse(response);
  },

  // 公開予定の映画
  async getUpcomingMovies(page = 1, language = 'ja', region = 'JP') {
    const url = new URL(`${API_BASE_URL}/movie/upcoming`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('language', language);
    url.searchParams.set('region', region);

    const response = await fetch(url.toString(), createApiOptions());
    return handleApiResponse(response)
  },

  // 映画の詳細
  async getMovieDetails(movieId, language = 'ja') {
    const url = `${API_BASE_URL}/movie/${movieId}?language=${language}`;
    const response = await fetch(url, createApiOptions());
    return handleApiResponse(response);
  }
}
