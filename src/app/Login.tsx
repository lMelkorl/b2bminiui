import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../lib/auth-context';
import { Gem, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setIsLoading(true);

    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-strong rounded-3xl shadow-2xl p-8 backdrop-blur-2xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-blue-600 dark:to-blue-700 rounded-2xl mb-4 shadow-lg">
              <Gem className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              Mücevherat B2B
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Elit yönetim paneline hoş geldiniz
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="glass-card rounded-2xl p-4 mb-6 border border-gray-300/30 dark:border-gray-700/30">
            <p className="text-sm text-gray-800 dark:text-gray-300 font-medium mb-2">
              Demo Giriş Bilgileri:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Email: <span className="font-mono font-semibold">admin@mucevherat.com</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Şifre: <span className="font-mono font-semibold">admin123</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="glass-card rounded-2xl border-red-300/50 dark:border-red-700/50 p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register('email', {
                required: 'Email adresi gereklidir',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Geçersiz email adresi',
                },
              })}
              label="Email Adresi"
              type="email"
              placeholder="ornek@email.com"
              error={errors.email?.message}
            />

            <Input
              {...register('password', {
                required: 'Şifre gereklidir',
                minLength: {
                  value: 6,
                  message: 'Şifre en az 6 karakter olmalıdır',
                },
              })}
              label="Şifre"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />

            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
