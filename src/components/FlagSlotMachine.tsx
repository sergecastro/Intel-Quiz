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
}

export const FlagSlotMachine = ({ 
  category, 
  options, 
  selectedValue, 
  onSelectionChange,
  isMatched,
  isCorrect
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
      onSelectionChange(options[finalIndex]);
    }, spinDuration);
  };

  const handleManualSelect = (direction: 'up' | 'down') => {
    if (isSpinning) return;
    
    const newIndex = direction === 'up' 
      ? (currentIndex - 1 + options.length) % options.length
      : (currentIndex + 1) % options.length;
    
    setCurrentIndex(newIndex);
    onSelectionChange(options[newIndex]);
  };

  const getCardStyle = () => {
    if (isMatched) {
      return isCorrect 
        ? 'bg-gradient-success shadow-success border-success animate-pulse-glow' 
        : 'bg-gradient-warm border-warning';
    }
    return selectedValue 
      ? 'bg-gradient-primary shadow-glow border-primary' 
      : 'bg-card border-border hover:border-primary';
  };

  const getCurrentFlagImage = () => {
    const currentOption = options[currentIndex];
    const gameMatch = gameMatches.find(match => match.flag === currentOption);
    return gameMatch?.flagImage;
  };

  return (
    <Card className={`relative p-3 transition-all duration-300 ${getCardStyle()} 
      border-4 border-double overflow-hidden
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-yellow-200/20 before:to-orange-200/20 before:rounded-lg
      shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}>
      
      {/* Decorative corners */}
      <div className="absolute top-1 left-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1 right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1 left-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
      
      <div className="relative z-10 text-center space-y-2">
        {/* Category Header */}
        <h3 className={`text-sm font-bold transition-colors uppercase tracking-wide ${
          isMatched 
            ? isCorrect ? 'text-success-foreground' : 'text-warning-foreground'
            : selectedValue ? 'text-primary-foreground' : 'text-foreground'
        }`}>
          {category}
        </h3>
        
        {/* Slot Display */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleManualSelect('up')}
            disabled={isSpinning}
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 hover:scale-110 transition-transform z-20 h-6 w-6 p-0 bg-gradient-to-b from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 rounded-full"
          >
            <ChevronUp className="h-3 w-3 text-white" />
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
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 hover:scale-110 transition-transform z-20 h-6 w-6 p-0 bg-gradient-to-b from-cyan-300 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500 rounded-full"
          >
            <ChevronDown className="h-3 w-3 text-white" />
          </Button>
        </div>
        
        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          variant={selectedValue ? "secondary" : "default"}
          className="w-full h-8 text-sm transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold border-2 border-yellow-300 shadow-md"
          data-spin-button="true"
        >
          {isSpinning ? '🎰' : '🎲'}
        </Button>
        
        {/* Selection Display */}
        {selectedValue && (
          <div className="text-xs font-semibold text-green-700 bg-green-100 rounded-full px-2 py-1 animate-fade-in">
            ✓ {selectedValue}
          </div>
        )}
      </div>
    </Card>
  );
};