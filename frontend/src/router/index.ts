import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'
import SettingsView from '../views/SettingsView.vue'
import PeriodicSummaryView from '../views/PeriodicSummaryView.vue'
import DietometerView from '../views/DietometerView.vue'
import AboutView from '../views/AboutView.vue'
import PredictionView from '../views/PredictionView.vue'
import PatternsView from '../views/PatternsView.vue'
import ComparativeAnalysisView from '../views/ComparativeAnalysisView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { public: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: { public: true }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: UserManagementView,
    meta: { adminOnly: true }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView
  },
  {
    path: '/prediction',
    name: 'prediction',
    component: PredictionView
  },
  {
    path: '/patterns',
    name: 'patterns',
    component: PatternsView
  },
  {
    path: '/comparison',
    name: 'comparison',
    component: ComparativeAnalysisView
  },
  {
    path: '/dietometer',
    name: 'dietometer',
    component: DietometerView
  },
  {
    path: '/summary',
    name: 'summary',
    component: PeriodicSummaryView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  if (!auth.isAuthenticated && !to.meta.public) {
    next('/login')
  } else if (auth.isAuthenticated && to.meta.public) {
    next('/')
  } else if (to.meta.adminOnly && !auth.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
