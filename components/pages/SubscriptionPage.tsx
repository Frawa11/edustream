
import React from 'react';
import Card from '../ui/Card';

const SubscriptionPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-2xl">
        <Card>
            <div className="p-8 sm:p-10 text-center">
                <h1 className="text-4xl font-bold text-text-primary mb-2">Conviértete en Premium</h1>
                <p className="text-text-secondary mb-8">Acceso ilimitado a todos nuestros videos educativos.</p>

                <div className="bg-background inline-block p-8 rounded-lg border border-primary/20">
                  <p className="text-5xl font-extrabold text-primary">20 PEN</p>
                  <p className="text-text-secondary font-medium">/ mes</p>
                </div>

                <div className="mt-10 text-left border-t border-surface pt-8">
                  <h2 className="text-2xl font-semibold text-text-primary mb-4">Instrucciones de Pago</h2>
                  <p className="text-text-secondary mb-6">
                    Para activar o renovar tu suscripción, por favor realiza el pago a través de Yape.
                  </p>
                  <div className="bg-surface p-4 rounded-lg space-y-2 border border-border">
                    <p className="text-lg"><span className="font-bold text-primary">Número de Yape:</span> <code className="text-xl text-white bg-background p-1 rounded">996001280</code></p>
                    <p className="text-lg"><span className="font-bold text-primary">Nombre:</span> Edic A. Amez Del Rio</p>
                  </div>
                  <p className="text-text-secondary mt-6 text-sm">
                    Una vez realizado el pago, envía una captura de pantalla junto con tu correo electrónico de registro a nuestro WhatsApp o correo de soporte. La activación es manual y puede tardar hasta 24 horas.
                  </p>
                </div>
            </div>
        </Card>
    </div>
  );
};

export default SubscriptionPage;