import { useState, useEffect } from 'react';
import { SlotMachine } from './SlotMachine';
import { FlagSlotMachine } from './FlagSlotMachine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gameMatches, categories, categoryNames, type CategoryKey } from '@/data/gameData';
import { Sparkles, RotateCcw, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGameAudio } from '@/hooks/useGameAudio';

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
  const { playButtonSound, playSuccessSound, playErrorSound, playWinChime, playSpinSound, playSelectSound, playCountryMusic, playExcitementSound, toggleAudio, isEnabled } = useGameAudio();

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
    playButtonSound();
    console.log('Current selections:', selections);
    const allSelected = categoryOrder.every(cat => {
      const value = selections[cat];
      console.log(`Category ${cat}: "${value}" (type: ${typeof value})`);
      return value && value !== null && value !== "";
    });
    console.log('All selected:', allSelected);
    
    if (!allSelected) {
      playErrorSound();
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
      playWinChime(match.country);
      // Play country music celebration with multiple rounds
      setTimeout(() => playCountryMusic(match.country), 2000);
      setTimeout(() => playCountryMusic(match.country), 6000);
      toast({
        title: "🎉 INCREDIBLE MATCH! 🎉",
        description: `🌟 AMAZING! You matched ${match.country} perfectly! 🎵 Listen to their beautiful music! 🎶`,
        variant: "default"
      });
    } else {
      setIsCorrect(false);
      playErrorSound();
      toast({
        title: "Not quite right",
        description: "These items don't match. Try again!",
        variant: "destructive"
      });
    }
  };

  const spinAllSlots = () => {
    playExcitementSound();
    // Trigger spin on all slot machines with excitement!
    const spinButtons = document.querySelectorAll('[data-spin-button="true"]');
    spinButtons.forEach((button, index) => {
      if (button instanceof HTMLButtonElement && !button.disabled) {
        // Stagger the spins for more excitement
        setTimeout(() => button.click(), index * 100);
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
    playButtonSound();
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
        {/* SUPER EXCITING HEADER */}
        <Card className="p-8 bg-gradient-electric text-white shadow-rainbow animate-pulse-rainbow border-4 border-double border-white/30">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <Sparkles className="h-12 w-12 animate-disco-ball text-yellow-300" />
              <h1 className="text-6xl font-bold text-white drop-shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl py-4 px-8 border-4 border-yellow-400 shadow-2xl">
                🌍 WORLD MATCH ADVENTURE! 🌍
              </h1>
              <Sparkles className="h-12 w-12 animate-disco-ball text-yellow-300" />
            </div>
            <p className="text-2xl font-bold text-yellow-100 animate-wiggle">
              🎵 Match countries and hear their amazing music! 🎵
            </p>
            <div className="text-lg font-semibold text-white/90">
              Spin the magical slots and discover the world! 🎰✨
            </div>
            <div className="flex justify-center gap-6 flex-wrap">
              <Badge className="text-2xl px-6 py-3 bg-gradient-success text-white border-4 border-yellow-300 animate-bounce-crazy shadow-rainbow">
                <Trophy className="h-6 w-6 mr-3 text-yellow-300" />
                SCORE: {score} 🏆
              </Badge>
              <Badge className="text-2xl px-6 py-3 bg-gradient-magical text-white border-4 border-cyan-300 animate-wiggle shadow-electric">
                TRIES: {attempts} 🎯
              </Badge>
              <Button
                onClick={() => {
                  playButtonSound();
                  toggleAudio();
                }}
                className="text-2xl px-6 py-3 bg-gradient-warm text-white border-4 border-white/50 hover:scale-110 transition-all duration-300 animate-pulse-rainbow"
                size="lg"
              >
                {isEnabled ? '🔊 SOUND ON' : '🔇 SOUND OFF'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryOrder.map((categoryKey) => {
            if (categoryKey === 'flag') {
              return (
                <FlagSlotMachine
                  key={categoryKey}
                  category={categoryNames[categoryKey]}
                  options={categories[categoryKey]}
                  selectedValue={selections[categoryKey]}
                  onSelectionChange={(value) => handleSelectionChange(categoryKey, value)}
                  audio={{ playSpinSound, playSelectSound }}
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
                audio={{ playSpinSound, playSelectSound }}
                isMatched={isMatched}
                isCorrect={isCorrect}
              />
            );
          })}
        </div>

        {/* SUPER ACTION BUTTONS */}
        <Card className="p-8 bg-gradient-magical border-4 border-double border-yellow-400 shadow-rainbow">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={checkMatch}
              size="lg"
              className="bg-gradient-success text-white text-2xl px-12 py-6 border-4 border-white/30 hover:scale-110 transition-all duration-300 animate-pulse-rainbow shadow-success font-bold"
              disabled={isMatched}
            >
              <Sparkles className="h-8 w-8 mr-3 animate-disco-ball" />
              ✨ CHECK MATCH! ✨
            </Button>
            
            <Button
              onClick={spinAllSlots}
              size="lg"
              className="bg-gradient-electric text-white text-2xl px-12 py-6 border-4 border-white/30 hover:scale-110 transition-all duration-300 animate-wiggle shadow-electric font-bold"
            >
              <RotateCcw className="h-8 w-8 mr-3 animate-bounce-crazy" />
              🎰 SPIN ALL! 🎰
            </Button>
            
            <Button
              onClick={resetAll}
              size="lg"
              className="bg-gradient-warm text-white text-2xl px-12 py-6 border-4 border-white/30 hover:scale-110 transition-all duration-300 animate-bounce-crazy shadow-rainbow font-bold"
            >
              🔄 NEW GAME! 🔄
            </Button>
          </div>
        </Card>

        {/* MEGA SUCCESS CELEBRATION */}
        {isMatched && isCorrect && (
          <Card className="p-12 bg-gradient-rainbow text-white shadow-rainbow animate-bounce-crazy border-8 border-double border-yellow-300">
            <div className="text-center space-y-6">
              <div className="text-9xl animate-disco-ball">🎉🏆🎉</div>
              <h2 className="text-6xl font-bold animate-rainbow-text animate-wiggle">
                🌟 SPECTACULAR VICTORY! 🌟
              </h2>
              <p className="text-3xl font-bold text-yellow-100 animate-bounce-crazy">
                🎵 LISTEN TO THE COUNTRY'S MUSIC! 🎵
              </p>
              <div className="text-2xl text-white/90 animate-pulse">
                Get ready for the next amazing adventure in 3 seconds! ✨
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};