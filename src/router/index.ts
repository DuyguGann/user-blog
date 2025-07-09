import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../pages/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: HomeView,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { breadcrumb: 'Anasayfa' }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/users/UserList.vue'),
        meta: { breadcrumb: 'Kullanıcılar' }
      },
      {
        path: 'users/:id',
        name: 'UserDetail',
        component: () => import('@/pages/users/UserDetail.vue'),
        meta: { breadcrumb: 'Kullanıcı Detay' }
      },
      {
        path: 'users/:id/post',
        name: 'post',
        component: () => import('@/pages/users/PostList.vue'),
        meta: { breadcrumb: 'Gönderiler' }
      },
      {
        path: 'users/:id/todo',
        name: 'UserTodo',
        component: () => import('@/pages/users/TodoList.vue'),
        meta: { breadcrumb: 'Yapılacaklar' }
      },
      {
        path: 'posts/:id/comments',
        name: 'postDetail',
        component: () => import('@/pages/users/PostDetail.vue'),
        meta: { breadcrumb: 'Yorumlar' }
      },
      {
        path: 'users/:id/gallery',
        name: 'gallery',
        component: () => import('@/pages/users/PhotoGallery.vue'),
        props: true,
        meta: { breadcrumb: 'Galeri' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
