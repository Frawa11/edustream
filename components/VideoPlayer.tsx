
import React from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  const handleContextMenu = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
      <video
        className="w-full h-full"
        src={src}
        controls
        controlsList="nodownload"
        onContextMenu={handleContextMenu}
        title={title}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
