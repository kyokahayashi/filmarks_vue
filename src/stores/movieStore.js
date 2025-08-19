import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useMovieStore = defineStore('movie', () => {
  const movies = ref([])

  const fetchMovies = async () => {
    try {
      const res = await axios.get('/data/movies.json')
      movies.value = res.data
    } catch (e) {
      console.error('映画データの取得に失敗しました：', e)
    }
  }
  const getMovieById = (id) => {
    return movies.value.find((m) => m.id === Number(id))
  }
  return { movies, fetchMovies, getMovieById }
})
