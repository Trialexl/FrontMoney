'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { 
  Wallet, 
  Plus, 
  Search, 
  Eye, 
  EyeOff,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react'
import apiClient from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

interface WalletData {
  id: string
  code?: string
  name?: string
  deleted: boolean
  hidden: boolean
  balance?: number
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadWallets()
  }, [])

  const loadWallets = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getWallets()
      setWallets(response.results || [])
    } catch (error) {
      console.error('Error loading wallets:', error)
      toast.error('Ошибка загрузки кошельков')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleWalletVisibility = async (walletId: string, currentHidden: boolean) => {
    try {
      await apiClient.patch(`/wallets/${walletId}/`, {
        hidden: !currentHidden
      })
      
      setWallets(prev => prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, hidden: !currentHidden }
          : wallet
      ))
      
      toast.success(
        currentHidden ? 'Кошелек показан' : 'Кошелек скрыт'
      )
    } catch (error) {
      console.error('Error toggling wallet visibility:', error)
      toast.error('Ошибка изменения видимости кошелька')
    }
  }

  const filteredWallets = wallets.filter(wallet =>
    !wallet.deleted &&
    (wallet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     wallet.code?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const visibleWallets = filteredWallets.filter(wallet => !wallet.hidden)
  const hiddenWallets = filteredWallets.filter(wallet => wallet.hidden)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Кошельки</h1>
            <p className="text-gray-600 mt-1">
              Управление вашими кошельками и счетами
            </p>
          </div>
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Добавить кошелек
          </Button>
        </div>

        {/* Search */}
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск кошельков..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <LoadingSpinner text="Загрузка кошельков..." />
          </Card>
        )}

        {/* Visible Wallets */}
        {!isLoading && visibleWallets.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Активные кошельки ({visibleWallets.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleWallets.map((wallet) => (
                <Card key={wallet.id} className="hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {wallet.name || 'Без названия'}
                        </h3>
                        {wallet.code && (
                          <p className="text-sm text-gray-500">
                            Код: {wallet.code}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWalletVisibility(wallet.id, wallet.hidden)}
                        className="p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Баланс:</span>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-success-600 mr-1" />
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(wallet.balance || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Hidden Wallets */}
        {!isLoading && hiddenWallets.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Скрытые кошельки ({hiddenWallets.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hiddenWallets.map((wallet) => (
                <Card key={wallet.id} className="opacity-60 hover:opacity-80 transition-opacity duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-600">
                          {wallet.name || 'Без названия'}
                        </h3>
                        {wallet.code && (
                          <p className="text-sm text-gray-400">
                            Код: {wallet.code}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWalletVisibility(wallet.id, wallet.hidden)}
                        className="p-1"
                      >
                        <EyeOff className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Баланс:</span>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-lg font-semibold text-gray-600">
                          {formatCurrency(wallet.balance || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredWallets.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Кошельки не найдены' : 'Нет кошельков'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Попробуйте изменить поисковый запрос'
                  : 'Создайте свой первый кошелек для начала работы'
                }
              </p>
              {!searchTerm && (
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать кошелек
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}