const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmNjMzk4YzFlY2ZiZjk4ZTFmY2EzMzVlNWVkMTY2OSIsIm5iZiI6MTc1NTczOTg0MS43NTgwMDAxLCJzdWIiOiI2OGE2NzZjMTI1MzVkZTUzNmM1ZGQ3OTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ViYalzjIELrG1UKie4jqmdpCAGpWESjMNlApLu3RiBk'

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
  }
}
