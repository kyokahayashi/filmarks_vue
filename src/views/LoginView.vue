<template>
  <Header />
  <TopNavigation />
  <v-container class="d-flex justify-center mt-6">
    <v-card class="pa-6" width="75%">
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
      <v-card-text>
        <v-btn variant="text" block @click="resetPassword(email)" color="blue">
          パスワードを忘れましたか？
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
  <br /><br /><br />
</template>

<script setup>
import Header from '@/components/common/Header.vue';
import TopNavigation from '@/components/common/TopNavigation.vue';
import { auth } from '@/firebase/config';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref } from 'vue';

const email = ref("");
const password = ref("");
const authStore = useAuthStore();

const login = async () => {
  await authStore.login(email.value, password.value);
  router.push('/')
};

const resetPassword = async (email) => {
  if(!email) {
    alert("メールアドレスを入力してください")
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    alert("パスワードリセット用のメールを送信しました。")
  } catch (err) {
    alert ("エラー：" + err.message);
  }
}
</script>

<style lang="scss" scoped></style>
