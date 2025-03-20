
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import TempleBackground from '../components/TempleBackground';
import { 
  BellInteraction, 
  FlowerOffering, 
  PrayerInteraction,
  DonationButton,
  ExitButton,
  VolumeControl
} from '../components/DarshanElements';
import { toast } from '../components/ui/use-toast';

const Darshan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const govindaAudioRef = useRef<HTMLAudioElement | null>(null);
  const templeAmbienceRef = useRef<HTMLAudioElement | null>(null);
  
  // Control audio volume
  const setGlobalVolume = (vol: number) => {
    setVolume(vol);
    if (templeAmbienceRef.current) {
      templeAmbienceRef.current.volume = vol;
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (templeAmbienceRef.current) {
      templeAmbienceRef.current.muted = !isMuted;
    }
  };
  
  useEffect(() => {
    // Preload all audio and images
    const preloadAssets = async () => {
      try {
        // Create and preload audio elements
        templeAmbienceRef.current = new Audio('/assets/temple-ambience.mp3');
        templeAmbienceRef.current.loop = true;
        templeAmbienceRef.current.volume = volume;
        templeAmbienceRef.current.load();
        
        govindaAudioRef.current = new Audio('/assets/govinda-chant.mp3');
        govindaAudioRef.current.volume = 0.4;
        govindaAudioRef.current.load();
        
        // Start playing temple ambience
        if (templeAmbienceRef.current) {
          templeAmbienceRef.current.play().catch(err => {
            console.error("Temple ambience audio prevented:", err);
          });
        }
        
        // Load images with explicit src setting to ensure they load
        const imageUrls = [
          '/assets/temple-interior.jpg',
          '/assets/venkateswara-murti.png',
          '/assets/diya-animated.gif',
          '/assets/aarti-flame.png',
          '/assets/temple-archway.png'
        ];
        
        // Force image preloading
        await Promise.all(imageUrls.map(url => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => {
              console.error(`Failed to load image: ${url}`);
              resolve(false);
            };
            img.src = url;
          });
        }));
        
        // Simulate temple entrance transition with a slightly longer delay for immersion
        setTimeout(() => {
          setLoading(false);
          
          // Welcome toast
          setTimeout(() => {
            toast({
              title: "🙏 Om Namo Venkatesaya",
              description: "Take a deep breath and experience the divine presence",
              duration: 5000,
            });
          }, 1500);
        }, 3000);
        
        // Show controls after the user has some time to experience
        setTimeout(() => {
          setShowControls(true);
        }, 5000);
        
      } catch (error) {
        console.error("Failed to load assets:", error);
        setLoading(false); // Still allow entry even if some assets fail
      }
    };

    // Start loading assets
    preloadAssets();
    
    // Clean up on component unmount
    return () => {
      // Stop any playing audio
      if (templeAmbienceRef.current) {
        templeAmbienceRef.current.pause();
        templeAmbienceRef.current = null;
      }
      if (govindaAudioRef.current) {
        govindaAudioRef.current.pause();
        govindaAudioRef.current = null;
      }
    };
  }, [volume]);

  const playGovinda = () => {
    if (govindaAudioRef.current) {
      govindaAudioRef.current.volume = 0.4;
      govindaAudioRef.current.currentTime = 0;
      govindaAudioRef.current.play().catch(err => {
        console.error("Govinda audio prevented:", err);
      });
    }
  };

  const handlePray = () => {
    setIsGlowing(true);
    
    // Play prayer chant
    const prayerAudio = new Audio('/assets/prayer-chant.mp3');
    prayerAudio.volume = 0.6;
    prayerAudio.play().catch(err => {
      console.error("Prayer audio prevented:", err);
    });
    
    setTimeout(() => setIsGlowing(false), 4000);
  };

  const handleExit = () => {
    // Add transition before navigation
    document.body.classList.add('animate-fade-out');
    
    // Fade out audio
    if (templeAmbienceRef.current) {
      const fadeAudio = setInterval(() => {
        if (templeAmbienceRef.current && templeAmbienceRef.current.volume > 0.1) {
          templeAmbienceRef.current.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          if (templeAmbienceRef.current) templeAmbienceRef.current.pause();
        }
      }, 100);
    }
    
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
        <div className="relative w-28 h-28 mb-8">
          <img 
            src="/assets/diya-animated.gif" 
            alt="Sacred Diya" 
            className="w-full h-full object-contain animate-float"
          />
        </div>
        <p className="text-white text-xl animate-pulse-subtle font-semibold">
          Entering the Sacred Sanctum...
        </p>
        <p className="text-white text-opacity-70 mt-2 italic text-sm">
          "Om Namo Venkatesaya"
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-gradient-to-b from-[#120c02] to-[#1b0e01]">
      {/* Volume controls */}
      <VolumeControl
        volume={volume}
        setVolume={setGlobalVolume}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />
      
      {/* Temple ambient background */}
      <TempleBackground />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-8">
        {/* Temple Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-temple-gold text-2xl md:text-3xl lg:text-4xl font-semibold drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]">
            Tirupati Balaji Darshan
          </h1>
          <p className="text-white text-opacity-90 mt-2 italic max-w-md mx-auto text-sm sm:text-base">
            You are in the divine presence. Bow your head. Let the blessings flow.
          </p>
        </div>
        
        {/* Divine Archway */}
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-full">
            <img 
              src="/assets/temple-archway.png" 
              alt="Sacred archway" 
              className="w-full h-full object-contain opacity-75"
            />
          </div>
          
          {/* Murti container */}
          <div 
            className={`murti-container relative py-6 md:py-10 lg:py-12 animate-fade-in flex justify-center items-center ${isGlowing ? 'animate-glow-pulse' : ''}`}
            onMouseEnter={playGovinda}
          >
            <img 
              src="/assets/venkateswara-murti.png" 
              alt="Lord Venkateswara" 
              className={`w-auto max-w-full h-auto max-h-[45vh] sm:max-h-[50vh] md:max-h-[55vh] object-contain 
                filter drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] transition-all duration-300 ${isGlowing ? 'scale-105' : ''}`}
            />
            
            {/* Sacred aura - visible when praying */}
            <div className={`absolute inset-0 bg-gradient-to-b from-temple-gold to-temple-amber opacity-0 
              rounded-full blur-xl transition-opacity duration-1000 ${isGlowing ? 'opacity-20' : ''}`}></div>
            
            {/* Aarti flames */}
            <div className="absolute -left-4 sm:-left-8 md:-left-12 top-1/3 animate-flicker opacity-90">
              <img 
                src="/assets/aarti-flame.png" 
                alt="Aarti flame" 
                className="w-10 sm:w-12 md:w-16 h-auto"
              />
            </div>
            
            <div className="absolute -right-4 sm:-right-8 md:-right-12 top-1/3 animate-flicker opacity-90" style={{ animationDelay: '0.7s' }}>
              <img 
                src="/assets/aarti-flame.png" 
                alt="Aarti flame" 
                className="w-10 sm:w-12 md:w-16 h-auto"
              />
            </div>
            
            {/* Animated diyas */}
            <div className="absolute -bottom-2 left-1/4 w-10 h-10 sm:w-12 sm:h-12">
              <img src="/assets/diya-animated.gif" alt="Sacred diya" className="w-full h-full object-contain" />
            </div>
            
            <div className="absolute -bottom-2 right-1/4 w-10 h-10 sm:w-12 sm:h-12">
              <img src="/assets/diya-animated.gif" alt="Sacred diya" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        
        {/* Divine Interaction controls */}
        {showControls && (
          <div className="interaction-controls grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6 md:gap-8 mt-6 animate-slide-up">
            <BellInteraction />
            <FlowerOffering />
            <PrayerInteraction onPray={handlePray} />
            <DonationButton />
            <ExitButton onExit={handleExit} />
          </div>
        )}
      </div>
      
      {/* Footer with subtle instructions */}
      <div className="relative z-10 pb-4 text-center">
        <p className="text-white text-opacity-60 text-xs sm:text-sm">
          Take your time in the sacred presence. Feel the divine energy.
        </p>
      </div>
    </div>
  );
};

export default Darshan;
