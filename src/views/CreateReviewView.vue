<!-- CreateReviewView.vue -->
<template>
  <v-container>
    <v-form @submit.prevent="onsubmit">
      <v-text-field label="名前" v-model="review.name" />
      <v-text-field label="タイトル" v-model="review.title" />
      <v-textarea label="コンテンツ" v-model="review.content" />
      <v-select
        :items="['★★★★★','★★★★','★★★','★★','★']"
        label="評価"
        v-model="review.rating"
      />
      <v-btn type="submit">送信</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['review-submitted'])

const review = reactive({
  name: '',
  title: '',
  content: '',
  rating: null
})

const onsubmit = () => {
  if(review.name === '' || review.title === '' || review.content === '' || review.rating === null){
    alert('すべての項目を入力してください')
  }

  const movieReview = {
    name: review.name,
    title: review.title,
    content: review.content,
    rating: review.rating
  }
  emit('review-submitted', movieReview)

  review.name = ''
  review.title = ''
  review.content = ''
  review.rating = null

  console.log('送信完了')
}
</script>
<style lang="scss" scoped></style>
