import React from 'react';
import { useAuth } from '../../context/AuthContext';
import VideoCard from '../VideoCard';
import type { Video } from '../../types';

interface HomePageProps {
  onSelectVideo: (video: Video) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectVideo }) => {
  const { videos, checkUserAccess } = useAuth();
  const hasAccess = checkUserAccess();

  return (
    <div className="container mx-auto">
      <div className="text-center py-20 px-6 rounded-lg mb-16">
         <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-text-primary">
            Edu<span className="text-primary">Stream</span>: Ascenso Nivel Primaria
         </h1>
         <p className="text-lg text-text-secondary mb-8 max-w-3xl mx-auto">
            Tu plataforma de clases definitiva para la resolución de exámenes de ascenso de nivel primaria.
         </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {videos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => onSelectVideo(video)}
            hasAccess={hasAccess}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;