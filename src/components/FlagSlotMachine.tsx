import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { gameMatches } from '@/data/gameData';

interface FlagSlotMachineProps {
  category: string;
  options: string[];
  selectedValue: string | null;
  onSelectionChange: (value: string) => void;
  isMatched: boolean;
  isCorrect?: boolean;
  audio?: {
    playSpinSound: () => void;
    playSelectSound: () => void;
  };
}

export const FlagSlotMachine = ({ 
  category, 
  options, 
  selectedValue, 
  onSelectionChange,
  isMatched,
  isCorrect,
  audio
}: FlagSlotMachineProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Sync currentIndex with selectedValue
  React.useEffect(() => {
    if (selectedValue) {
      const index = options.findIndex(option => option === selectedValue);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedValue, options]);

  const handleSpin = () => {
    if (isSpinning) return;
    
    audio?.playSpinSound();
    setIsSpinning(true);
    const spinDuration = 1000 + Math.random() * 1000; // 1-2 seconds
    const finalIndex = Math.floor(Math.random() * options.length);
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % options.length);
    }, 100);
    
    setTimeout(() => {
      clearInterval(interval);
      setCurrentIndex(finalIndex);
      setIsSpinning(false);
      audio?.playSelectSound();
      onSelectionChange(options[finalIndex]);
    }, spinDuration);
  };

  const handleManualSelect = (direction: 'up' | 'down') => {
    if (isSpinning) return;
    
    audio?.playSelectSound();
    const newIndex = direction === 'up' 
      ? (currentIndex - 1 + options.length) % options.length
      : (currentIndex + 1) % options.length;
    
    setCurrentIndex(newIndex);
    onSelectionChange(options[newIndex]);
  };

  const getCardStyle = () => {
    if (isMatched) {
      return isCorrect 
        ? 'bg-gradient-success shadow-success border-success animate-bounce-crazy' 
        : 'bg-gradient-warm border-warning animate-wiggle';
    }
    return selectedValue 
      ? 'bg-gradient-electric shadow-electric border-primary animate-pulse-rainbow' 
      : 'bg-gradient-magical border-border hover:border-primary hover:animate-pulse-rainbow';
  };

  const getCurrentFlagImage = () => {
    const currentOption = options[currentIndex];
    const gameMatch = gameMatches.find(match => match.flag === currentOption);
    return gameMatch?.flagImage;
  };

  return (
    <Card className={`relative p-4 transition-all duration-500 ${getCardStyle()} 
      border-6 border-double overflow-hidden animate-pulse-rainbow
      before:absolute before:inset-0 before:bg-gradient-rainbow before:opacity-20 before:rounded-lg before:animate-rainbow-shift
      shadow-rainbow hover:shadow-electric transform hover:scale-110 hover:animate-wiggle`}>
      
      {/* MAGICAL CORNER GEMS */}
      <div className="absolute top-2 left-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-disco-ball shadow-glow"></div>
      <div className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-disco-ball shadow-glow" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-disco-ball shadow-glow" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-disco-ball shadow-glow" style={{animationDelay: '1.5s'}}></div>
      
      <div className="relative z-10 text-center space-y-2">
        {/* EXCITING CATEGORY HEADER */}
        <h3 className={`text-lg font-black transition-colors uppercase tracking-widest animate-rainbow-text ${
          isMatched 
            ? isCorrect ? 'animate-bounce-crazy' : 'animate-wiggle'
            : selectedValue ? 'text-white drop-shadow-lg' : 'text-rainbow'
        }`}>
          ✨ {category} ✨
        </h3>
        
        {/* Slot Display */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleManualSelect('up')}
            disabled={isSpinning}
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 hover:scale-125 transition-all duration-300 z-20 h-8 w-8 p-0 bg-gradient-electric hover:animate-bounce-crazy rounded-full border-2 border-white shadow-electric"
          >
            <ChevronUp className="h-5 w-5 text-white animate-bounce-crazy" />
          </Button>
          
          {/* Slot Machine Window */}
          <div className={`
            relative mx-auto w-full h-16 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg
            border-4 border-double border-yellow-400 shadow-inner
            flex items-center justify-center overflow-hidden
            ${isSpinning ? 'animate-pulse' : ''}
          `}>
            {/* Inner glow */}
            <div className="absolute inset-1 bg-gradient-to-b from-blue-100 to-white rounded border border-gray-300 flex items-center justify-center">
              <div className={`
                flex flex-col items-center justify-center transition-all duration-300
                ${isSpinning ? 'animate-bounce' : ''}
              `}>
                {getCurrentFlagImage() ? (
                  <>
                    <img 
                      src={getCurrentFlagImage()} 
                      alt={options[currentIndex]}
                      className="h-6 w-9 object-cover rounded border shadow-sm mb-1"
                    />
                    <span className="text-xs font-semibold text-blue-700">{options[currentIndex]}</span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-gray-700">{options[currentIndex]}</span>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleManualSelect('down')}
            disabled={isSpinning}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 hover:scale-125 transition-all duration-300 z-20 h-8 w-8 p-0 bg-gradient-magical hover:animate-bounce-crazy rounded-full border-2 border-white shadow-electric"
          >
            <ChevronDown className="h-5 w-5 text-white animate-bounce-crazy" />
          </Button>
        </div>
        
        {/* MEGA SPIN BUTTON */}
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full h-12 text-lg font-black transition-all duration-300 hover:scale-110 bg-gradient-rainbow hover:animate-wiggle text-white border-4 border-yellow-300 shadow-rainbow animate-pulse-rainbow"
          data-spin-button="true"
        >
          {isSpinning ? '🎰✨🎰' : '🎲 SPIN! 🎲'}
        </Button>
        
        {/* CELEBRATION DISPLAY */}
        {selectedValue && (
          <div className="text-sm font-black text-white bg-gradient-success rounded-full px-4 py-2 animate-bounce-crazy border-2 border-yellow-300 shadow-success">
            ✅ {selectedValue} ✅
          </div>
        )}
      </div>
    </Card>
  );
};