<template>
  <div v-if="movie">
    <h3>{{ movie.title }}</h3>
    <img :src="movie.image" alt="映画の画像" width="200" />
    <p>詳細：{{ movie.description }}</p>
    <p>監督：{{ movie.director }}</p>
    <p>公開年：{{ movie.year }}</p>
    <p>avg rating</p>
    <!-- ここにこの映画のレビューカードを入れたい -->
  </div>
  <div v-else>
    <p>読み込み中、または映画が見つかりません</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute()
const movieId = Number(route.params.id)
const movie = ref(null)


onMounted(async () => {
  try{
    const res = await axios.get('/movies.json')
  movie.value = res.data.find(m => m.id === movieId)
  } catch (error) {
    console.error('データ取得エラー：', error)
  }
})
</script>

<style lang="scss" scoped></style>
