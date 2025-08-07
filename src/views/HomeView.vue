<template>
  <Header></Header>
  <main>
    <ul>
      <li v-for="review in reviews" :key="review.id">
        {{ review.title }} - ★{{ review.rating }} <br />
        {{ review.comment }}
      </li>
    </ul>
  </main>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Header from '@/components/Header.vue';

const reviews = ref([])

onMounted(async () => {
  const res = await axios.get('/reviews.json')
  reviews.value = res.data
})
</script>
