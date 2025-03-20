
import { useEffect, useState } from 'react';

const TempleBackground = () => {
  const [particlesVisible, setParticlesVisible] = useState(false);
  
  useEffect(() => {
    // Delay particle effect to improve initial loading performance
    const timer = setTimeout(() => {
      setParticlesVisible(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {/* Sacred temple interior background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-15" 
        style={{ backgroundImage: 'url(/assets/temple-interior.jpg)' }}></div>
      
      {/* Golden ambient light overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#e6c20015] to-transparent"></div>
      
      {/* Sacred particles effect */}
      {particlesVisible && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Generate sacred particles */}
          {[...Array(25)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-temple-gold opacity-20 animate-float"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      )}
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none"></div>
    </>
  );
};

export default TempleBackground;
