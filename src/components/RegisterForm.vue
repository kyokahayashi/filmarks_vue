<template>
  <Header />
  <TopNavigation />
  <v-container class="d-flex justify-center">
    <v-card class="pa-6" width="75%">
      <v-card-title>会員登録</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="email"
          label="メールアドレス"
          type="email"
          required
        />
        <v-text-field v-model="password" label="パスワード" required />
        <v-btn
          block
          color="primary"
          @click="signup"
          :loading="authStore.loading"
        >
          登録する
        </v-btn>
        <p class="text-red mt-2">
          {{ authStore.error }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
  <br /><br /><br />
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TopNavigation from './TopNavigation.vue';
import Header from './Header.vue';

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const signup = async () => {
  await authStore.register(email.value, password.value);
  if (!authStore.error) {
    router.push("/"); //登録成功したらトップへ
  }
}
</script>

<style lang="scss" scoped></style>
