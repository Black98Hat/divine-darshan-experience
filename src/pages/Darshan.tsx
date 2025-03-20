
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import { 
  BellInteraction, 
  FlowerOffering, 
  PrayerInteraction,
  DonationButton,
  ExitButton
} from '../components/DarshanElements';

const Darshan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const govindaAudioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Load assets and simulate temple entrance transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    // Show controls after the user has some time to experience
    const controlsTimer = setTimeout(() => {
      setShowControls(true);
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(controlsTimer);
    };
  }, []);

  const playGovinda = () => {
    if (govindaAudioRef.current) {
      govindaAudioRef.current.currentTime = 0;
      govindaAudioRef.current.play();
    }
  };

  const handlePray = () => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 3000);
  };

  const handleExit = () => {
    // Add transition before navigation
    document.body.classList.add('animate-fade-out');
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
        <p className="text-white text-xl animate-pulse-subtle">Entering the Sanctum...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-900">
      {/* Audio elements */}
      <AudioPlayer 
        src="/assets/temple-ambience.mp3"
        volume={0.4}
        showControls={false}
      />
      
      <audio ref={govindaAudioRef} src="/assets/govinda-chant.mp3" preload="auto" />
      
      {/* Temple interior background */}
      <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: 'url(/assets/temple-interior.jpg)' }}></div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-temple-gold text-2xl md:text-3xl font-semibold">
            Tirupati Balaji Darshan
          </h1>
          <p className="text-white text-opacity-80 mt-2 italic">
            You are here. Take a deep breath. Bow your head. Let the blessings flow.
          </p>
        </div>
        
        {/* Murti container */}
        <div 
          className={`murti-container relative mb-8 animate-fade-in ${isGlowing ? 'animate-glow-pulse' : ''}`}
          onMouseEnter={playGovinda}
        >
          <img 
            src="/assets/balaji-murti.png" 
            alt="Lord Venkateswara" 
            className={`max-w-full h-auto max-h-[50vh] object-contain filter drop-shadow-lg transition-all duration-300`}
          />
          
          {/* Aarti flames */}
          <div className="absolute top-1/4 -left-8 animate-flicker opacity-80">
            <img 
              src="/assets/aarti-flame.png" 
              alt="Aarti flame" 
              className="w-12 h-auto"
            />
          </div>
          
          <div className="absolute top-1/4 -right-8 animate-flicker opacity-80" style={{ animationDelay: '0.7s' }}>
            <img 
              src="/assets/aarti-flame.png" 
              alt="Aarti flame" 
              className="w-12 h-auto"
            />
          </div>
        </div>
        
        {/* Interaction controls */}
        {showControls && (
          <div className="interaction-controls grid grid-cols-5 gap-6 animate-fade-in">
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
        <p className="text-white text-opacity-50 text-sm">
          Take your time. The divine is present.
        </p>
      </div>
    </div>
  );
};

export default Darshan;
