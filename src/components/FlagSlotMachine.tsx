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

  // Debug logging for options
  React.useEffect(() => {
    console.log(`FlagSlotMachine ${category} - Options:`, options);
    console.log(`FlagSlotMachine ${category} - Selected:`, selectedValue);
    console.log(`FlagSlotMachine ${category} - Current Index:`, currentIndex);
  }, [options, selectedValue, currentIndex, category]);

  // Robust sync currentIndex with selectedValue
  React.useEffect(() => {
    if (selectedValue && options.length > 0) {
      const index = options.findIndex(option => option === selectedValue);
      if (index !== -1 && index !== currentIndex) {
        console.log(`FlagSlotMachine ${category} - Syncing index from ${currentIndex} to ${index} for value "${selectedValue}"`);
        setCurrentIndex(index);
      }
    }
  }, [selectedValue, options, category]); // Removed currentIndex from deps to prevent loops

  const handleSpin = () => {
    if (isSpinning || options.length === 0) return;
    
    console.log(`FlagSlotMachine ${category} - Spinning with ${options.length} options`);
    audio?.playSpinSound();
    setIsSpinning(true);
    const spinDuration = 1000 + Math.random() * 1000; // 1-2 seconds
    const finalIndex = Math.floor(Math.random() * options.length);
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const newIndex = (prev + 1) % options.length;
        return Math.max(0, Math.min(newIndex, options.length - 1)); // Ensure bounds
      });
    }, 100);
    
    setTimeout(() => {
      clearInterval(interval);
      const safeIndex = Math.max(0, Math.min(finalIndex, options.length - 1));
      console.log(`FlagSlotMachine ${category} - Spin result: index ${safeIndex}, value "${options[safeIndex]}"`);
      setCurrentIndex(safeIndex);
      setIsSpinning(false);
      audio?.playSelectSound();
      if (options[safeIndex]) {
        onSelectionChange(options[safeIndex]);
      }
    }, spinDuration);
  };

  const handleManualSelect = (direction: 'up' | 'down') => {
    if (isSpinning || options.length === 0) return;
    
    audio?.playSelectSound();
    const newIndex = direction === 'up' 
      ? (currentIndex - 1 + options.length) % options.length
      : (currentIndex + 1) % options.length;
    
    const safeIndex = Math.max(0, Math.min(newIndex, options.length - 1));
    console.log(`FlagSlotMachine ${category} - Manual select ${direction}: index ${currentIndex} -> ${safeIndex}, value "${options[safeIndex]}"`);
    setCurrentIndex(safeIndex);
    if (options[safeIndex]) {
      onSelectionChange(options[safeIndex]);
    }
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
    if (options.length === 0 || currentIndex < 0 || currentIndex >= options.length) return null;
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
        <h3 className={`text-lg font-black transition-colors uppercase tracking-widest ${
          isMatched 
            ? isCorrect ? 'text-green-800 animate-bounce-crazy drop-shadow-lg' : 'text-red-700 animate-wiggle drop-shadow-lg'
            : selectedValue ? 'text-blue-900 drop-shadow-lg bg-cyan-200/90 px-3 py-2 rounded-full border-2 border-blue-400' : 'text-purple-900 drop-shadow-lg'
        }`}>
          ✨ {category} ✨
        </h3>
        
        {/* Slot Display */}
        <div className="relative space-y-2">
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleManualSelect('up')}
              disabled={isSpinning}
              className="hover:scale-125 transition-all duration-300 z-20 h-10 w-10 p-1 bg-gradient-to-b from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 hover:animate-bounce-crazy rounded-full border-4 border-white shadow-lg flex items-center justify-center"
            >
              <ChevronUp className="h-6 w-6 text-purple-900 font-black drop-shadow-sm" strokeWidth={4} />
            </Button>
          </div>
          
          {/* MAGICAL SLOT WINDOW */}
          <div className={`
            relative mx-auto w-full h-16 bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 rounded-xl
            border-6 border-double border-yellow-400 shadow-rainbow animate-pulse-rainbow
            flex items-center justify-center overflow-hidden
            ${isSpinning ? 'animate-disco-ball' : 'hover:animate-wiggle'}
          `}>
            {/* MAGICAL INNER DISPLAY */}
            <div className="absolute inset-2 bg-gradient-to-b from-white via-yellow-50 to-white rounded-lg border-3 border-yellow-400 flex items-center justify-center shadow-inner overflow-hidden">
              <div className={`
                transition-all duration-300 text-center rounded-lg p-2 min-h-[3rem] flex items-center justify-center w-full
                ${isSpinning ? 'animate-bounce-crazy' : 'animate-pulse'}
                ${selectedValue ? 'bg-gradient-to-b from-purple-600 to-purple-800 shadow-lg border-2 border-yellow-400' : 'bg-gradient-to-b from-white to-gray-100 border-2 border-purple-400'}
              `}>
                {isSpinning ? (
                  <div className="text-5xl">🎰✨🎲</div>
                ) : getCurrentFlagImage() ? (
                  <img 
                    src={getCurrentFlagImage()} 
                    alt={options.length > 0 && currentIndex >= 0 && currentIndex < options.length ? options[currentIndex] : 'Flag'}
                    className="w-20 h-14 object-cover rounded-lg border-4 border-purple-400 shadow-lg transform hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className={`text-xl font-black drop-shadow-sm ${selectedValue ? 'text-white' : 'text-purple-900'}`}>
                    {options.length > 0 && currentIndex >= 0 && currentIndex < options.length 
                      ? options[currentIndex] 
                      : 'ERROR'
                    }
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleManualSelect('down')}
              disabled={isSpinning}
              className="hover:scale-125 transition-all duration-300 z-20 h-10 w-10 p-1 bg-gradient-to-b from-pink-400 to-purple-500 hover:from-pink-300 hover:to-purple-400 hover:animate-bounce-crazy rounded-full border-4 border-white shadow-lg flex items-center justify-center"
            >
              <ChevronDown className="h-6 w-6 text-white font-black drop-shadow-sm" strokeWidth={4} />
            </Button>
          </div>
        </div>
        
        {/* MEGA SPIN BUTTON */}
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full h-12 text-lg font-black transition-all duration-300 hover:scale-110 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white border-4 border-yellow-300 shadow-rainbow animate-pulse-rainbow"
          data-spin-button="true"
        >
          {isSpinning ? '🎰✨🎰' : '🎲 SPIN! 🎲'}
        </Button>
      </div>
    </Card>
  );
};