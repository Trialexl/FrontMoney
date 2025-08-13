'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { Wallet, Lock, User } from 'lucide-react'

const loginSchema = z.object({
  username: z.string().min(1, 'Введите имя пользователя'),
  password: z.string().min(1, 'Введите пароль'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, isAuthenticated } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    console.log('Login page useEffect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading)
    
    if (isAuthenticated && !isLoading) {
      console.log('User is authenticated, redirecting to dashboard...')
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true)
    try {
      console.log('Submitting login form...')
      const success = await login(data.username, data.password)
      console.log('Login success:', success)
      
      if (success) {
        console.log('Redirecting to dashboard...')
        // Используем replace вместо push для предотвращения возврата на login
        router.replace('/dashboard')
      }
    } catch (error) {
      console.error('Login form error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Показываем загрузку если пользователь аутентифицирован но еще идет редирект
  if (isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Wallet className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Перенаправление...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DjangoLK Finance
          </h1>
          <p className="text-gray-600">
            Войдите в систему управления финансами
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                {...register('username')}
                label="Имя пользователя"
                placeholder="Введите имя пользователя"
                error={errors.username?.message}
                disabled={isSubmitting}
                autoComplete="username"
              />
            </div>

            <div>
              <Input
                {...register('password')}
                type="password"
                label="Пароль"
                placeholder="Введите пароль"
                error={errors.password?.message}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              <Lock className="w-4 h-4 mr-2" />
              Войти в систему
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Демо-доступ:
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p><span className="font-medium">Логин:</span> admin</p>
              <p><span className="font-medium">Пароль:</span> admin123</p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 DjangoLK Finance. Система управления личными финансами.
          </p>
        </div>
      </div>
    </div>
  )
}