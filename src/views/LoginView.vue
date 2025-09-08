<template>
  <Header />
  <TopNavigation />
  <v-container class="d-flex justify-center mt-6">
    <v-card class="pa-6" max-width="400">
      <v-card-title>ログイン</v-card-title>
      <v-card-text>
        <v-text-field v-model="email" label="メールアドレス" />
        <v-text-field v-model="password" label="パスワード" type="password" />
        <v-btn
          color="primary"
          block
          :loading="authStore.loading"
          @click="login"
        >
          ログイン
        </v-btn>
        <!-- エラー表示 -->
        <p v-if="authStore.error" class="text-red mt-2">
          メールアドレスまたはパスワードがことなります。
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import Header from '@/components/Header.vue';
import TopNavigation from '@/components/TopNavigation.vue';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';

const email = ref("");
const password = ref("");
const authStore = useAuthStore();

const login = async () => {
  await authStore.login(email.value, password.value);
  router.push('/')
};
</script>

<style lang="scss" scoped></style>
