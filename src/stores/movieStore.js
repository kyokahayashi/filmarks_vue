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

      // ページネーション情報
      pagination: {
        nowPlaying: {
          currentPage: 0,
          totalPages: 0,
          hasNextPage: true
        },
        popular: {
          currentPage: 0,
          totalPages: 0,
          hasNextPage: true
        },
        upcoming: {
          currentPage: 0,
          totalPages: 0,
          hasNextPage: true
        }
      },
      // ローディング状態
      loading: {
        nowPlaying: false,
        popular: false,
        upcoming: false,
        movieDetails: false,
      },

      // エラー状態
      errors: {
        nowPlaying: null,
        popular: null,
        upcoming: null,
        movieDetails: null,
      },
      // 除外するジャンルID（romance=10749）
      EXCLUDED_GENRE_IDS: [10749]
    };
  },
  getters: {
    // 各カテゴリのローディング状態をチェック
    isAnyLoading: (state) => Object.values(state.loading).some(loading => loading),
    // エラーがあるかチェック
    hasAnyError: (state) => Object.values(state.errors).some(error => error !== null),

    // 無限スクロール
    canLoadMore: (state) => (movieType) => {
      return state.pagination[movieType]?.hasNextPage && !state.loading[movieType];
    },
  },
  actions: {
    // ロマンス映画を除外するヘルパーメソッド
    filterMovies(movies) {
      return movies.filter(movie => {
        // アダルトコンテンツを除外
        if (movie.adult) return false;
        // genre_idsが存在し、除外外相のジャンルIDが含まれていないか確認
        if (movie.genre_ids && movie.genre_ids.length > 0) {
          // ロマンスジャンルが含まれていたら除外
          return !movie.genre_ids.some(genreId =>
            this.EXCLUDED_GENRE_IDS.includes(genreId)
          );
        }
        return true;
      });
    },

    // ページネーション情報を更新するヘルパーメソッド
    updatePagination(movieType, data) {
      this.pagination[movieType] = {
        currentPage: data.page,
        totalPages: data.total_pages,
        hasNextPage: data.page < data.total_pages
      };
    },

    // 無限スクロール用のロードメソッド(最大リトライ回数制限付き)
    async loadMoreMovies(movieType, maxRetries = 3) {
      if (!this.canLoadMore(movieType)) return;

      const nextPage = this.pagination[movieType].currentPage + 1;
      let retryCount = 0;

      const tryLoadPage = async (page) => {
        switch (movieType) {
          case 'nowPlaying':
            return await this.fetchNowPlayingMovies(page, true);
          case 'popular':
            return await this.fetchPopularMovies(page, true);
          case 'upcoming':
            return await this.fetchUpcomingMovies(page, true);
            fault:
            throw new Error(`不明なmovie Type: ${movieType}`);
        }
      };
      try {
        const result = await tryLoadPage(nextPage);
        return result;
      } catch (error) {
        // APIエラーの場合はリトライせず、そのまま投げる
        throw error;
      }
    },

    async fetchNowPlayingMovies(page = 1, append = false) {
      this.loading.nowPlaying = true;
      this.errors.nowPlaying = null;

      try {
        const data = await tmdbApi.getNowPlayingMovies(page);

        if (append) {
          // 新しく取得したデータをフィルタリングしてから追加
          const filteredMovies = this.filterMovies(data.results);
          // すでにあるthis.nowPlaying配列に新しく取得した、data.resultsをスプレット構文で配列
          this.nowPlaying = [...this.nowPlaying, ...filteredMovies];
        } else {
          // フィルタリングして設定
          this.nowPlaying = this.filterMovies(data.results);
        }
        // ページネーション情報を更新
        this.updatePagination('nowPlaying', data);
        // フィルタリンゴのデータを含むオブジェクトを返す
        return {
          ...data,
          results: this.nowPlaying
        };
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
          const filteredMovies = this.filterMovies(data.results);
          this.popular = [...this.popular, ...filteredMovies];
        } else {
          this.popular = this.filterMovies(data.results);
        }
        // ページネーション情報を更新
        this.updatePagination('popular', data);

        return {
          ...data,
          results: this.popular
        };
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
          const filteredMovies = this.filterMovies(data.results)
          this.upcoming = [...this.upcoming, ...filteredMovies];
        } else {
          this.upcoming = this.filterMovies(data.results);
        }

        // ページネーション情報を更新
        this.updatePagination('upcoming', data);
        return {
          ...data,
          results: this.upcoming
        };
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
        const results = await searchMovies(query);
        this.movies = await this.filterMovies(results);
      } finally {
        this.loading = false;
      }
    },

    // データをリセットするメソッド（必要に応じて）
    resetMovieData(movieType) {
      this[movieType] = [];
      this.pagination[movieType] = {
        currentPage: 0,
        totalPages: 0,
        hasNextPage: true
      };
      this.errors[movieType] = null;
    }
  },
})
