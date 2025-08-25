import { defineStore } from 'pinia';
import { fetchMovieDetail, fetchNowPlayMovies, fetchPopularMovies } from '../../api/tmdb';
import { tmdbApi } from '../../api/tmdbApi';

export const useMovieStore = defineStore("movie", {
  state: () => {
    return {
      // movies: [],
      nowPlayingMovies: [],
      popularMovies: [],
      // movie: null,
      // loading: false,
      loading: {
        nowPlaying: false,
        popular: false
      },

      errors: {
        nowPlaying: null,
        popular: null,
      }
    };
  },
  getters: {
    // 各カテゴリのローディング状態をチェック
    isAnyLoading: (state) => Object.values(state.loading).some(loading => loading),
    // エラーがあるかチェック
    hasAnyError: (state) => Object.values(state.errors).some(error => error !== null),
  },
  actions: {
    // 現在公開中の映画を取得
    async fetchNowPlayingMovies(page = 1, append = false) {
      this.loading.nowPlaying = true;
      this.errors.nowPlaying = null;

      try {
        const data = await tmdbApi.getNowPlayingMovies(page);

        if (append) {
          this.nowPlayingMovies = [...this.nowPlayingMovies, ...data.results];
        } else {
          this.nowPlayingMovies = data.results;
        }
        // this.pagination.nowPlaying = {
        //   currentPage: data.page,
        //   totalPages: data.total_pages,
        //   totalResults: data.total_results
        // };
        return data;
      } catch (error) {
        this.errors.nowPlaying = error.message;
        console.error('現在公開中の映画の取得に失敗:', error);
        throw error;
      } finally {
        this.loading.nowPlaying = false;
      }
    },

    // 人気の映画を取得
    async fetchPopularMovies(page = 1, append = false) {
      this.loading.popular = true;
      this.errors.popular = null;

      try {
        const data = await tmdbApi.getPopularMovies(page);

        if (append) {
          this.popularMovies = [...this.popularMovies, ...data.results];
        } else {
          this.popularMovies = data.results;
        }

        return data;
      } catch (error) {
        this.errors.popular = error.message;
        console.error('人気映画の取得に失敗:', error);
        throw error;
      } finally {
        this.loading.popular = false;
      }
    },

    // 映画の詳細を取得
    async fetchMovieDetail(movieId) {
      this.loading.movieDetails = true;
      this.errors.movieDetails = null;
      try {
        const data = await tmdbApi.getMovieDetails(movieId);
        this.selectedMovie = data;
        return data;
      } catch (error) {
        this.errors.movieDetails = error.message;
        console.error('映画詳細の取得に失敗:', error);
        throw error;
      } finally {
        this.loading.movieDetails = false;
      }
    },

    // ★★★★既存成功コード
    // async fetchNowPlayingMovies(page = 1) {
    //   this.loading = true;
    //   this.error = null;

    //   const options = {
    //     method: 'GET',
    //     headers: {
    //       accept: 'application/json',
    //       Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmNjMzk4YzFlY2ZiZjk4ZTFmY2EzMzVlNWVkMTY2OSIsIm5iZiI6MTc1NTczOTg0MS43NTgwMDAxLCJzdWIiOiI2OGE2NzZjMTI1MzVkZTUzNmM1ZGQ3OTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ViYalzjIELrG1UKie4jqmdpCAGpWESjMNlApLu3RiBk'
    //     }
    //   };

    //   try {
    //     const response = await fetch(
    //       `https://api.themoviedb.org/3/movie/now_playing?language=ja&page=${page}&region=JP`,
    //       options
    //     );

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     this.movies = data.results || [];
    //     return data;
    //   } catch (error) {
    //     this.error = error.message;
    //     console.error('映画データの取得に失敗しました:', error);
    //     throw error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async loadPopular() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchPopularMovies();
        this.movies = data.results;
      } catch (err) {
        this.error = "映画データの取得に失敗しました";
      } finally {
        this.loading = false;
      }
    },
    async search(query) {
      this.loading = true;
      try {
        this.movies = await searchMovies(query);
      } finally {
        this.loading = false;
      }
    },
    async loadMovieDetail(id) {
      this.loading = true;
      this.error = null;
      try {
        this.movie = await fetchMovieDetail(id);
      } catch (err) {
        this.error = "映画詳細の取得に失敗しました";
      } finally {
        this.loading = false;
      }
    }
  }
})


export const useMoviesStore = defineStore('movies', {
  state: () => ({
    nowPlayingMovies: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchNowPlayingMovies(page = 1) {
      this.loading = true;
      this.error = null;

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer YOUR_API_TOKEN_HERE'
        }
      };

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?language=ja&page=${page}&region=JP`,
          options
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.movies = data.results || [];
        return data;
      } catch (error) {
        this.error = error.message;
        console.error('映画データの取得に失敗しました:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
