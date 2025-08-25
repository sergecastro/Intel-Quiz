import { useState, useEffect } from 'react';
import { SlotMachine } from './SlotMachine';
import { FlagSlotMachine } from './FlagSlotMachine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gameMatches, categories, categoryNames, type CategoryKey } from '@/data/gameData';
import { Sparkles, RotateCcw, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Selections {
  country: string | null;
  capital: string | null;
  language: string | null;
  currency: string | null;
  continent: string | null;
  flag: string | null;
}

export const GameBoard = () => {
  const [selections, setSelections] = useState<Selections>({
    country: null,
    capital: null,
    language: null,
    currency: null,
    continent: null,
    flag: null
  });
  
  const [isMatched, setIsMatched] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();

  const categoryOrder: CategoryKey[] = ['country', 'capital', 'language', 'currency', 'continent', 'flag'];

  const handleSelectionChange = (category: CategoryKey, value: string) => {
    console.log(`handleSelectionChange called: category=${category}, value=${value}`);
    setSelections(prev => {
      const newSelections = {
        ...prev,
        [category]: value
      };
      console.log('New selections after update:', newSelections);
      return newSelections;
    });
    setIsMatched(false);
  };

  const checkMatch = () => {
    console.log('Current selections:', selections);
    const allSelected = categoryOrder.every(cat => {
      const value = selections[cat];
      console.log(`Category ${cat}: "${value}" (type: ${typeof value})`);
      return value && value !== null && value !== "";
    });
    console.log('All selected:', allSelected);
    
    if (!allSelected) {
      toast({
        title: "Incomplete Selection",
        description: "Please select an item from each category!",
        variant: "destructive"
      });
      return;
    }

    setAttempts(prev => prev + 1);

    // Find if there's a matching set
    const match = gameMatches.find(gameMatch => 
      gameMatch.country === selections.country &&
      gameMatch.capital === selections.capital &&
      gameMatch.language === selections.language &&
      gameMatch.currency === selections.currency &&
      gameMatch.continent === selections.continent &&
      gameMatch.flag === selections.flag
    );

    setIsMatched(true);
    
    if (match) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      toast({
        title: "🎉 Perfect Match!",
        description: `Amazing! You matched ${match.country} correctly!`,
        variant: "default"
      });
    } else {
      setIsCorrect(false);
      toast({
        title: "Not quite right",
        description: "These items don't match. Try again!",
        variant: "destructive"
      });
    }
  };

  const spinAllSlots = () => {
    // Trigger spin on all slot machines
    const spinButtons = document.querySelectorAll('[data-spin-button="true"]');
    spinButtons.forEach(button => {
      if (button instanceof HTMLButtonElement && !button.disabled) {
        button.click();
      }
    });
  };

  const resetGame = () => {
    console.log('resetGame called');
    setSelections({
      country: null,
      capital: null,
      language: null,
      currency: null,
      continent: null,
      flag: null
    });
    setIsMatched(false);
    setIsCorrect(false);
  };

  const resetAll = () => {
    console.log('resetAll called');
    resetGame();
    setScore(0);
    setAttempts(0);
  };

  useEffect(() => {
    if (isMatched && isCorrect) {
      const timer = setTimeout(() => {
        resetGame();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMatched, isCorrect]);

  return (
    <div className="min-h-screen bg-gradient-bg p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-glow">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 animate-pulse-glow" />
              <h1 className="text-4xl font-bold">World Match Game</h1>
              <Sparkles className="h-8 w-8 animate-pulse-glow" />
            </div>
            <p className="text-lg opacity-90">
              Choose matching items from each category to learn about countries around the world!
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Trophy className="h-4 w-4 mr-2" />
                Score: {score}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 bg-white/10 border-white/20">
                Attempts: {attempts}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryOrder.map((categoryKey) => {
            if (categoryKey === 'flag') {
              return (
                <FlagSlotMachine
                  key={categoryKey}
                  category={categoryNames[categoryKey]}
                  options={categories[categoryKey]}
                  selectedValue={selections[categoryKey]}
                  onSelectionChange={(value) => handleSelectionChange(categoryKey, value)}
                  isMatched={isMatched}
                  isCorrect={isCorrect}
                />
              );
            }
            return (
              <SlotMachine
                key={categoryKey}
                category={categoryNames[categoryKey]}
                options={categories[categoryKey]}
                selectedValue={selections[categoryKey]}
                onSelectionChange={(value) => handleSelectionChange(categoryKey, value)}
                isMatched={isMatched}
                isCorrect={isCorrect}
              />
            );
          })}
        </div>

        {/* Action Buttons */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={checkMatch}
              size="lg"
              className="bg-gradient-success hover:scale-105 transition-all duration-300 text-lg px-8"
              disabled={isMatched}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Check Match
            </Button>
            
            <Button
              onClick={spinAllSlots}
              variant="outline"
              size="lg"
              className="text-lg px-8 hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Spin All
            </Button>
            
            <Button
              onClick={resetAll}
              variant="secondary"
              size="lg"
              className="text-lg px-8 hover:scale-105 transition-all duration-300"
            >
              Reset All
            </Button>
          </div>
        </Card>

        {/* Success Message */}
        {isMatched && isCorrect && (
          <Card className="p-6 bg-gradient-success text-success-foreground shadow-success animate-slide-up">
            <div className="text-center space-y-2">
              <div className="text-6xl animate-bounce-soft">🎉</div>
              <h2 className="text-2xl font-bold">Fantastic Job!</h2>
              <p className="text-lg">You found a perfect match! Starting a new round in 3 seconds...</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};