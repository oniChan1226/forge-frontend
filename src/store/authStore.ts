import { create } from 'zustand'

export interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, _password: string) => {
    set({ isLoading: true })
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })
      // const data = await response.json()
      
      // Mock implementation for demo
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      }
      
      localStorage.setItem('auth_token', 'mock_token_' + Date.now())
      localStorage.setItem('user', JSON.stringify(user))
      
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  signup: async (email: string, _password: string, name: string) => {
    set({ isLoading: true })
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name }),
      // })
      // const data = await response.json()
      
      // Mock implementation for demo
      const user: User = {
        id: '1',
        email,
        name,
      }
      
      localStorage.setItem('auth_token', 'mock_token_' + Date.now())
      localStorage.setItem('user', JSON.stringify(user))
      
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: user !== null })
  },

  checkAuth: async () => {
    try {
      // TODO: Replace with actual API call to verify token
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        const user = JSON.parse(userStr)
        set({ user, isAuthenticated: true, isLoading: false })
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
