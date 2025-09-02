import { defineStore } from 'pinia';
import { tmdbApi } from '../../api/tmdbApi';


export const useReviewStore = defineStore("review", {
  state: () => ({
    reviews: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMovieReviews(movieId) {
      this.loading = true;
      this.error = null;
      try {
        const data = await tmdbApi.getReviews(movieId);
        console.log('レビュー', data)
        this.reviews = data.results
        return this.reviews;
      } catch (error) {
        this.error = error.message;
        console.error('レビューの取得に失敗:', error);
        throw error
      } finally {
        this.loading = false;
      }
    }
  }
})
