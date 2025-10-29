
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusClasses = {
        active: 'bg-success/10 text-success',
        trial: 'bg-accent/10 text-accent',
        expired: 'bg-danger/10 text-danger',
        none: 'bg-secondary/20 text-text-secondary',
    };
    const textMap: { [key: string]: string } = {
        active: 'Activa',
        trial: 'Prueba',
        expired: 'Expirada',
        none: 'Ninguna',
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusClasses[status] || ''}`}>
            {status === 'active' && <span className="relative flex h-2 w-2 mr-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span></span>}
            {textMap[status]}
        </span>
    );
}

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-surface last:border-b-0">
        <p className="font-medium text-text-secondary">{label}</p>
        <div className="text-text-primary font-semibold">{children}</div>
    </div>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="container mx-auto text-center py-10">
        <p>Por favor, inicia sesión para ver tu dashboard.</p>
        <Button onClick={() => onNavigate('login')} variant="primary" className="mt-4">
            Iniciar Sesión
        </Button>
      </div>
    );
  }

  const getTrialTimeLeft = () => {
      if (currentUser.subscriptionStatus !== 'trial' || !currentUser.trialEndsAt) return '';
      const timeLeft = currentUser.trialEndsAt - Date.now();
      if (timeLeft <= 0) return 'Expirado';
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return `Quedan ${hours}h ${minutes}m`;
  };

  const getSubscriptionEndDate = () => {
    if (currentUser.subscriptionStatus !== 'active' || !currentUser.subscriptionEndsAt) return '';
    const endDate = new Date(currentUser.subscriptionEndsAt);
    return `Vence el ${endDate.toLocaleDateString()}`;
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-text-primary">Mi Dashboard</h1>
      <Card>
        <div className="p-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Información de la Cuenta</h2>
            <div className="space-y-2">
                <InfoRow label="Correo Electrónico">{currentUser.email}</InfoRow>
                <InfoRow label="Rol"><span className="capitalize">{currentUser.role}</span></InfoRow>
                 <InfoRow label="Estado de Suscripción">
                    <div className="flex items-center space-x-3">
                        <StatusBadge status={currentUser.subscriptionStatus} />
                         <p className="text-text-secondary text-sm">
                            {currentUser.subscriptionStatus === 'trial' && getTrialTimeLeft()}
                            {currentUser.subscriptionStatus === 'active' && currentUser.role !== 'admin' && getSubscriptionEndDate()}
                        </p>
                    </div>
                </InfoRow>
            </div>
        </div>
      </Card>
      
      {(currentUser.subscriptionStatus === 'expired' || currentUser.subscriptionStatus === 'none' || currentUser.subscriptionStatus === 'trial') && (
        <div className="mt-8">
            <Card>
                <div className="p-8 text-center">
                   {currentUser.subscriptionStatus === 'trial' ? (
                    <>
                        <h3 className="text-2xl font-bold text-text-primary">¡Disfruta tu período de prueba!</h3>
                        <p className="text-text-secondary mt-2 mb-6 max-w-xl mx-auto">Para mantener el acceso después de tu prueba y seguir aprendiendo con nosotros, considera suscribirte.</p>
                    </>
                   ) : (
                    <>
                        <h3 className="text-2xl font-bold text-text-primary">Tu acceso ha finalizado</h3>
                        <p className="text-text-secondary mt-2 mb-6 max-w-xl mx-auto">Renueva tu suscripción para continuar disfrutando de nuestro contenido exclusivo y seguir preparándote.</p>
                    </>
                   )}
                   <Button 
                      onClick={() => onNavigate('subscription')} 
                      variant="primary"
                    >
                      Ver Opciones de Suscripción
                    </Button>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;