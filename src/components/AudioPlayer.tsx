
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
  showControls?: boolean;
}

const AudioPlayer = ({ 
  src, 
  autoPlay = true, 
  loop = true, 
  volume = 0.5,
  showControls = false 
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [audioVolume, setAudioVolume] = useState(volume);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
      
      if (isPlaying) {
        // Using a promise to handle autoplay restrictions
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Autoplay successful
            })
            .catch(error => {
              // Autoplay prevented by browser
              console.log("Autoplay prevented:", error);
              setIsPlaying(false);
            });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioVolume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setAudioVolume(newVolume);
  };

  return (
    <div className="audio-player">
      <audio 
        ref={audioRef} 
        src={src} 
        loop={loop}
        preload="auto"
      />
      
      {showControls && (
        <div className="audio-controls">
          <button onClick={togglePlay}>
            {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioVolume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
