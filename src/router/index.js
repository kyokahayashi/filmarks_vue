import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateReviewView from '@/views/CreateReviewView.vue'
import DetailView from '@/views/DetailView.vue'
import SignupView from '@/views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/reviewForm',
      name: 'ReviewForm',
      component: () => import("@/views/CreateReviewView.vue"),
    },
    {
      path: '/movie/:id',
      name: 'MovieDetail',
      component: () => import("@/views/DetailView.vue"),
      props: true
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/SearchContainerView.vue')
    },
    {
      path: '/popular',
      name: 'Popular',
      component: () => import('@/views/PopularView.vue')
    },
    {
      path: '/upcoming',
      name: 'Upcoming',
      component: () => import('@/views/UpcomingView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView
    }
  ],
})

export default router
