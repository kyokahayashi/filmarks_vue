import { defineStore } from 'pinia';
import { tmdbApi } from '../../api/tmdbApi';

export const useMoviesStore = defineStore("movie", {
  state: () => {
    return {
      // 各カテゴリの映画データ
      nowPlayingMovies: [],
      popularMovies: [],
      upcomingMovies: [],
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
        upcoming: false,
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
          this.nowPlayingMovies = [...this.nowPlayingMovies, ...data.results];
        } else {
          this.nowPlayingMovies = data.results;
        };
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

    // 公開予定の映画を取得
    async fetchUpcomingMovies(page = 1, append = false) {
      this.loading.upcoming = true;
      this.errors.upcoming = null;

      try {
        const data = await tmdbApi.getUpcomingMovies(page);
        if (append) {
          this.upcomingMovies = [...this.upcomingMovies, ...data.results];
        } else {
          this.upcomingMovies = data.results;
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
    // async loadPopular() {
    //   this.loading = true;
    //   this.error = null;
    //   try {
    //     const data = await fetchPopularMovies();
    //     this.movies = data.results;
    //   } catch (err) {
    //     this.error = "映画データの取得に失敗しました";
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async search(query) {
      this.loading = true;
      try {
        this.movies = await searchMovies(query);
      } finally {
        this.loading = false;
      }
    },
    // async loadMovieDetail(id) {
    //   this.loading = true;
    //   this.error = null;
    //   try {
    //     this.movie = await fetchMovieDetail(id);
    //   } catch (err) {
    //     this.error = "映画詳細の取得に失敗しました";
    //   } finally {
    //     this.loading = false;
    //   }
    // }
  }
})
