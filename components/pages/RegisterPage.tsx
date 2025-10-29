import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        await register(email, password);
        onNavigate('home');
    } catch(err: any) {
        if (err.code === 'auth/email-already-in-use') {
            setError('Este correo electrónico ya está en uso.');
        } else {
            setError(err.message || 'Ocurrió un error al registrarse.');
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-8 md:pt-16">
      <div className="w-full max-w-md">
        <Card>
            <div className="p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-text-primary">Crear Cuenta</h2>
                <div className="bg-primary/10 border-l-4 border-primary text-primary px-4 py-3 text-center">
                    <p className="font-bold">¡Prueba gratuita de 24 horas!</p>
                    <p className="text-sm opacity-90">Acceso completo a todos los videos durante un día.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  {error && <p className="text-danger text-sm text-center">{error}</p>}
                  <Button type="submit" variant="primary" fullWidth loading={loading} loadingText="Creando cuenta...">
                    Registrarse
                  </Button>
                </form>
                 <p className="text-sm text-center text-text-secondary">
                    ¿Ya tienes una cuenta?{' '}
                    <button onClick={() => onNavigate('login')} className="font-medium text-primary hover:underline">
                      Inicia sesión aquí
                    </button>
                  </p>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;