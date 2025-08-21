<template>
  <v-container>
    <h2>レビュー一覧</h2>
    <v-alert v-if="!movieReviews.length" type="info"
      >まだレビュがありません</v-alert
    >
    <v-list v-else>
      <v-list-item v-for="review in movieReviews" :key="review.id">
        <v-list-item>
          <v-list-item-title> ★{{ review.rating }} /5 </v-list-item-title>
          <v-list-item-subtitle>
            {{ review.comment }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { useReviewStore } from '@/stores/review';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const reviewStore = useReviewStore()

onMounted(async() => {
  if(!reviewStore.reviews.length){
    await reviewStore.fetchReviews()
  }
})

const movieReviews = computed(() =>
reviewStore.getReviewByMovieId(Number(route.params.id)))
</script>

<style lang="scss" scoped></style>
