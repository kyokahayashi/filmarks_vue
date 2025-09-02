<template>
  <v-container>
    <v-progress-circular v-if="isLoading" indeterminate />
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <h3>レビュー</h3>
    <v-list>
      <v-list-item v-for="review in reviews" :key="review.id">
        <v-list-item>
          <v-list-item-title> {{ review.author }} </v-list-item-title>
          <v-list-item-subtitle>
            {{ review.content }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>

import { computed, onMounted } from 'vue';
import { useReviewStore } from '@/stores/reviewStore';
import { useRouter } from 'vue-router';

const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
})
const router = useRouter();
const reviewStore = useReviewStore();
const reviews = computed(() => reviewStore.reviews.results)
const isLoading = computed(() => {
  if(typeof reviewStore.loading === 'object'){
    return reviewStore.loading ?? false;
  }
  console.log('ReviewListのloading２', reviewStore.loading)
  return reviewStore.loading;
});

const error = computed(() => {
  return reviewStore.error ? reviewStore.error : null;
})

const navigateToMovie = (movieId) => {
  router.push({name:'MovieDetail', params:{
    id:movieId
  }})
}

onMounted(async() => {
    await reviewStore.fetchMovieReviews(props.movieId);
    console.log('ReviewListのonMountedのreviews',reviews.value)
})
</script>
