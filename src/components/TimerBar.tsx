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

  // Always show timer space to prevent screen jumping
  return (
    <div className="mx-4 mb-2">
      {/* Minimal thin progress bar - always present */}
      <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-75 ease-linear ${
            !isActive ? 'bg-transparent' :
            isTimeUp 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : 'bg-gradient-to-r from-blue-400 to-blue-500'
          }`}
          style={{ width: `${isActive ? progress : 0}%` }}
        />
      </div>
    </div>
  );
};