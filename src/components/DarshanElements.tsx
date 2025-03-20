import { useState, useEffect, useRef } from 'react';
import { Bell, Flower, Hand, Heart, X, Music, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

// Styled petal component for flower offering
interface PetalProps {
  style: React.CSSProperties;
}

const Petal = ({ style }: PetalProps) => {
  return <div className="petal" style={style} />;
};

// Flower emoji component
const FlowerEmoji = ({ emoji, style }: { emoji: string, style: React.CSSProperties }) => {
  return <div className="flower-emoji animate-float-slow" style={style}>{emoji}</div>;
};

// Temple Bell Interaction Component
export const BellInteraction = () => {
  const [isRinging, setIsRinging] = useState(false);
  const [ringCount, setRingCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Preload bell sound
    audioRef.current = new Audio('/assets/temple-bell.mp3');
    audioRef.current.load();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const ringBell = () => {
    if (isRinging) return;
    
    setIsRinging(true);
    setRingCount(prev => prev + 1);
    
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.error("Bell audio prevented:", err);
      });
    }
    
    // Bell vibration effect
    const body = document.querySelector('body');
    if (body) body.classList.add('bell-ringing');
    
    setTimeout(() => {
      setIsRinging(false);
      if (body) body.classList.remove('bell-ringing');
    }, 2000);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={ringBell}
        className={cn(
          "interaction-button relative flex items-center justify-center p-3 sm:p-4",
          "rounded-full bg-temple-cream border-2 border-temple-gold",
          "shadow-[0_0_15px_rgba(230,194,0,0.3)]",
          "transition-all duration-300",
          isRinging ? "animate-bell-ring" : ""
        )}
        disabled={isRinging}
        aria-label="Ring sacred bell"
      >
        <Bell 
          size={24} 
          className={cn(
            "text-temple-gold transition-all duration-300",
            isRinging ? "animate-pulse" : ""
          )} 
        />
        
        {/* Ripple effect on bell ring */}
        {isRinging && (
          <span className="absolute inset-0 rounded-full border-4 border-temple-gold animate-ripple"></span>
        )}
      </button>
      
      {/* Bell ring count - shows after several rings */}
      {ringCount > 3 && (
        <div className="absolute -top-2 -right-2 bg-temple-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {ringCount}
        </div>
      )}
      
      <span className="block text-xs mt-2 text-center font-medium text-temple-red opacity-90">
        Ring Bell
      </span>
    </div>
  );
};

// Flower Offering Component
export const FlowerOffering = () => {
  const [flowerEmojis, setFlowerEmojis] = useState<Array<{emoji: string, style: React.CSSProperties}>>([]);
  const [offeringCount, setOfferingCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Preload flower offering sound
    audioRef.current = new Audio('/assets/flower-offering.mp3');
    audioRef.current.load();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const offerFlowers = () => {
    setOfferingCount(prev => prev + 1);
    
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.error("Flower audio prevented:", err);
      });
    }
    
    // Create different flower emojis with randomized positions
    const flowerEmojiOptions = ['🌺', '🌸', '🌹', '🪷', '🌻', '🌼', '💐', '🌷'];
    
    const newEmojis = [...Array(12)].map(() => ({
      emoji: flowerEmojiOptions[Math.floor(Math.random() * flowerEmojiOptions.length)],
      style: {
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 40 + 30}%`,
        animationDelay: `${Math.random() * 0.5}s`,
        transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`,
        opacity: 1,
        fontSize: `${Math.random() * 12 + 16}px`,
        position: 'absolute',
        zIndex: 30,
        pointerEvents: 'none',
      } as React.CSSProperties,
    }));
    
    setFlowerEmojis([...flowerEmojis, ...newEmojis]);
    
    // Clean up emojis after animation completes
    setTimeout(() => {
      setFlowerEmojis(prev => prev.slice(newEmojis.length));
    }, 5000);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={offerFlowers}
        className={cn(
          "interaction-button flex items-center justify-center p-3 sm:p-4", 
          "rounded-full bg-temple-cream border-2 border-temple-gold",
          "shadow-[0_0_15px_rgba(230,194,0,0.3)]"
        )}
        aria-label="Offer flowers"
      >
        <Flower size={24} className="text-temple-saffron" />
      </button>
      
      {/* Show blessing after multiple offerings */}
      {offeringCount > 3 && (
        <div className="absolute -top-3 -left-2 bg-temple-gold text-white text-[10px] px-2 py-0.5 rounded-full animate-fade-in">
          Blessed
        </div>
      )}
      
      <span className="block text-xs mt-2 text-center font-medium text-temple-red opacity-90">
        Offer Flowers
      </span>
      
      {/* Flower emojis animation */}
      {flowerEmojis.map((item, index) => (
        <FlowerEmoji key={index} emoji={item.emoji} style={item.style} />
      ))}
    </div>
  );
};

// Prayer Component
export const PrayerInteraction = ({ onPray }: { onPray: () => void }) => {
  const [isPraying, setIsPraying] = useState(false);
  const [prayerCount, setPrayerCount] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const startPrayer = () => {
    if (isPraying) return;
    
    setIsPraying(true);
    setPrayerCount(prev => prev + 1);
    onPray();
    
    timeoutRef.current = window.setTimeout(() => {
      setIsPraying(false);
    }, 4000);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={startPrayer}
        className={cn(
          "interaction-button flex items-center justify-center p-3 sm:p-4",
          "rounded-full border-2 transition-all duration-500",
          isPraying 
            ? "bg-temple-gold border-temple-red shadow-[0_0_20px_rgba(230,194,0,0.5)]" 
            : "bg-temple-cream border-temple-gold shadow-[0_0_15px_rgba(230,194,0,0.3)]"
        )}
        disabled={isPraying}
        aria-label="Pray to Lord Venkateswara"
      >
        <Hand size={24} className={cn(
          "transition-all duration-300",
          isPraying ? "text-white" : "text-temple-red"
        )} />
        
        {/* Prayer aura effect */}
        {isPraying && (
          <span className="absolute inset-0 rounded-full border border-temple-gold animate-ping opacity-60"></span>
        )}
      </button>
      
      {/* Prayer blessing indicator */}
      {prayerCount > 2 && (
        <div className="absolute -top-3 right-0 text-temple-gold text-xs font-semibold drop-shadow-md animate-float-slow">
          🙏
        </div>
      )}
      
      <span className="block text-xs mt-2 text-center font-medium text-temple-red opacity-90">
        Pray
      </span>
    </div>
  );
};

// Donation Component
export const DonationButton = () => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <div className="relative">
        <button 
          onClick={() => setShowModal(true)}
          className={cn(
            "interaction-button flex items-center justify-center p-3 sm:p-4",
            "rounded-full bg-temple-cream border-2 border-temple-gold",
            "shadow-[0_0_15px_rgba(230,194,0,0.3)]"
          )}
          aria-label="Donate"
        >
          <Heart size={24} className="text-temple-red" />
        </button>
        <span className="block text-xs mt-2 text-center font-medium text-temple-red opacity-90">
          Donate
        </span>
      </div>
      
      {/* Donation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white bg-opacity-95 p-5 sm:p-6 rounded-lg max-w-md w-full animate-scale-in border-2 border-temple-gold">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-temple-red flex items-center">
                <span className="mr-2">🕉️</span>
                Tirupati Balaji Donation
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-700 mb-4">
              Your donation directly supports the temple's activities, charity works, and maintenance of this sacred site.
            </p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[108, 1008, 11008].map(amount => (
                <button 
                  key={amount}
                  className="py-2 px-3 border-2 border-temple-gold text-temple-red hover:bg-temple-cream rounded-md transition-colors font-medium"
                >
                  ₹{amount.toLocaleString()}
                </button>
              ))}
            </div>
            
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Custom Amount (₹)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-700 bg-gray-100 rounded-l-md border border-r-0 border-gray-300">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-temple-gold focus:border-transparent"
                />
              </div>
            </div>
            
            <button className="w-full bg-temple-red hover:bg-red-800 text-white py-3 px-4 rounded-md transition-colors font-medium">
              Proceed to Secure Payment
            </button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              Powered by Tirumala Tirupati Devasthanams Official Payment Gateway
            </div>
            
            <div className="flex justify-center mt-3">
              <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-2">
                <span>🔒</span>
                <span className="text-xs text-gray-600">Secure Transaction</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Volume Control Component
export const VolumeControl = ({ 
  volume, 
  setVolume, 
  isMuted, 
  toggleMute 
}: { 
  volume: number, 
  setVolume: (vol: number) => void,
  isMuted: boolean,
  toggleMute: () => void 
}) => {
  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="bg-black bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-2">
        <button 
          onClick={toggleMute}
          className="text-white opacity-80 hover:opacity-100"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Music size={18} />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="temple-volume-slider w-20"
        />
      </div>
    </div>
  );
};

// Exit Button Component
export const ExitButton = ({ onExit }: { onExit: () => void }) => {
  return (
    <div className="relative">
      <button 
        onClick={onExit}
        className={cn(
          "interaction-button flex items-center justify-center p-3 sm:p-4",
          "rounded-full bg-temple-cream border-2 border-temple-gold",
          "shadow-[0_0_15px_rgba(230,194,0,0.3)]"
        )}
        aria-label="Exit darshan"
      >
        <X size={24} className="text-temple-red" />
      </button>
      <span className="block text-xs mt-2 text-center font-medium text-temple-red opacity-90">
        Exit
      </span>
    </div>
  );
};
