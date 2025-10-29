
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Video } from '../../types';
import VideoPlayer from '../VideoPlayer';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface VideoPageProps {
  video: Video;
  onNavigate: (page: string) => void;
}

const AccessDeniedMessage: React.FC<{onNavigate: (page: string) => void}> = ({onNavigate}) => (
    <div className="max-w-2xl mx-auto mt-10">
        <Card>
            <div className="text-center p-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mt-4 mb-2">Contenido Exclusivo</h2>
                <p className="text-text-secondary mb-6">Este video es parte de nuestra biblioteca premium. Para acceder, necesitas una suscripción activa o estar en tu período de prueba.</p>
                <Button 
                    variant="primary"
                    onClick={() => onNavigate('dashboard')}
                >
                    Revisar mi Suscripción
                </Button>
            </div>
        </Card>
    </div>
);

const VideoPage: React.FC<VideoPageProps> = ({ video, onNavigate }) => {
    const { checkUserAccess } = useAuth();
    const hasAccess = checkUserAccess();

    return (
        <div className="container mx-auto">
            {hasAccess ? (
                <div>
                    <h1 className="text-4xl font-bold mb-4 text-text-primary">{video.title}</h1>
                    <VideoPlayer src={video.gcsUrl} title={video.title} />
                    <div className="mt-8">
                        <Card>
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-3 text-primary">Descripción</h2>
                                <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">{video.description}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <AccessDeniedMessage onNavigate={onNavigate} />
            )}
        </div>
    );
};

export default VideoPage;