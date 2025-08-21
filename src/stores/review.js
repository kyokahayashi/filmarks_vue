import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useReviewStore = defineStore('review', () => {
  // 前レビューを保持
  const reviews = ref([])
  // APIからレビュー一覧を取得
  const fetchReviews = async () => {
    try {
      const res = await axios.get('/data/reviews.json')
      reviews.value = res.data
    } catch (e) {
      console.error('レビューデータの取得に失敗しました：', e)
    }
  }
  // 特定の映画レビューだけ返す
  const getReviewByMovieId = (id) => {
    return reviews.value.filter((r) => r.movieId === Number(id))
  }
  // 新しいレビューを追加
  const addReview = (newReview) => {
    // idをユニークにする（本当はバックエンド側でやる）
    newReview.id = reviews.value.length + 1
    reviews.value.unshift(newReview) //先頭に追加（新着順）
  }

  // 新着レビュー（最新n件を返す.デフォルトは6件）
  const getLatestReviews = (count = 6) => {
    return reviews.value.slice(0, count)
  }
  return { reviews, fetchReviews, getReviewByMovieId, addReview, getLatestReviews }
})
