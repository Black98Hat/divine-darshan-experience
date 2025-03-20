
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [audioAllowed, setAudioAllowed] = useState(false);

  useEffect(() => {
    // Load assets and simulate loading for smooth transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const startExperience = () => {
    setAudioAllowed(true);
    // Add transition before navigation
    document.body.classList.add('animate-fade-out');
    setTimeout(() => {
      navigate('/darshan');
    }, 500);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-temple-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-temple-red font-medium animate-pulse-subtle">Preparing your divine experience</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Temple background */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: 'url(/assets/tirupati-entrance-blur.jpg)' }}></div>
      <div className="temple-overlay"></div>
      
      {/* Audio player */}
      {audioAllowed && (
        <AudioPlayer 
          src="/assets/ambient-temple-entrance.mp3"
          volume={0.3}
          showControls={false}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-xl">
        <div className="mb-10 animate-flicker inline-block">
          <img 
            src="/assets/diya.png" 
            alt="Diya" 
            className="diya-light w-20 h-auto mx-auto"
          />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-temple-red tracking-wide animate-fade-in">
          Tirupati Balaji Virtual Darshan
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          Balaji is waiting. Step inside. Feel the temple. Close your eyes, and let the divine take over.
        </p>
        
        <button 
          onClick={startExperience}
          className="enter-button bg-temple-gold text-white py-3 px-8 rounded-full flex items-center justify-center mx-auto font-medium text-lg animate-slide-up opacity-0"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <span>Enter the Mandir</span>
          <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
      
      {/* Subtle audio instructions */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          For the complete experience, please enable audio
        </p>
      </div>
    </div>
  );
};

export default Index;
