import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lazy loading dei componenti per ottimizzare le dimensioni dei chunk
const HomeView = () => import('../views/HomeView.vue')
const LandingView = () => import('../views/LandingView.vue')
const CalendarView = () => import('../views/CalendarView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const PeriodicSummaryView = () => import('../views/PeriodicSummaryView.vue')
const DietometerView = () => import('../views/DietometerView.vue')
const PredictionView = () => import('../views/PredictionView.vue')
const PatternsView = () => import('../views/PatternsView.vue')
const ComparativeAnalysisView = () => import('../views/ComparativeAnalysisView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const UserManagementView = () => import('../views/UserManagementView.vue')
const ForgotPasswordView = () => import('../views/ForgotPasswordView.vue')
const ResetPasswordView = () => import('../views/ResetPasswordView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

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
    name: 'landing',
    component: LandingView,
    meta: { public: true }
  },
  {
    path: '/dashboard',
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
    component: CalendarView,
    meta: { requiresGluroo: true }
  },
  {
    path: '/prediction',
    name: 'prediction',
    component: PredictionView,
    meta: { requiresGluroo: true }
  },
  {
    path: '/patterns',
    name: 'patterns',
    component: PatternsView,
    meta: { requiresGluroo: true }
  },
  {
    path: '/comparison',
    name: 'comparison',
    component: ComparativeAnalysisView,
    meta: { requiresGluroo: true }
  },
  {
    path: '/dietometer',
    name: 'dietometer',
    component: DietometerView
  },
  {
    path: '/summary',
    name: 'summary',
    component: PeriodicSummaryView,
    meta: { requiresGluroo: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { public: true }
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
  } else if (auth.isAuthenticated && to.meta.public && to.name !== 'not-found') {
    next('/dashboard')
  } else if (to.meta.adminOnly && !auth.isAdmin) {
    next('/dashboard')
  } else if (to.meta.requiresGluroo && !auth.user?.gluroo?.link) {
    // Se la rotta richiede Gluroo e non è configurato, rimandiamo alla dashboard (che mostra l'alert)
    next('/dashboard')
  } else {
    next()
  }
})

export default router
