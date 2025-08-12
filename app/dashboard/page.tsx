'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3
} from 'lucide-react'
import apiClient from '@/lib/api'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface DashboardStats {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  walletsCount: number
  recentTransactions: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    walletsCount: 0,
    recentTransactions: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Загружаем данные параллельно
      const [wallets, receipts, expenditures] = await Promise.all([
        apiClient.getWallets(),
        apiClient.getReceipts({ limit: 10 }),
        apiClient.getExpenditures({ limit: 10 })
      ])

      // Подсчитываем статистику
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const monthlyIncome = receipts.results
        ?.filter((receipt: any) => {
          const receiptDate = new Date(receipt.date)
          return receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear
        })
        .reduce((sum: number, receipt: any) => sum + parseFloat(receipt.amount), 0) || 0

      const monthlyExpenses = expenditures.results
        ?.filter((expenditure: any) => {
          const expenditureDate = new Date(expenditure.date)
          return expenditureDate.getMonth() === currentMonth && expenditureDate.getFullYear() === currentYear
        })
        .reduce((sum: number, expenditure: any) => sum + parseFloat(expenditure.amount), 0) || 0

      // Объединяем последние транзакции
      const allTransactions = [
        ...(receipts.results?.slice(0, 5).map((r: any) => ({ ...r, type: 'receipt' })) || []),
        ...(expenditures.results?.slice(0, 5).map((e: any) => ({ ...e, type: 'expenditure' })) || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

      setStats({
        totalBalance: monthlyIncome - monthlyExpenses, // Упрощенный расчет
        monthlyIncome,
        monthlyExpenses,
        walletsCount: wallets.results?.length || 0,
        recentTransactions: allTransactions
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-gray-600 mt-1">
            Обзор ваших финансов на {format(new Date(), 'd MMMM yyyy', { locale: ru })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Общий баланс</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalBalance)}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary-50 rounded-bl-full opacity-50" />
          </Card>

          <Card className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Доходы за месяц</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlyIncome)}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-success-50 rounded-bl-full opacity-50" />
          </Card>

          <Card className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-danger-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Расходы за месяц</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlyExpenses)}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-danger-50 rounded-bl-full opacity-50" />
          </Card>

          <Card className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-warning-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Кошельки</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.walletsCount}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-warning-50 rounded-bl-full opacity-50" />
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Последние операции
              </h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : stats.recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {stats.recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'receipt' 
                          ? 'bg-success-100' 
                          : 'bg-danger-100'
                      }`}>
                        {transaction.type === 'receipt' ? (
                          <ArrowUpRight className="w-5 h-5 text-success-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-danger-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.type === 'receipt' ? 'Приход' : 'Расход'} #{transaction.number}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(transaction.date), 'd MMM, HH:mm', { locale: ru })}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      transaction.type === 'receipt' 
                        ? 'text-success-600' 
                        : 'text-danger-600'
                    }`}>
                      {transaction.type === 'receipt' ? '+' : '-'}
                      {formatCurrency(parseFloat(transaction.amount))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Нет операций</p>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Быстрые действия
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 group">
                <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                  Добавить приход
                </p>
              </button>
              
              <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-danger-300 hover:bg-danger-50 transition-colors duration-200 group">
                <TrendingDown className="w-8 h-8 text-gray-400 group-hover:text-danger-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-danger-700">
                  Добавить расход
                </p>
              </button>
              
              <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-warning-300 hover:bg-warning-50 transition-colors duration-200 group">
                <Wallet className="w-8 h-8 text-gray-400 group-hover:text-warning-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-warning-700">
                  Новый кошелек
                </p>
              </button>
              
              <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 group">
                <BarChart3 className="w-8 h-8 text-gray-400 group-hover:text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                  Аналитика
                </p>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}