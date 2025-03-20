
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
  showControls?: boolean;
  className?: string;
  onError?: (error: Error) => void;
}

const AudioPlayer = ({ 
  src, 
  autoPlay = true, 
  loop = true, 
  volume = 0.5,
  showControls = false,
  className,
  onError
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [audioVolume, setAudioVolume] = useState(volume);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element
    const audio = new Audio(src);
    audioRef.current = audio;
    
    // Setup event listeners
    audio.addEventListener('canplaythrough', () => setAudioLoaded(true));
    audio.addEventListener('error', (e) => {
      console.error("Audio error:", e);
      if (onError) onError(new Error(`Failed to load audio: ${src}`));
    });
    
    // Configure audio
    audio.loop = loop;
    audio.volume = audioVolume;
    
    // Clean up on unmount
    return () => {
      audio.pause();
      audio.remove();
      audioRef.current = null;
    };
  }, [src, loop, onError]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !audioLoaded) return;
    
    audioRef.current.volume = audioVolume;
    
    if (isPlaying) {
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
  }, [isPlaying, audioVolume, audioLoaded]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setAudioVolume(newVolume);
  };

  if (!showControls) return null;

  return (
    <div className={cn("audio-player", className)}>
      <div className="audio-controls bg-black bg-opacity-10 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2">
        <button 
          onClick={togglePlay}
          className="text-white hover:text-temple-gold transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={audioVolume}
          onChange={handleVolumeChange}
          className="temple-volume-slider w-20"
          aria-label="Volume control"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
