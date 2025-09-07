import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);
  const [showCounter, setShowCounter] = useState(false);

  useEffect(() => {
    // Start countdown when component mounts
    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    // Show counter after a brief delay
    const counterTimer = setTimeout(() => {
      setShowCounter(true);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(counterTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Construction Icon */}
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-yellow-100 rounded-full opacity-75 blur-md animate-pulse"></div>
          <div className="relative bg-yellow-500 text-white p-6 rounded-full inline-flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Under Construction</h1>
        <p className="text-gray-600 mb-8">
          We're working hard to bring you this feature. Please check back soon!
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full animate-progress" 
            style={{ width: '45%' }}
          ></div>
        </div>

        {/* Countdown */}
        {showCounter && (
          <div className="mb-8 animate-fade-in">
            <p className="text-gray-700 mb-2">Redirecting you in</p>
            <div className="text-4xl font-bold text-blue-600">{seconds}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>

      {/* Add CSS for custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 45%;
          }
        }
        .animate-progress {
          animation: progress 1.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Analytics;