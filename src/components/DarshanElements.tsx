
import { useState, useEffect, useRef } from 'react';
import { Bell, Flower, Hand, Heart, IndianRupee, X } from 'lucide-react';

interface PetalProps {
  style: React.CSSProperties;
}

const Petal = ({ style }: PetalProps) => {
  return <div className="petal animate-petal-fall" style={style} />;
};

// Bell Interaction Component
export const BellInteraction = () => {
  const [isRinging, setIsRinging] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const ringBell = () => {
    if (isRinging) return;
    
    setIsRinging(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    
    setTimeout(() => setIsRinging(false), 2000);
  };
  
  return (
    <div className="relative">
      <audio ref={audioRef} src="/assets/temple-bell.mp3" preload="auto" />
      <button 
        onClick={ringBell}
        className={`interaction-button relative flex items-center justify-center p-3 rounded-full bg-temple-cream border border-temple-gold transition-all duration-300 ${isRinging ? 'animate-pulse' : ''}`}
        disabled={isRinging}
        aria-label="Ring bell"
      >
        <Bell 
          size={24} 
          className={`text-temple-gold transition-all duration-300 ${isRinging ? 'animate-pulse' : ''}`} 
        />
      </button>
      <span className="block text-xs mt-1 text-center font-medium text-temple-red opacity-80">Ring Bell</span>
    </div>
  );
};

// Flower Offering Component
export const FlowerOffering = () => {
  const [petals, setPetals] = useState<React.CSSProperties[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const offerFlowers = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    
    const newPetals = [...Array(8)].map(() => ({
      left: `${Math.random() * 80 + 10}%`,
      animationDelay: `${Math.random() * 0.5}s`,
      transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`,
    }));
    
    setPetals([...petals, ...newPetals]);
    
    // Clean up petals after animation completes
    setTimeout(() => {
      setPetals(prevPetals => prevPetals.slice(newPetals.length));
    }, 3000);
  };
  
  return (
    <div className="relative">
      <audio ref={audioRef} src="/assets/flower-offering.mp3" preload="auto" />
      <button 
        onClick={offerFlowers}
        className="interaction-button flex items-center justify-center p-3 rounded-full bg-temple-cream border border-temple-gold"
        aria-label="Offer flowers"
      >
        <Flower size={24} className="text-temple-saffron" />
      </button>
      <span className="block text-xs mt-1 text-center font-medium text-temple-red opacity-80">Offer Flowers</span>
      
      {petals.map((style, index) => (
        <Petal key={index} style={style} />
      ))}
    </div>
  );
};

// Prayer Component
export const PrayerInteraction = ({ onPray }: { onPray: () => void }) => {
  const [isPraying, setIsPraying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const startPrayer = () => {
    setIsPraying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    
    onPray();
    
    timeoutRef.current = window.setTimeout(() => {
      setIsPraying(false);
    }, 3000);
  };
  
  return (
    <div className="relative">
      <audio ref={audioRef} src="/assets/prayer-chant.mp3" preload="auto" />
      <button 
        onClick={startPrayer}
        className={`interaction-button flex items-center justify-center p-3 rounded-full bg-temple-cream border border-temple-gold ${isPraying ? 'bg-temple-gold' : ''}`}
        disabled={isPraying}
        aria-label="Pray"
      >
        <Hand size={24} className={`${isPraying ? 'text-white' : 'text-temple-red'}`} />
      </button>
      <span className="block text-xs mt-1 text-center font-medium text-temple-red opacity-80">Pray</span>
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
          className="interaction-button flex items-center justify-center p-3 rounded-full bg-temple-cream border border-temple-gold"
          aria-label="Donate"
        >
          <Heart size={24} className="text-temple-red" />
        </button>
        <span className="block text-xs mt-1 text-center font-medium text-temple-red opacity-80">Donate</span>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg max-w-md w-full animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-temple-red">Donate to Tirupati Balaji Temple</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">Your donation directly supports the temple's activities and charitable works.</p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[101, 501, 1001].map(amount => (
                <button 
                  key={amount}
                  className="py-2 px-4 border border-temple-gold text-temple-red hover:bg-temple-cream rounded transition-colors"
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Custom Amount (₹)</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l border border-r-0 border-gray-300">
                  <IndianRupee size={16} />
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-2 focus:ring-temple-gold focus:border-transparent"
                />
              </div>
            </div>
            
            <button className="w-full bg-temple-red hover:bg-red-800 text-white py-2 px-4 rounded transition-colors">
              Proceed to Payment
            </button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              Powered by Tirumala Tirupati Devasthanams Official Payment Gateway
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Exit Button Component
export const ExitButton = ({ onExit }: { onExit: () => void }) => {
  return (
    <div className="relative">
      <button 
        onClick={onExit}
        className="interaction-button flex items-center justify-center p-3 rounded-full bg-temple-cream border border-temple-gold"
        aria-label="Exit darshan"
      >
        <X size={24} className="text-temple-red" />
      </button>
      <span className="block text-xs mt-1 text-center font-medium text-temple-red opacity-80">Exit</span>
    </div>
  );
};
