import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, VolumeX, Sparkles, Star } from 'lucide-react';
import { holidays, categories, categoryNames, categoryIcons, Holiday } from '@/data/holidaysData';
import { useGameAudio } from '@/hooks/useGameAudio';
import { toast } from 'sonner';

interface HolidaysSlotMachineProps {
  language: 'en' | 'he';
}

interface Reel {
  category: string;
  items: { text: string; holiday: Holiday; index: number }[];
  currentIndex: number;
  isSpinning: boolean;
  targetIndex?: number;
}

const DIFFICULTIES = {
  easy: { reels: 3, categories: ['name', 'story', 'symbol'] },
  medium: { reels: 5, categories: ['name', 'story', 'food', 'season', 'symbol'] },
  hard: { reels: 7, categories: ['name', 'story', 'food', 'season', 'symbol', 'name', 'story'] }
};

export const HolidaysSlotMachine = ({ language }: HolidaysSlotMachineProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [reels, setReels] = useState<Reel[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(120);
  const [isGameActive, setIsGameActive] = useState(false);
  const [winningHoliday, setWinningHoliday] = useState<Holiday | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const particleIdRef = useRef(0);
  const gameAudio = useGameAudio();

  // Initialize reels based on difficulty
  const initializeReels = useCallback(() => {
    const config = DIFFICULTIES[difficulty];
    const newReels: Reel[] = [];
    
    config.categories.forEach((category, index) => {
      const items = holidays.map((holiday, holidayIndex) => ({
        text: category === 'name' ? holiday.name[language] : 
              category === 'story' ? holiday.story[language] :
              category === 'food' ? holiday.food[language] :
              category === 'season' ? holiday.season[language] :
              holiday.symbol[language],
        holiday,
        index: holidayIndex
      }));
      
      // Shuffle items
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      
      newReels.push({
        category,
        items,
        currentIndex: Math.floor(Math.random() * items.length),
        isSpinning: false
      });
    });
    
    setReels(newReels);
    setWinningHoliday(null);
  }, [difficulty, language]);

  // Initialize background music
  useEffect(() => {
    if (audioEnabled && !backgroundMusic) {
      const audio = new Audio('/assets/audio/klezmer-background.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      setBackgroundMusic(audio);
      audio.play().catch(() => {}); // Ignore autoplay restrictions
    }
    
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, [audioEnabled]);

  // Game timer
  useEffect(() => {
    if (isGameActive && gameTime > 0) {
      gameTimerRef.current = setTimeout(() => {
        setGameTime(prev => prev - 1);
      }, 1000);
    } else if (gameTime === 0) {
      setIsGameActive(false);
      toast.error(language === 'he' ? 'נגמר הזמן!' : 'Time\'s up!');
    }
    
    return () => {
      if (gameTimerRef.current) clearTimeout(gameTimerRef.current);
    };
  }, [isGameActive, gameTime, language]);

  // Create particles effect
  const createParticles = useCallback((count = 20) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2000);
  }, []);

  // Spin individual reel
  const spinReel = useCallback((reelIndex: number) => {
    if (isSpinning) return;
    
    setReels(prev => prev.map((reel, index) => 
      index === reelIndex 
        ? { ...reel, isSpinning: true }
        : reel
    ));

    if (audioEnabled) gameAudio.playSpinSound();

    // Animate spin for 1-2 seconds
    const spinDuration = 1000 + Math.random() * 1000;
    const targetIndex = Math.floor(Math.random() * reels[reelIndex].items.length);
    
    setTimeout(() => {
      setReels(prev => prev.map((reel, index) => 
        index === reelIndex 
          ? { ...reel, isSpinning: false, currentIndex: targetIndex }
          : reel
      ));
      
      if (audioEnabled) gameAudio.playSelectSound();
      checkForWin();
    }, spinDuration);
  }, [isSpinning, reels, audioEnabled, gameAudio]);

  // Spin all reels
  const spinAll = useCallback(() => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinningHoliday(null);
    
    // Spin reels with staggered timing
    reels.forEach((_, index) => {
      setTimeout(() => spinReel(index), index * 200);
    });
    
    setTimeout(() => {
      setIsSpinning(false);
    }, 2000 + reels.length * 200);
    
    createParticles(10);
  }, [isSpinning, reels, spinReel, createParticles]);

  // Check for winning combination
  const checkForWin = useCallback(() => {
    const currentHolidays = reels.map(reel => reel.items[reel.currentIndex]?.holiday.key);
    const uniqueHolidays = [...new Set(currentHolidays)];
    
    if (uniqueHolidays.length === 1) {
      const holiday = holidays.find(h => h.key === uniqueHolidays[0]);
      if (holiday) {
        setWinningHoliday(holiday);
        setScore(prev => prev + 100);
        
        if (audioEnabled) {
          gameAudio.playSuccessSound();
          gameAudio.playWinChime();
        }
        
        createParticles(50);
        
        toast.success(
          language === 'he' 
            ? `🎉 ניצחת! זה ${holiday.name.he}!` 
            : `🎉 You Win! It's ${holiday.name.en}!`
        );
      }
    }
  }, [reels, audioEnabled, gameAudio, createParticles, language]);

  // Get hint for current state
  const getHint = useCallback(() => {
    const holidayCounts: Record<string, number> = {};
    reels.forEach(reel => {
      const holidayKey = reel.items[reel.currentIndex]?.holiday.key;
      if (holidayKey) {
        holidayCounts[holidayKey] = (holidayCounts[holidayKey] || 0) + 1;
      }
    });
    
    const mostCommon = Object.entries(holidayCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostCommon && mostCommon[1] > 1) {
      const holiday = holidays.find(h => h.key === mostCommon[0]);
      if (holiday) {
        return language === 'he' 
          ? `רמז: נסה להתאים את ${holiday.name.he}`
          : `Hint: Try to match ${holiday.name.en}`;
      }
    }
    
    return language === 'he' ? 'רמז: סובב עוד כדי למצוא התאמות' : 'Hint: Keep spinning to find matches';
  }, [reels, language]);

  // Initialize game
  useEffect(() => {
    initializeReels();
  }, [initializeReels]);

  const t = (en: string, he: string) => language === 'he' ? he : en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce" 
             style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-bounce"
             style={{ animationDelay: '1s', animationDuration: '2.5s' }} />
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce"
             style={{ animationDelay: '2s', animationDuration: '4s' }} />
      </div>

      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-ping pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDuration: '2s'
          }}
        />
      ))}

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            {t('🕯️ Holiday Mixer 🕯️', '🕯️ מערבל החגים 🕯️')}
          </h1>
          <p className="text-2xl text-white/80 mb-6">
            {t('Spin the magical reels to match Jewish holidays!', 'סובבו את הגלגלים הקסומים כדי להתאים חגים יהודיים!')}
          </p>
          
          {/* Game controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button
              onClick={() => setDifficulty('easy')}
              variant={difficulty === 'easy' ? 'default' : 'outline'}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
            >
              {t('Easy (3 Reels)', 'קל (3 גלגלים)')}
            </Button>
            <Button
              onClick={() => setDifficulty('medium')}
              variant={difficulty === 'medium' ? 'default' : 'outline'}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500"
            >
              {t('Medium (5 Reels)', 'בינוני (5 גלגלים)')}
            </Button>
            <Button
              onClick={() => setDifficulty('hard')}
              variant={difficulty === 'hard' ? 'default' : 'outline'}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500"
            >
              {t('Hard (7 Reels)', 'קשה (7 גלגלים)')}
            </Button>
            
            <Button
              onClick={spinAll}
              disabled={isSpinning}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xl px-8"
            >
              {isSpinning ? '🎰' : '🎲'} {t('SPIN ALL!', 'סובב הכל!')}
            </Button>
            
            <Button
              onClick={() => setAudioEnabled(!audioEnabled)}
              variant="ghost"
              className="text-white"
            >
              {audioEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
            
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="ghost"
              className="text-white"
            >
              <Sparkles /> {t('Hint', 'רמז')}
            </Button>
          </div>

          {showHint && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-white font-medium">{getHint()}</p>
            </div>
          )}

          {/* Game status */}
          <div className="flex justify-center gap-8 text-xl text-white mb-6">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" />
              {t('Score', 'ניקוד')}: {score}
            </div>
            <div className="flex items-center gap-2">
              <span>⏰</span>
              {t('Time', 'זמן')}: {gameTime}s
            </div>
          </div>
        </div>

        {/* Slot machine */}
        <Card className="max-w-7xl mx-auto bg-gradient-to-br from-indigo-800/50 to-purple-800/50 backdrop-blur-sm border-2 border-yellow-400/50 shadow-2xl">
          <CardContent className="p-8">
            {/* Decorative lights */}
            <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-full mb-6 animate-pulse" />
            
            {/* Reels grid */}
            <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: `repeat(${reels.length}, 1fr)` }}>
              {reels.map((reel, index) => (
                <div key={index} className="relative">
                  {/* Reel container with gradient based on category */}
                  <Card className={`
                    relative overflow-hidden border-4 border-double border-yellow-400 shadow-xl
                    transform transition-all duration-500 hover:scale-105
                    ${reel.isSpinning ? 'animate-pulse' : ''}
                  `}
                  style={{
                    background: `linear-gradient(135deg, ${
                      reel.category === 'name' ? 'hsl(220, 85%, 55%), hsl(220, 85%, 75%)' :
                      reel.category === 'story' ? 'hsl(280, 75%, 55%), hsl(280, 75%, 75%)' :
                      reel.category === 'food' ? 'hsl(120, 70%, 45%), hsl(120, 70%, 65%)' :
                      reel.category === 'season' ? 'hsl(30, 80%, 55%), hsl(30, 80%, 75%)' :
                      'hsl(45, 90%, 55%), hsl(45, 90%, 75%)'
                    })`
                  }}>
                    
                    {/* Category header */}
                    <div className="bg-black/20 backdrop-blur-sm p-4 text-center">
                      <div className="text-3xl mb-2">{categoryIcons[reel.category as keyof typeof categoryIcons]}</div>
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">
                        {categoryNames[language][reel.category as keyof typeof categoryNames.en]}
                      </h3>
                    </div>

                    {/* Reel window */}
                    <div className="relative h-32 overflow-hidden bg-gradient-to-b from-white/90 to-white/70 mx-4 mb-4 rounded-lg border-2 border-white/50">
                      {/* Payline indicators */}
                      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />
                      
                      {/* Current item display */}
                      <div className={`
                        absolute inset-0 flex items-center justify-center p-4 text-center transition-all duration-300
                        ${reel.isSpinning ? 'animate-bounce text-2xl' : 'text-lg'}
                      `}>
                        {reel.isSpinning ? (
                          <div className="text-4xl animate-spin">🎰</div>
                        ) : (
                          <div className="font-bold text-gray-800 leading-tight">
                            {reel.items[reel.currentIndex]?.text || '---'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Individual spin button */}
                    <Button
                      onClick={() => spinReel(index)}
                      disabled={isSpinning}
                      className="w-full mx-4 mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400"
                      style={{ width: 'calc(100% - 2rem)' }}
                    >
                      🎲 {t('Spin', 'סובב')}
                    </Button>
                  </Card>
                </div>
              ))}
            </div>

            {/* Win display */}
            {winningHoliday && (
              <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-4 border-yellow-300 shadow-2xl animate-bounce">
                <CardContent className="p-6 text-center">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    🎉 {t('Congratulations!', 'מזל טוב!')} 🎉
                  </h2>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {winningHoliday.name[language]}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {categoryIcons.story} {categoryNames[language].story}:
                      </p>
                      <p className="text-gray-700 mb-3">{winningHoliday.story[language]}</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {categoryIcons.food} {categoryNames[language].food}:
                      </p>
                      <p className="text-gray-700 mb-3">{winningHoliday.food[language]}</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {categoryIcons.season} {categoryNames[language].season}:
                      </p>
                      <p className="text-gray-700 mb-3">{winningHoliday.season[language]}</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {categoryIcons.symbol} {categoryNames[language].symbol}:
                      </p>
                      <p className="text-gray-700 mb-3">{winningHoliday.symbol[language]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* New game button */}
            <div className="text-center mt-6">
              <Button
                onClick={initializeReels}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xl px-8"
              >
                🔄 {t('New Game', 'משחק חדש')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};