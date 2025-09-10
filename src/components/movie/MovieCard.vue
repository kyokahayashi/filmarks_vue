<template>
  <v-card @click="$emit('click')" class="movie-card" hover>
    <v-img :src="posterUrl" :alt="props.movie?.title" height="370" cover>
      <template #placeholder>
        <v-icon size="64" color="grey">mdi-movie</v-icon>
      </template>
    </v-img>
    <v-card-title>{{ props.movie?.title }}</v-card-title>
    <v-card-subtitle>
      {{ props.movie?.release_date?.substring(0, 4) }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const posterUrl = computed(() => {
  return props.movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : '/no-image.png' // ローカルの代替画像
})
</script>

<style lang="scss" scoped></style>
