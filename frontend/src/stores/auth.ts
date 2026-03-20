import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE = (import.meta as any).env.VITE_API_BASE || '/api';

export interface User {
  id: number;
  username: string;
  email?: string;
  isAdmin: boolean;
  gluroo?: {
    link?: string;
    token?: string;
    header?: string;
  };
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => !!state.user?.isAdmin,
  },

  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post(`${API_BASE}/auth/login`, { username, password });
        this.token = data.token;
        this.refreshToken = data.refreshToken;
        this.user = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } catch (e: any) {
        this.error = e.response?.data?.error || 'Errore durante il login';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) return false;
      try {
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { 
          refreshToken: this.refreshToken 
        });
        this.token = data.token;
        localStorage.setItem('token', data.token);
        return true;
      } catch (e) {
        this.logout();
        return false;
      }
    },

    async register(username, password, email = '') {
      this.loading = true;
      this.error = null;
      try {
        await axios.post(`${API_BASE}/auth/register`, { username, password, email });
        return true;
      } catch (e: any) {
        if (e.response?.data?.details && Array.isArray(e.response.data.details)) {
          const detail = e.response.data.details[0];
          this.error = `${detail.path.join('.')}: ${detail.message}`;
        } else {
          this.error = e.response?.data?.error || 'Errore durante la registrazione';
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email: string) {
      this.loading = true;
      this.error = null;
      try {
        await axios.post(`${API_BASE}/auth/forgot-password`, { email });
        return true;
      } catch (e: any) {
        this.error = e.response?.data?.error || 'Errore invio email';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(token: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        await axios.post(`${API_BASE}/auth/reset-password`, { token, password });
        return true;
      } catch (e: any) {
        this.error = e.response?.data?.error || 'Errore ripristino password';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async updateAccount(data: { username: string, email?: string, password?: string, oldPassword?: string }) {
      this.loading = true;
      this.error = null;
      try {
        await axios.put(`${API_BASE}/auth/account`, data, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        if (this.user) {
          this.user.username = data.username;
          this.user.email = data.email;
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        return true;
      } catch (e: any) {
        if (e.response?.data?.code === 'TOKEN_EXPIRED') {
          const ok = await this.refreshAccessToken();
          if (ok) return await this.updateAccount(data);
        }
        this.error = e.response?.data?.error || 'Errore aggiornamento account';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        if (this.token) {
          await axios.post(`${API_BASE}/auth/logout`, 
            { refreshToken: this.refreshToken },
            { headers: { Authorization: `Bearer ${this.token}` } }
          );
        }
      } catch (e) {
        // Silently fail logout API call
      } finally {
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    },

    async fetchMe() {
      if (!this.token) return;
      try {
        const { data } = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.user = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (e: any) {
        if (e.response?.data?.code === 'TOKEN_EXPIRED') {
          const ok = await this.refreshAccessToken();
          if (ok) await this.fetchMe();
        } else if (e.response?.status === 401 || e.response?.status === 403) {
          this.logout();
        }
      }
    },

    async updateGluroo(gluroo) {
      try {
        await axios.put(`${API_BASE}/user/gluroo`, gluroo, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        if (this.user) {
          this.user.gluroo = gluroo;
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        return true;
      } catch (e: any) {
        if (e.response?.data?.code === 'TOKEN_EXPIRED') {
          const ok = await this.refreshAccessToken();
          if (ok) return await this.updateGluroo(gluroo);
        }
        this.error = e.response?.data?.error || 'Errore aggiornamento Gluroo';
        return false;
      }
    }
  },
});
