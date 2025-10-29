
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

interface NavbarProps {
    onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
    const { currentUser, logout, realUser } = useAuth();
    
    const isAdmin = realUser?.role === 'admin';

    const handleLogout = () => {
        logout();
        onNavigate('home');
    };

    return (
        <header className="bg-background/80 backdrop-blur-md border-b border-surface fixed top-0 left-0 right-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={() => onNavigate('home')} className="text-text-primary font-bold text-2xl tracking-tight">
                           Edu<span className="text-primary">Stream</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        {currentUser ? (
                            <>
                                {isAdmin && (
                                     <Button variant="ghost" onClick={() => onNavigate('admin')}>Admin</Button>
                                )}
                                <Button variant="ghost" onClick={() => onNavigate('dashboard')}>Dashboard</Button>
                                <Button variant="outline" onClick={handleLogout}>Cerrar Sesión</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => onNavigate('login')}>Iniciar Sesión</Button>
                                <Button variant="primary" onClick={() => onNavigate('register')}>Registrarse</Button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;