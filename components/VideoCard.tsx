
import React from 'react';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  hasAccess: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, hasAccess }) => {
  return (
    <div 
      onClick={onClick} 
      className="bg-surface rounded-lg overflow-hidden border border-border shadow-lg transition-all duration-300 ease-in-out cursor-pointer group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30"
    >
      <div className="relative">
        <img className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" src={video.thumbnailUrl} alt={video.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-16 h-16 text-primary drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
        </div>
        {!hasAccess && (
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 border border-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            <span>Requiere Suscripción</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-text-primary truncate transition-colors duration-300 group-hover:text-primary">{video.title}</h3>
        <p className="text-text-secondary mt-1 text-sm h-10 overflow-hidden line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoCard;