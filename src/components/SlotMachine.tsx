import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SlotMachineProps {
  category: string;
  options: string[];
  selectedValue: string | null;
  onSelectionChange: (value: string) => void;
  isMatched: boolean;
  isCorrect?: boolean;
}

export const SlotMachine = ({ 
  category, 
  options, 
  selectedValue, 
  onSelectionChange,
  isMatched,
  isCorrect
}: SlotMachineProps) => {
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

  return (
    <Card className={`p-6 transition-all duration-300 ${getCardStyle()}`}>
      <div className="text-center space-y-4">
        {/* Category Header */}
        <h3 className={`text-lg font-bold transition-colors ${
          isMatched 
            ? isCorrect ? 'text-success-foreground' : 'text-warning-foreground'
            : selectedValue ? 'text-primary-foreground' : 'text-foreground'
        }`}>
          {category}
        </h3>
        
        {/* Slot Display */}
        <div className="relative h-24 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleManualSelect('up')}
            disabled={isSpinning}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 hover:scale-110 transition-transform"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          
          <div className={`
            text-xl font-semibold px-4 py-2 rounded-lg min-h-[3rem] flex items-center justify-center
            transition-all duration-300
            ${isSpinning ? 'animate-bounce-soft' : ''}
            ${selectedValue ? 'bg-card/80 backdrop-blur-sm' : 'bg-muted'}
          `}>
            {options[currentIndex]}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleManualSelect('down')}
            disabled={isSpinning}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 hover:scale-110 transition-transform"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          variant={selectedValue ? "secondary" : "default"}
          className="w-full transition-all duration-300 hover:scale-105"
          data-spin-button="true"
        >
          {isSpinning ? '🎰 Spinning...' : '🎰 Spin'}
        </Button>
        
        {/* Selection Display */}
        {selectedValue && (
          <div className="text-sm opacity-75 animate-slide-up">
            Selected: <span className="font-semibold">{selectedValue}</span>
          </div>
        )}
      </div>
    </Card>
  );
};