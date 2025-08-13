'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function SimpleLoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuthStore()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    console.log('=== SIMPLE LOGIN START ===')
    console.log('Current state:', { isAuthenticated, isLoading })
    
    try {
      const success = await login(username, password)
      console.log('Login result:', success)
      
      if (success) {
        console.log('Login successful, redirecting...')
        setTimeout(() => {
          router.replace('/dashboard')
        }, 1000) // Небольшая задержка для отладки
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Simple Login</h1>
        
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
          <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Login
          </Button>
        </form>
        
        <div className="mt-4 space-y-2">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="secondary"
            fullWidth
          >
            Go to Dashboard
          </Button>
          
          <Button
            onClick={() => router.push('/test-auth')}
            variant="ghost"
            fullWidth
          >
            Go to Test Page
          </Button>
        </div>
      </Card>
    </div>
  )
}