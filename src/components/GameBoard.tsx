import { useState, useEffect, useRef } from 'react';
import { SlotMachine } from './SlotMachine';
import { FlagSlotMachine } from './FlagSlotMachine';
import { TimerBar } from './TimerBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gameMatches, categories, categoryNames, type CategoryKey } from '@/data/gameData';
import { Sparkles, RotateCcw, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGameAudio } from '@/hooks/useGameAudio';
import { supabase } from '@/integrations/supabase/client';

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
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechQueueRef = useRef<string[]>([]);
  
  const { toast } = useToast();
  const { playButtonSound, playSuccessSound, playErrorSound, playWinChime, playSpinSound, playSelectSound, playCountryMusic, playExcitementSound, toggleAudio, isEnabled } = useGameAudio();

  // Enhanced Text-to-Speech function with queue and error handling
  const speakText = async (text: string) => {
    console.log(`speakText called with: "${text}"`);
    
    if (isSpeaking) {
      console.log('Already speaking, adding to queue');
      // Add to queue if already speaking
      speechQueueRef.current.push(text);
      return;
    }

    setIsSpeaking(true);
    console.log('Starting speech synthesis...');
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text }
      });

      if (error) {
        console.log('Voice synthesis error:', error);
        // Fallback: try browser speech synthesis
        fallbackToWebSpeech(text);
        setIsSpeaking(false);
        processNextSpeech();
        return;
      }

      if (data?.audioContent) {
        console.log('Audio content received, playing...');
        // Convert base64 to audio blob and play
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          console.log('Audio playback ended');
          setIsSpeaking(false);
          // Process next speech in queue after a short delay
          setTimeout(() => processNextSpeech(), 500);
        };
        
        audio.onerror = (e) => {
          console.log('Audio playback error:', e);
          fallbackToWebSpeech(text);
          setIsSpeaking(false);
          processNextSpeech();
        };
        
        await audio.play();
      } else {
        console.log('No audio content received, using fallback');
        fallbackToWebSpeech(text);
        setIsSpeaking(false);
        processNextSpeech();
      }
    } catch (error) {
      console.log('Voice synthesis not available:', error);
      fallbackToWebSpeech(text);
      setIsSpeaking(false);
      processNextSpeech();
    }
  };

  // Fallback to browser Web Speech API
  const fallbackToWebSpeech = (text: string) => {
    console.log('Using Web Speech API fallback for:', text);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      
      utterance.onend = () => {
        console.log('Web Speech playback ended');
        setTimeout(() => processNextSpeech(), 300);
      };
      
      utterance.onerror = () => {
        console.log('Web Speech error, continuing anyway');
        setTimeout(() => processNextSpeech(), 300);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      console.log('No speech synthesis available');
      setTimeout(() => processNextSpeech(), 300);
    }
  };

  const processNextSpeech = () => {
    if (speechQueueRef.current.length > 0) {
      const nextText = speechQueueRef.current.shift();
      if (nextText) {
        // Small delay before next speech
        setTimeout(() => speakText(nextText), 300);
      }
    }
  };

  const categoryOrder: CategoryKey[] = ['country', 'capital', 'language', 'currency', 'continent', 'flag'];

  // Enhanced state management for robust selection handling
  const [speechTimer, setSpeechTimer] = useState<NodeJS.Timeout | null>(null);
  const [categoryFailures, setCategoryFailures] = useState<Record<string, number>>({});
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [enabledCategories, setEnabledCategories] = useState<Set<CategoryKey>>(new Set(['country']));
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const latestSelectionRef = useRef<{category: CategoryKey, value: string} | null>(null);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Welcome message on component mount
  useEffect(() => {
    if (!hasWelcomed) {
      setTimeout(() => {
        speakText("WELCOME TO GEOGRAPHY MATCHING GAME! PLEASE CHOOSE THE COUNTRY FIRST!");
        setHasWelcomed(true);
      }, 1000);
    }
  }, [hasWelcomed]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (speechTimer) {
        clearTimeout(speechTimer);
      }
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, [speechTimer]);

  const handleSelectionChange = (category: CategoryKey, value: string) => {
    console.log(`handleSelectionChange called: category=${category}, value=${value}`);
    
    // Store the latest selection for debouncing
    latestSelectionRef.current = { category, value };
    
    setSelections(prev => {
      const newSelections = {
        ...prev,
        [category]: value
      };
      console.log('New selections after update:', newSelections);
      
      // Clear any existing feedback timer to prevent overlapping calls
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = null;
      }
      
      // Start visual timer
      setIsTimerActive(true);
      
      // Set debounced timer - only the latest selection will trigger feedback  
      feedbackTimerRef.current = setTimeout(() => {
        console.log(`Timer fired for ${category} = ${value}`);
        setIsTimerActive(false);
        // Double-check this is still the latest selection
        if (latestSelectionRef.current?.category === category && latestSelectionRef.current?.value === value) {
          console.log(`Providing feedback for final selection: ${category} = ${value}`);
          provideFeedback(category, value, newSelections);
        } else {
          console.log(`Skipping feedback - newer selection detected. Latest:`, latestSelectionRef.current);
        }
      }, 5000);
      
      return newSelections;
    });
    setIsMatched(false);
  };

  const provideFeedback = (category: CategoryKey, value: string, currentSelections: Selections) => {
    console.log(`provideFeedback called: category=${category}, value=${value}, selections=`, currentSelections);
    
    // Rule 1 & 2: Don't speak until country is chosen
    if (category !== 'country' && !currentSelections.country) {
      console.log('No country selected yet, skipping feedback');
      return;
    }

    if (category === 'country') {
      console.log(`Country selected: ${value} - enabling all categories and speaking`);
      // Reset failures when new country is chosen
      setCategoryFailures({});
      // Enable all other categories when country is selected
      setEnabledCategories(new Set(categoryOrder));
      console.log('Enabled categories updated to all categories');
      
      // Ensure speech happens
      const message = `${value.toUpperCase()} IS THE COUNTRY! CHOOSE THE NEXT CHOICES NOW!`;
      console.log(`Speaking: ${message}`);
      speakText(message);
      return;
    }

    console.log(`Providing feedback for ${category}: ${value}`);
    
    // For other categories, check if choice is correct for selected country
    const correctMatch = gameMatches.find(match => match.country === currentSelections.country);
    if (!correctMatch) {
      console.log('No correct match found for country:', currentSelections.country);
      return;
    }

    const isCorrect = correctMatch[category] === value;
    const nextCategoryIndex = categoryOrder.indexOf(category) + 1;
    const nextCategory = nextCategoryIndex < categoryOrder.length ? categoryOrder[nextCategoryIndex] : null;

    if (isCorrect) {
      // Reset failures for this category on success
      setCategoryFailures(prev => ({ ...prev, [category]: 0 }));
      let message = `BRAVO! ${value.toUpperCase()} IS CORRECT FOR ${currentSelections.country?.toUpperCase()}!`;
      if (nextCategory) {
        const nextCategoryName = categoryNames[nextCategory];
        message += ` NOW CHOOSE THE ${nextCategoryName.toUpperCase()}!`;
      } else {
        message += ` ALL DONE! CHECK YOUR MATCH!`;
      }
      console.log(`Speaking success message: ${message}`);
      speakText(message);
    } else {
      // Track failures for this category
      const currentFailures = (categoryFailures[category] || 0) + 1;
      setCategoryFailures(prev => ({ ...prev, [category]: currentFailures }));
      
      if (currentFailures >= 3) {
        // After 3 failures, reveal the correct answer
        const correctValue = correctMatch[category];
        const message = `NO! AFTER THREE TRIES, THE CORRECT ${categoryNames[category].toUpperCase()} FOR ${currentSelections.country?.toUpperCase()} IS ${correctValue?.toUpperCase()}! TRY AGAIN!`;
        console.log(`Speaking failure message (3 tries): ${message}`);
        speakText(message);
      } else {
        // Don't reveal answer, just say it's wrong
        const message = `NO! ${value.toUpperCase()} IS NOT THE CORRECT ${categoryNames[category].toUpperCase()} FOR ${currentSelections.country?.toUpperCase()}! PLEASE TRY AGAIN!`;
        console.log(`Speaking failure message: ${message}`);
        speakText(message);
      }
    }
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
      setConsecutiveFailures(0);  // Reset failures on success
      
      // Play success sound and speak celebration
      playSuccessSound();
      speakText(`Perfect match! ${match.country} is absolutely correct!`);
      
      // Play country music celebration - wait for speech to finish first
      setTimeout(() => {
        playCountryMusic(match.country);
        // Play it again for celebration
        setTimeout(() => playCountryMusic(match.country), 5000);
      }, 4000);
      
      toast({
        title: "🎉 INCREDIBLE MATCH! 🎉",
        description: `🌟 AMAZING! You matched ${match.country} perfectly! 🎵 Listen to their beautiful music! 🎶`,
        variant: "default"
      });
    } else {
      setIsCorrect(false);
      const newFailures = consecutiveFailures + 1;
      setConsecutiveFailures(newFailures);
      
      // Provide specific feedback about what's wrong
      const country = selections.country;
      const capital = selections.capital;
      
      // Find correct capital for selected country
      const correctMatch = gameMatches.find(match => match.country === country);
      let feedbackText = "That combination is not correct. ";
      
      if (country && capital && correctMatch && correctMatch.capital !== capital) {
        feedbackText = `${capital} is not the capital of ${country}. The correct capital is ${correctMatch.capital}. Try again!`;
      }
      
      speakText(feedbackText);
      playErrorSound();
      
      // After 3 failures, show educational help with dramatic audio
      if (newFailures >= 3) {
        playErrorSound(); // Dramatic failure sound
        speakText("Oh no! Three failures! Let me teach you the correct answer with some exciting slot machine action!");
        
        setTimeout(() => {
          setShowingCorrectAnswer(true);
          showCorrectAnswer();
        }, 2000);
      } else {
        toast({
          title: "Not quite right",
          description: "These items don't match. Try again!",
          variant: "destructive"
        });
      }
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

  const showCorrectAnswer = () => {
    // Use the user's selected country to teach the correct match
    const userSelectedCountry = selections.country;
    const correctMatch = gameMatches.find(match => match.country === userSelectedCountry) || 
                        gameMatches[Math.floor(Math.random() * gameMatches.length)];
    
    // First, trigger exciting spin animations 4 times
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      playExcitementSound();
      spinAllSlots();
      spinCount++;
      
      if (spinCount >= 4) {
        clearInterval(spinInterval);
        
        // After 4 spins, show the correct educational answer
        setTimeout(() => {
          speakText(`Here's the perfect match! ${correctMatch.country} is the country!`);
          
          // Set selections one by one with voice feedback
          setSelections(prev => ({ ...prev, country: correctMatch.country }));
          
          setTimeout(() => {
            speakText(`${correctMatch.capital} is the capital of ${correctMatch.country}!`);
            setSelections(prev => ({ ...prev, capital: correctMatch.capital }));
          }, 1000);
          
          setTimeout(() => {
            speakText(`${correctMatch.language} is the language of ${correctMatch.country}!`);
            setSelections(prev => ({ ...prev, language: correctMatch.language }));
          }, 2000);
          
          setTimeout(() => {
            speakText(`${correctMatch.currency} is the currency of ${correctMatch.country}!`);
            setSelections(prev => ({ ...prev, currency: correctMatch.currency }));
          }, 3000);
          
          setTimeout(() => {
            speakText(`${correctMatch.continent} is the continent where ${correctMatch.country} is located!`);
            setSelections(prev => ({ ...prev, continent: correctMatch.continent }));
          }, 4000);
          
          setTimeout(() => {
            speakText(`And this is the flag of ${correctMatch.country}! Study this perfect match!`);
            setSelections(prev => ({ ...prev, flag: correctMatch.flag }));
            
            toast({
              title: "🎓 EDUCATIONAL MOMENT! 🎓",
              description: `Perfect match for ${correctMatch.country}! Learn this combination!`,
              variant: "default"
            });
          }, 5000);
          
          // Reset after showing the complete match
          setTimeout(() => {
            setShowingCorrectAnswer(false);
            setConsecutiveFailures(0);
            resetGame();
            speakText("Now try again with what you've learned!");
          }, 10000);
          
        }, 2000);
      }
    }, 1500); // Spin every 1.5 seconds
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
    // Reset enabled categories to only country
    setEnabledCategories(new Set(['country']));
  };

  const resetAll = () => {
    playButtonSound();
    console.log('resetAll called');
    resetGame();
    setScore(0);
    setAttempts(0);
    setConsecutiveFailures(0);
    setShowingCorrectAnswer(false);
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
            <p className="text-2xl font-bold text-white bg-blue-800/80 px-4 py-2 rounded-2xl border-2 border-yellow-300 shadow-lg">
              🎵 Match countries and hear their amazing music! 🎵
            </p>
            <div className="text-lg font-semibold text-white bg-purple-800/80 px-4 py-2 rounded-2xl border-2 border-pink-300 shadow-lg">
              Spin the magical slots and discover the world! 🎰✨
            </div>
            <div className="flex justify-center gap-6 flex-wrap">
              <Badge className="text-2xl px-6 py-3 bg-gradient-success text-white border-4 border-yellow-300 animate-bounce-crazy shadow-rainbow">
                <Trophy className="h-6 w-6 mr-3 text-yellow-300" />
                SCORE: {score} 🏆
              </Badge>
              <Badge className="text-2xl px-6 py-3 bg-green-600 text-white border-4 border-yellow-300 animate-wiggle shadow-rainbow">
                TRIES: {attempts} 🎯
              </Badge>
              {consecutiveFailures > 0 && (
                <Badge className="text-xl px-4 py-2 bg-red-600 text-white border-4 border-orange-300 animate-bounce shadow-rainbow">
                  FAILS: {consecutiveFailures}/3 ⚠️
                </Badge>
              )}
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

        {/* Timer Bar */}
        <TimerBar 
          isActive={isTimerActive}
          onTimeUp={() => setIsTimerActive(false)}
          duration={6000}
        />

        {/* Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryOrder.map((categoryKey) => {
            const isEnabled = enabledCategories.has(categoryKey);
            const containerClass = !isEnabled ? "opacity-40 blur-sm pointer-events-none" : "";
            const categoryOptions = categories[categoryKey] || []; // Defensive programming
            
            // Skip rendering if no options available
            if (categoryOptions.length === 0) {
              console.warn(`No options available for category: ${categoryKey}`);
              return null;
            }
            
            if (categoryKey === 'flag') {
              return (
                <div key={categoryKey} className={containerClass}>
                  <FlagSlotMachine
                    category={categoryNames[categoryKey]}
                    options={categoryOptions}
                    selectedValue={selections[categoryKey]}
                    onSelectionChange={(value) => handleSelectionChange(categoryKey, value)}
                    audio={{ playSpinSound, playSelectSound }}
                    isMatched={isMatched}
                    isCorrect={isCorrect}
                  />
                </div>
              );
            }
            return (
              <div key={categoryKey} className={containerClass}>
                <SlotMachine
                  category={categoryNames[categoryKey]}
                  options={categoryOptions}
                  selectedValue={selections[categoryKey]}
                  onSelectionChange={(value) => handleSelectionChange(categoryKey, value)}
                  audio={{ playSpinSound, playSelectSound }}
                  isMatched={isMatched}
                  isCorrect={isCorrect}
                />
              </div>
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

        {/* LEARNING MODE DISPLAY */}
        {showingCorrectAnswer && (
          <Card className="p-12 bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-rainbow animate-pulse border-8 border-double border-cyan-300">
            <div className="text-center space-y-6">
              <div className="text-8xl animate-bounce">📚🎯📚</div>
              <h2 className="text-5xl font-bold animate-pulse text-cyan-100">
                🌟 LEARNING TIME! 🌟
              </h2>
              <p className="text-2xl font-bold text-white">
                📖 Study this perfect match! 📖
              </p>
              <div className="text-xl text-cyan-100">
                This will reset automatically in 5 seconds... ⏰
              </div>
            </div>
          </Card>
        )}

        {/* MEGA SUCCESS CELEBRATION */}
        {isMatched && isCorrect && (
          <Card className="p-12 bg-gradient-rainbow text-white shadow-rainbow animate-bounce-crazy border-8 border-double border-yellow-300 relative overflow-hidden">
            {/* Firework effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 text-6xl animate-bounce">🎆</div>
              <div className="absolute top-4 right-4 text-6xl animate-bounce" style={{animationDelay: '0.5s'}}>🎇</div>
              <div className="absolute bottom-4 left-4 text-6xl animate-bounce" style={{animationDelay: '1s'}}>✨</div>
              <div className="absolute bottom-4 right-4 text-6xl animate-bounce" style={{animationDelay: '1.5s'}}>🌟</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl animate-pulse">💥</div>
            </div>
            
            <div className="text-center space-y-6 relative z-10">
              <div className="text-9xl animate-disco-ball">🎉🏆🎉</div>
              <h2 className="text-6xl font-bold animate-rainbow-text animate-wiggle bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                🌟 SPECTACULAR VICTORY! 🌟
              </h2>
              <div className="text-7xl animate-pulse">🎊🎈🎊</div>
              <p className="text-4xl font-bold text-yellow-100 animate-bounce-crazy bg-red-600/30 px-6 py-3 rounded-full border-4 border-yellow-300">
                🎵 ENJOY THE COUNTRY'S BEAUTIFUL MUSIC! 🎵
              </p>
              <div className="text-5xl animate-wiggle">⭐🌈⭐</div>
              <div className="text-2xl text-white/90 animate-pulse bg-green-600/30 px-4 py-2 rounded-lg">
                New adventure starts in 3 seconds! Get ready! ✨
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};