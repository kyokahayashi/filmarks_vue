<template>
  <v-card class="pa-6">ログイン</v-card>
  <v-card-text>
    <v-text-field v-model="email" label="メールアドレス" />
    <v-text-field v-model="password" label="パスワード" type="password" />
    <v-btn block color="primary" @click="login">ログイン</v-btn>
  </v-card-text>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';


const email = ref("");
const password = ref("");
const authStore = useAuthStore();

const login = () => {
  authStore.login(email.value, password.value);
};
</script>

<style lang="scss" scoped></style>
