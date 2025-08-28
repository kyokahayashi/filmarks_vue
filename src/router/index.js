import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateReviewView from '@/views/CreateReviewView.vue'
import DetailView from '@/views/DetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/reviewForm',
      name: 'reviewForm',
      component: CreateReviewView,
    },
    {
      path: '/movie/:id',
      name: 'MovieDetail',
      component: () => import("@/views/DetailView.vue"),
      props: true
    }
  ],
})

export default router
