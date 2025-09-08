<template>
  <!-- <v-container class="d-flex justify-center">
    <v-card class="pa-6" max-width="830">
      <v-card-text>
        <v-text-field
          v-model="email"
          label="メールアドレス"
          type="email"
          required
        />
        <v-text-field
          v-model="password"
          label="パスワード"
          type="password"
          required
        />
        <v-btn
          block
          color="primary"
          @click="signup"
          :loading="authStore.loading"
        >
          登録する
        </v-btn>
        <p v-if="authStore.error" class="text-red mt-2">
          {{ authStore.error }}
        </p>
      </v-card-text>
    </v-card>
  </v-container> -->
  <RegisterForm />
</template>

<script setup>
import RegisterForm from '@/components/RegisterForm.vue';
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const signup = async () => {
  await authStore.register(email.value, password.value );
  if (!authStore.register) {
    router.push("/"); //登録成功したらトップへ
  }
};
</script>

<style lang="scss" scoped></style>
