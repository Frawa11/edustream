
import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import VideoPage from './components/pages/VideoPage';
import DashboardPage from './components/pages/DashboardPage';
import AdminPage from './components/pages/AdminPage';
import SubscriptionPage from './components/pages/SubscriptionPage';
import Navbar from './components/Navbar';
import type { Video } from './types';

const ImpersonationBanner: React.FC = () => {
    const { impersonatingUser, stopImpersonating } = useAuth();
    if (!impersonatingUser) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-background p-3 text-center z-50 flex justify-center items-center shadow-lg text-sm sm:text-base font-bold">
            <p className="mr-4">
                Estás viendo como <strong className="text-white">{impersonatingUser.email}</strong>.
            </p>
            <button onClick={stopImpersonating} className="bg-background text-primary py-1 px-3 rounded-md hover:bg-surface text-sm font-semibold transition-colors">
                Volver a Administrador
            </button>
        </div>
    );
};


const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const { currentUser, impersonatingUser } = useAuth();

    const navigate = useCallback((page: string) => {
        setCurrentPage(page);
    }, []);

    const handleSelectVideo = useCallback((video: Video) => {
        setSelectedVideo(video);
        setCurrentPage('video');
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onSelectVideo={handleSelectVideo} />;
            case 'login':
                return <LoginPage onNavigate={navigate} />;
            case 'register':
                return <RegisterPage onNavigate={navigate} />;
            case 'video':
                return selectedVideo ? <VideoPage video={selectedVideo} onNavigate={navigate} /> : <HomePage onSelectVideo={handleSelectVideo} />;
            case 'dashboard':
                return <DashboardPage onNavigate={navigate} />;
            case 'admin':
                return currentUser?.role === 'admin' ? <AdminPage onNavigate={navigate} /> : <HomePage onSelectVideo={handleSelectVideo} />;
            case 'subscription':
                return <SubscriptionPage />;
            default:
                return <HomePage onSelectVideo={handleSelectVideo} />;
        }
    };

    return (
        <div className="min-h-screen font-sans">
            <Navbar onNavigate={navigate} />
            <main className={`pt-20 ${impersonatingUser ? 'pb-20' : ''}`}>
                <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    {renderPage()}
                </div>
            </main>
            <ImpersonationBanner />
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;