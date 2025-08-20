<template>
  <v-card class="ma-3" elevation="10" max-width="354" height="540px">
    <v-img :src="movie.image" height="350px" cover></v-img>
    <v-card-title>{{ movie.title }}</v-card-title>
    <v-card-subtitle>{{ movie.year }}</v-card-subtitle>
    <v-card-text>
      {{ movie.description }}
    </v-card-text>
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
</script>

<style lang="scss" scoped></style>
