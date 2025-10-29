import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { login, sendPasswordReset } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await login(email, password);
      onNavigate('home');
    } catch (err: any) {
      setError(err.message || 'Correo o contraseña inválidos.');
    } finally {
        setLoading(false);
    }
  };
  
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setMessage('Se ha enviado un enlace para restablecer la contraseña a tu correo.');
    } catch (err: any)
{
      setError(err.message || 'No se pudo enviar el correo de restablecimiento.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-8 md:pt-16">
      <div className="w-full max-w-md">
        <Card>
            <div className="p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-text-primary">
                    {isResettingPassword ? 'Restablecer Contraseña' : 'Iniciar Sesión'}
                </h2>
                
                {isResettingPassword ? (
                     <form onSubmit={handleResetSubmit} className="space-y-6">
                      <p className="text-sm text-center text-text-secondary">
                        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                      </p>
                      <div>
                        <Input
                          id="email"
                          type="email"
                          label="Correo Electrónico"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                      {error && <p className="text-danger text-sm text-center">{error}</p>}
                      {message && <p className="text-success text-sm text-center">{message}</p>}
                      <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Enviar Enlace
                      </Button>
                       <p className="text-sm text-center text-text-secondary">
                        <button type="button" onClick={() => setIsResettingPassword(false)} className="font-medium text-primary hover:underline">
                          Volver a Iniciar Sesión
                        </button>
                      </p>
                    </form>
                ) : (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      <div>
                        <Input
                          id="email"
                          type="email"
                          label="Correo Electrónico"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Input
                          id="password"
                          type="password"
                          label="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div className="text-right">
                        <button type="button" onClick={() => setIsResettingPassword(true)} className="text-sm font-medium text-primary hover:underline">
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                      {error && <p className="text-danger text-sm text-center">{error}</p>}
                       <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Entrar
                      </Button>
                      <p className="text-sm text-center text-text-secondary">
                        ¿No tienes una cuenta?{' '}
                        <button type="button" onClick={() => onNavigate('register')} className="font-medium text-primary hover:underline">
                          Regístrate aquí
                        </button>
                      </p>
                    </form>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;