import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue';
import HomePage from '../views/HomePage.vue';
import SignInView from '../views/SignInView.vue';
import AppealView from '../views/AppealView.vue';
import AppealDetailView from '../views/AppealDetailView.vue';
import ReportView from '../views/ReportView.vue';
import VideoView from '../views/VideoView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInView
  },
  {
    path: '/appeal',
    name: 'Appeal',
    component: AppealView
  },
  {
    path: '/appeal-detail/:id',
    name: 'AppealDetail',
    component: AppealDetailView
  },
  {
    path: '/report',
    name: 'Report',
    component: ReportView
  },
  {
    path: '/video',
    name: 'Video',
    component: VideoView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
