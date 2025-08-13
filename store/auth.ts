import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/api'
import apiClient from '@/lib/api'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true })

        try {
          console.log('Attempting login...')
          const tokens = await apiClient.login(username, password)
          console.log('Tokens received:', !!tokens.access)

          apiClient.setTokens(tokens.access, tokens.refresh)

          // Загружаем профиль пользователя
          console.log('Loading user profile...')
          await get().loadUser()

          const currentState = get()
          console.log('Auth state after loadUser:', {
            isAuthenticated: currentState.isAuthenticated,
            hasUser: !!currentState.user
          })

          toast.success('Успешный вход в систему!')
          return true
        } catch (error: any) {
          console.error('Login error:', error)
          toast.error(error.response?.data?.detail || 'Ошибка входа в систему')
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        set({ isLoading: true })

        try {
          await apiClient.logout()
          toast.success('Вы успешно вышли из системы')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          apiClient.clearTokens()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      loadUser: async () => {
        if (!apiClient.isAuthenticated()) {
          console.log('No token found, setting unauthenticated')
          set({ isAuthenticated: false, user: null })
          return
        }

        set({ isLoading: true })

        try {
          console.log('Fetching user profile...')
          const userData = await apiClient.getProfile()
          console.log('User data received:', !!userData)

          set({
            user: userData,
            isAuthenticated: true
          })

          console.log('Auth state updated: authenticated =', true)
        } catch (error: any) {
          console.error('Load user error:', error)
          if (error.response?.status === 401) {
            apiClient.clearTokens()
            set({
              user: null,
              isAuthenticated: false
            })
          }
        } finally {
          set({ isLoading: false })
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)