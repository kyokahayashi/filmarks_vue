import { defineStore } from 'pinia';
import { tmdbApi } from '../../api/tmdbApi';

export const useMoviesStore = defineStore("movie", {
  state: () => {
    return {
      // 各カテゴリの映画データ
      nowPlaying: [],
      popular: [],
      upcoming: [],
      // 単体の映画データ
      selectedMovie: null,

      // ローディング状態
      loading: {
        nowPlaying: false,
        popular: false,
        upcoming: false,
        movieDetails: false
      },

      // エラー状態
      errors: {
        nowPlaying: null,
        popular: null,
        upcoming: null,
        movieDetails: null
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
          this.nowPlaying = [...this.nowPlaying, ...data.results];
        } else {
          this.nowPlaying = data.results;
        };
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
          this.popular = [...this.popular, ...data.results];
        } else {
          this.popular = data.results;
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

    // 公開予定の映画を取得
    async fetchUpcomingMovies(page = 1, append = false) {
      this.loading.upcoming = true;
      this.errors.upcoming = null;

      try {
        const data = await tmdbApi.getUpcomingMovies(page);
        if (append) {
          this.upcoming = [...this.upcoming, ...data.results];
        } else {
          this.upcoming = data.results;
        }
        return data;
      } catch (error) {
        this.errors.upcoming = error.message;
        console.error('公開予定映画の取得に失敗:', error);
        throw error;
      } finally {
        this.loading.upcoming = false;
      }
    },


    // 映画の詳細を取得
    async fetchMovieDetail(movieId) {
      this.loading.movieDetails = true;
      this.errors.movieDetails = null;
      console.log('movieID', movieId)
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
    async search(query) {
      this.loading = true;
      try {
        this.movies = await searchMovies(query);
      } finally {
        this.loading = false;
      }
    },
  }
})
