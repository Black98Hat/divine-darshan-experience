
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-temple-cream to-white">
      <div className="text-center px-4">
        <h1 className="text-4xl font-semibold mb-4 text-temple-red">404</h1>
        <p className="text-xl text-gray-700 mb-8">This part of the temple does not exist</p>
        <button 
          onClick={() => navigate('/')}
          className="enter-button bg-temple-gold text-white py-2 px-6 rounded-full flex items-center justify-center mx-auto"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Return to Temple Entrance</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
