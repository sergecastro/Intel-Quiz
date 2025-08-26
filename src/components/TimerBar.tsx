import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface TimerBarProps {
  isActive: boolean;
  onTimeUp: () => void;
  duration?: number; // in milliseconds, default 6000
}

export const TimerBar = ({ isActive, onTimeUp, duration = 6000 }: TimerBarProps) => {
  const [progress, setProgress] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setIsTimeUp(false);
      return;
    }

    const startTime = Date.now();
    const interval = 16; // ~60fps for smooth animation
    
    // Subtle ticking sound
    const tickSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeEkWs4PmyZh0YVqzl7aOFOglvydguCZe7kNIEc8xOEc+7oMk8Mq9JKQ==');
    tickSound.volume = 0.1;
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      // Play tick sound every 500ms
      if (Math.floor(elapsed / 500) > Math.floor((elapsed - interval) / 500)) {
        try {
          tickSound.currentTime = 0;
          tickSound.play();
        } catch (e) {
          // Ignore audio errors
        }
      }
      
      if (newProgress >= 100) {
        setIsTimeUp(true);
        onTimeUp();
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, duration, onTimeUp]);

  if (!isActive && progress === 0) {
    return null;
  }

  return (
    <Card className="mx-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-blue-800 animate-pulse">
          ⏰ Decision Time Counter ⏰
        </h3>
        <p className="text-sm text-blue-600">
          {isTimeUp ? "Time's up! Voice feedback activated!" : "Make your choice before the timer fills up!"}
        </p>
      </div>
      
      {/* Glass tube container */}
      <div className="relative h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full border-4 border-gray-300 shadow-inner overflow-hidden">
        {/* Reflective glass effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/20 rounded-full pointer-events-none" />
        
        {/* Liquid fill */}
        <div 
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-75 ease-linear ${
            isTimeUp 
              ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-lg shadow-red-500/50' 
              : 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
          }`}
          style={{ width: `${progress}%` }}
        />
        
        {/* Animated bubbles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className={`absolute top-1 left-2 w-2 h-2 rounded-full animate-bounce ${
            isTimeUp ? 'bg-red-200' : 'bg-blue-200'
          } opacity-60`} style={{ animationDelay: '0s' }} />
          <div className={`absolute top-2 right-4 w-1 h-1 rounded-full animate-bounce ${
            isTimeUp ? 'bg-red-300' : 'bg-blue-300'
          } opacity-80`} style={{ animationDelay: '0.5s' }} />
          <div className={`absolute bottom-1 left-1/3 w-1.5 h-1.5 rounded-full animate-bounce ${
            isTimeUp ? 'bg-red-100' : 'bg-blue-100'
          } opacity-70`} style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Progress percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      {/* Timer status indicator */}
      <div className="text-center mt-2">
        {isTimeUp ? (
          <span className="text-red-600 font-bold animate-pulse">🔴 SPEAKING NOW!</span>
        ) : (
          <span className="text-blue-600 font-semibold">🔵 Thinking time...</span>
        )}
      </div>
    </Card>
  );
};