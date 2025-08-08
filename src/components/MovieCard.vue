<template>
  <v-card class="ma-4" elevation="2" max-width="344">
    <v-img :src="movie.image" height="200px" cover></v-img>
    <v-card-title>{{ movie.title }}</v-card-title>
    <v-card-subtitle>{{ movie.year }}</v-card-subtitle>
    <v-card-text>
      {{ movie.description }}
    </v-card-text>
    <v-card-actions>
      <v-btn> 詳細を見る </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  }
})
console.log('movieCardのprops', props)
defineEmits(['view-detail'])
</script>

<style lang="scss" scoped></style>
