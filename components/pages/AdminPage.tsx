import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { User, Video } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { EditIcon, TrashIcon, ViewIcon, ActivateIcon, DeactivateIcon } from '../ui/Icons';

// Helper to format date to YYYY-MM-DD for input[type=date]
const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <Card>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-primary">{title}</h2>
                            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">&times;</button>
                        </div>
                        {children}
                    </div>
                </Card>
            </div>
        </div>
    );
};

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onActivate: (userId: string, startDate: Date, durationDays: number) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, user, onActivate }) => {
    const [startDate, setStartDate] = useState(formatDateForInput(new Date()));
    const [duration, setDuration] = useState(30);

    useEffect(() => {
        if (isOpen) {
            setStartDate(formatDateForInput(new Date()));
            setDuration(30);
        }
    }, [isOpen]);

    if (!user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const [year, month, day] = startDate.split('-').map(Number);
        const actualStartDate = new Date(year, month - 1, day);
        onActivate(user.id, actualStartDate, duration);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Activar para ${user.email}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="startDate" type="date" label="Fecha de Inicio" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                <Input id="duration" type="number" label="Duración (días)" value={duration.toString()} onChange={e => setDuration(parseInt(e.target.value, 10))} min="1" required />
                <div className="flex justify-end space-x-4 pt-4">
                    <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
                    <Button variant="success" type="submit">Activar</Button>
                </div>
            </form>
        </Modal>
    );
};


interface EditVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: Video | null;
    onSave: (videoId: string, updatedData: Partial<Omit<Video, 'id'>>) => void;
}

const EditVideoModal: React.FC<EditVideoModalProps> = ({ isOpen, onClose, video, onSave }) => {
    const [formData, setFormData] = useState({ title: '', description: '', gcsUrl: '', thumbnailUrl: '' });

    useEffect(() => {
        if (video) {
            setFormData({ title: video.title, description: video.description, gcsUrl: video.gcsUrl, thumbnailUrl: video.thumbnailUrl });
        }
    }, [video]);
    
    if (!video) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(video.id, formData);
        onClose();
    };

    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Editar Video">
             <form onSubmit={handleSubmit} className="space-y-4">
                 <Input id="title-edit" name="title" label="Título" type="text" value={formData.title} onChange={handleChange} />
                 <Input id="description-edit" name="description" label="Descripción" type="textarea" value={formData.description} onChange={handleChange} rows={3} />
                 <Input id="gcsUrl-edit" name="gcsUrl" label="URL del Video (GCS)" type="url" value={formData.gcsUrl} onChange={handleChange} />
                 <Input id="thumbnailUrl-edit" name="thumbnailUrl" label="URL de la Miniatura" type="url" value={formData.thumbnailUrl} onChange={handleChange} />
                <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="primary">Guardar Cambios</Button>
                </div>
            </form>
        </Modal>
    );
};

// Fix: Define AdminPageProps interface to resolve TypeScript error.
interface AdminPageProps {
    onNavigate: (page: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
    const { users, videos, updateSubscription, addVideo, editVideo, deleteVideo, deactivateSubscription, impersonateUser } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [gcsUrl, setGcsUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<Video | null>(null);

    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [activatingUser, setActivatingUser] = useState<User | null>(null);

    const handleAddVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !gcsUrl || !thumbnailUrl) {
            setMessage('Todos los campos son requeridos.');
            return;
        }
        setLoading(true);
        try {
            await addVideo({ title, description, gcsUrl, thumbnailUrl });
            setMessage('¡Video añadido con éxito!');
            setTitle(''); setDescription(''); setGcsUrl(''); setThumbnailUrl('');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error al añadir el video.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewAs = (userId: string) => {
        impersonateUser(userId);
        onNavigate('home');
    };
    
    const handleOpenEditModal = (video: Video) => {
        setEditingVideo(video); setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditingVideo(null); setIsEditModalOpen(false);
    };

    const handleSaveChanges = async (videoId: string, updatedData: Partial<Omit<Video, 'id'>>) => {
        await editVideo(videoId, updatedData);
    };
    
    const handleOpenSubModal = (user: User) => {
        setActivatingUser(user); setIsSubModalOpen(true);
    };
    
    const handleCloseSubModal = () => {
        setActivatingUser(null); setIsSubModalOpen(false);
    };
    
    const getSubscriptionStatusText = (user: User) => {
        if (user.subscriptionStatus === 'active' && user.subscriptionEndsAt) {
            const remainingDays = Math.ceil((user.subscriptionEndsAt - Date.now()) / (1000 * 60 * 60 * 24));
            if (remainingDays <= 0) return <span className="text-accent capitalize">Expirada</span>;
            return <span className="text-success">Activa ({remainingDays}d)</span>;
        }
        return <span className="capitalize">{user.subscriptionStatus}</span>;
    };


    return (
        <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl font-bold mb-8 text-text-primary">Panel de Administración</h1>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6 text-primary">Añadir Nuevo Video</h2>
                            <form onSubmit={handleAddVideo} className="space-y-4">
                                <Input id="title" label="Título" type="text" value={title} onChange={e => setTitle(e.target.value)} disabled={loading} />
                                <Input id="description" label="Descripción" type="textarea" value={description} onChange={e => setDescription(e.target.value)} rows={3} disabled={loading} />
                                <Input id="gcsUrl" label="URL del Video (GCS)" type="url" value={gcsUrl} onChange={e => setGcsUrl(e.target.value)} placeholder="https://..." disabled={loading} />
                                <Input id="thumbnailUrl" label="URL de la Miniatura" type="url" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="https://..." disabled={loading} />
                                <Button type="submit" variant="primary" fullWidth loading={loading} loadingText="Añadiendo...">Añadir Video</Button>
                                {message && <p className="text-success text-center mt-4 text-sm">{message}</p>}
                            </form>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                     <Card>
                        <div className="p-6">
                             <h2 className="text-2xl font-semibold mb-6 text-primary">Gestionar Usuarios</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-surface">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Correo</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Estado</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface">
                                        {users.filter(u => u.role !== 'admin').map((user: User) => (
                                            <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary truncate max-w-[150px]">{user.email}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{getSubscriptionStatusText(user)}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Button variant="icon" onClick={() => handleViewAs(user.id)} title="Ver como usuario"><ViewIcon /></Button>
                                                        {user.subscriptionStatus !== 'active' ? (
                                                            <Button variant="iconSuccess" onClick={() => handleOpenSubModal(user)} title="Activar suscripción"><ActivateIcon /></Button>
                                                        ) : (
                                                            <Button variant="iconAccent" onClick={() => deactivateSubscription(user.id)} title="Desactivar suscripción"><DeactivateIcon /></Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>
                    <div className="mt-8">
                        <Card>
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-6 text-primary">Gestionar Videos Existentes</h2>
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {videos.map(video => (
                                        <div key={video.id} className="flex items-center justify-between bg-surface p-3 rounded-md">
                                            <p className="text-sm text-text-primary truncate flex-1 mr-4">{video.title}</p>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="icon" onClick={() => handleOpenEditModal(video)} title="Editar video"><EditIcon /></Button>
                                                <Button variant="iconDanger" onClick={() => deleteVideo(video.id)} title="Eliminar video"><TrashIcon /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <EditVideoModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} video={editingVideo} onSave={handleSaveChanges} />
            <SubscriptionModal isOpen={isSubModalOpen} onClose={handleCloseSubModal} user={activatingUser} onActivate={updateSubscription} />
        </div>
    );
};

export default AdminPage;