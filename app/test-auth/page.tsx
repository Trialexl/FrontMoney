'use client'

import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore()
  const router = useRouter()

  const handleTestLogin = async () => {
    const success = await login('admin', 'admin123')
    console.log('Test login result:', success)
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleTestLogin} fullWidth>
              Test Login
            </Button>
            <Button onClick={handleGoToDashboard} variant="secondary" fullWidth>
              Go to Dashboard
            </Button>
            <Button onClick={logout} variant="danger" fullWidth>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}