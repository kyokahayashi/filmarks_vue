<template>
  <div class="d-flex bg-surface-variant">
    <h3 class="ma-1 pa-2 me-auto">Filmarks</h3>
    <v-btn class="ma-2 pa-2" variant="tonal"> Filmarksの楽しみ方 </v-btn>
    <v-btn to="signup" class="ma-2 pa-2" variant="tonal"> 新規会員登録 </v-btn>
    <v-btn to="login" class="ma-2 pa-2" variant="tonal"> ログイン </v-btn>
    <v-btn v-if="authStore.user" @click="logout" class="ma-2 pa-2" text>
      ログアウト
    </v-btn>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push('/')
}
</script>
