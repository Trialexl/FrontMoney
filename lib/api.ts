import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { AuthTokens, ApiResponse, ApiError } from '@/types/api'

class ApiClient {
  private client: AxiosInstance
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Interceptor для добавления токена
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`
      }
      return config
    })

    // Interceptor для обработки ошибок и обновления токена
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          if (this.refreshToken) {
            try {
              const response = await this.refreshAccessToken()
              this.setTokens(response.access, this.refreshToken)
              return this.client(originalRequest)
            } catch (refreshError) {
              this.clearTokens()
              window.location.href = '/auth/login'
              return Promise.reject(refreshError)
            }
          } else {
            this.clearTokens()
            window.location.href = '/auth/login'
          }
        }

        return Promise.reject(error)
      }
    )

    // Загружаем токены из localStorage при инициализации
    if (typeof window !== 'undefined') {
      this.loadTokensFromStorage()
    }
  }

  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem('access_token')
    this.refreshToken = localStorage.getItem('refresh_token')
  }

  private saveTokensToStorage() {
    if (this.accessToken) {
      localStorage.setItem('access_token', this.accessToken)
    }
    if (this.refreshToken) {
      localStorage.setItem('refresh_token', this.refreshToken)
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.saveTokensToStorage()
  }

  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<AuthTokens> {
    const response = await this.client.post<AuthTokens>('/auth/token/', {
      username,
      password,
    })
    return response.data
  }

  async refreshAccessToken(): Promise<{ access: string }> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await this.client.post<{ access: string }>('/auth/refresh/', {
      refresh: this.refreshToken,
    })
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout/')
    } finally {
      this.clearTokens()
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params })
    return response.data
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.client.post<T>(endpoint, data)
    return response.data
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.client.put<T>(endpoint, data)
    return response.data
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data)
    return response.data
  }

  async delete(endpoint: string): Promise<void> {
    await this.client.delete(endpoint)
  }

  // Specific API methods
  
  // Users
  async getProfile() {
    return this.get('/profile/')
  }

  // Справочники
  async getCashFlowItems(params?: any) {
    return this.get('/cash-flow-items/', params)
  }

  async getWallets(params?: any) {
    return this.get('/wallets/', params)
  }

  async getProjects(params?: any) {
    return this.get('/projects/', params)
  }

  // Финансовые операции
  async getReceipts(params?: any) {
    return this.get('/receipts/', params)
  }

  async createReceipt(data: any) {
    return this.post('/receipts/', data)
  }

  async updateReceipt(id: string, data: any) {
    return this.put(`/receipts/${id}/`, data)
  }

  async deleteReceipt(id: string) {
    return this.delete(`/receipts/${id}/`)
  }

  async getExpenditures(params?: any) {
    return this.get('/expenditures/', params)
  }

  async createExpenditure(data: any) {
    return this.post('/expenditures/', data)
  }

  async updateExpenditure(id: string, data: any) {
    return this.put(`/expenditures/${id}/`, data)
  }

  async deleteExpenditure(id: string) {
    return this.delete(`/expenditures/${id}/`)
  }

  async getTransfers(params?: any) {
    return this.get('/transfers/', params)
  }

  async createTransfer(data: any) {
    return this.post('/transfers/', data)
  }

  async updateTransfer(id: string, data: any) {
    return this.put(`/transfers/${id}/`, data)
  }

  async deleteTransfer(id: string) {
    return this.delete(`/transfers/${id}/`)
  }

  async getBudgets(params?: any) {
    return this.get('/budgets/', params)
  }

  async createBudget(data: any) {
    return this.post('/budgets/', data)
  }

  async updateBudget(id: string, data: any) {
    return this.put(`/budgets/${id}/`, data)
  }

  async deleteBudget(id: string) {
    return this.delete(`/budgets/${id}/`)
  }

  async getAutoPayments(params?: any) {
    return this.get('/auto-payments/', params)
  }

  async createAutoPayment(data: any) {
    return this.post('/auto-payments/', data)
  }

  async updateAutoPayment(id: string, data: any) {
    return this.put(`/auto-payments/${id}/`, data)
  }

  async deleteAutoPayment(id: string) {
    return this.delete(`/auto-payments/${id}/`)
  }

  // Custom endpoints
  async getCashFlowItemsHierarchy() {
    return this.get('/cash-flow-items/hierarchy/')
  }

  async getWalletBalance(id: string) {
    return this.get(`/wallets/${id}/balance/`)
  }
}

export const apiClient = new ApiClient()
export default apiClient