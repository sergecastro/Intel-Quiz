import { celebrateWin } from '../utils/celebration';
import { useState, useEffect, useRef } from 'react';
import { SlotMachine } from './SlotMachine';
import { TimerBar } from './TimerBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { torahMatches, torahCategories, torahCategoryNames, TorahCategoryKey } from '@/data/torahMatches';
import { Sparkles, RotateCcw, Trophy, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGameAudio } from '@/hooks/useGameAudio';
import { supabase } from '@/integrations/supabase/client';

interface Selections {
  [key: string]: string | null;
}

export const TorahGameBoard = () => {
  const [selections, setSelections] = useState<Selections>({});
  
  // Initialize selections based on Torah categories
  useEffect(() => {
    const initialSelections: Selections = {};
    Object.keys(torahCategories).forEach(key => {
      initialSelections[key] = null;
    });
    setSelections(initialSelections);
    setEnabledCategories(new Set([Object.keys(torahCategories)[0]])); // Enable first category
    setHasWelcomed(false);
  }, []);
  
  const [isMatched, setIsMatched] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechQueueRef = useRef<string[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showVoicePrompt, setShowVoicePrompt] = useState(false);
  const [level, setLevel] = useState(1);

  const { toast } = useToast();
  const { playButtonSound, playErrorSound, playSpinSound, playSelectSound, playExcitementSound, toggleAudio, isEnabled } = useGameAudio();

  const categoryOrder = Object.keys(torahCategories) as TorahCategoryKey[];
  
  // Level-based active categories (9 slots total)
  const getLevelCategories = (currentLevel: number): TorahCategoryKey[] => {
    const levels: Record<number, TorahCategoryKey[]> = {
      1: ['character', 'event', 'location'],
      2: ['character', 'event', 'location', 'family'],
      3: ['character', 'event', 'location', 'family', 'quote'],
      4: ['character', 'event', 'location', 'family', 'quote', 'theme'],
      5: ['character', 'event', 'location', 'family', 'quote', 'theme', 'period'],
      6: ['character', 'event', 'location', 'family', 'quote', 'theme', 'period', 'miracle']
    };
    return levels[currentLevel] || categoryOrder.slice(0, 3);
  };
  
  const activeCategoriesForLevel = getLevelCategories(level);

  // Enhanced state management
  const [speechTimer, setSpeechTimer] = useState<NodeJS.Timeout | null>(null);
  const [categoryFailures, setCategoryFailures] = useState<Record<string, number>>({});
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set(['character']));
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const latestSelectionRef = useRef<{category: string, value: string} | null>(null);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced Text-to-Speech function (Hebrew support)
  const speakText = async (text: string) => {
    if (!voiceEnabled) {
      console.log('Voice not enabled yet, skipping speech');
      return;
    }
    
    if (isSpeaking) {
      speechQueueRef.current.push(text);
      return;
    }

    setIsSpeaking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, language: 'he' }
      });

      if (error) throw error;

      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.onended = () => {
          setIsSpeaking(false);
          setTimeout(() => processNextSpeech(), 300);
        };
        audio.onerror = () => {
          console.log('Supabase TTS failed, falling back to Web Speech API');
          fallbackToWebSpeech(text);
        };
        await audio.play();
      } else {
        fallbackToWebSpeech(text);
      }
    } catch (error) {
      console.log('Voice synthesis error:', error);
      fallbackToWebSpeech(text);
    }
  };

  const fallbackToWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.7;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        utterance.lang = 'he-IL'; // Hebrew language
        
        const setVoiceAndSpeak = () => {
          const voices = window.speechSynthesis.getVoices();
          
          // Look for Hebrew voice
          let selectedVoice = voices.find(voice => 
            voice.lang.includes('he') || voice.lang.includes('iw')
          );
          
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
          
          utterance.onend = () => {
            setIsSpeaking(false);
            setTimeout(() => processNextSpeech(), 300);
          };
          
          utterance.onerror = () => {
            console.log('Web Speech error: not-allowed continuing anyway');
            setIsSpeaking(false);
            setTimeout(() => processNextSpeech(), 300);
          };
          
          window.speechSynthesis.speak(utterance);
        };
        
        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.onvoiceschanged = null;
            setVoiceAndSpeak();
          };
        } else {
          setVoiceAndSpeak();
        }
      }, 200);
    } else {
      setIsSpeaking(false);
      setTimeout(() => processNextSpeech(), 300);
    }
  };

  const processNextSpeech = () => {
    if (speechQueueRef.current.length > 0) {
      const nextText = speechQueueRef.current.shift();
      if (nextText) {
        setTimeout(() => speakText(nextText), 300);
      }
    }
  };

  // Check for iOS and show voice prompt
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !voiceEnabled) {
      setShowVoicePrompt(true);
    } else if (!isIOS) {
      setVoiceEnabled(true);
    }
  }, [voiceEnabled]);

  // Enhanced voice enablement
  const enableVoice = async () => {
    try {
      const testUtterance = new SpeechSynthesisUtterance('קול מופעל!');
      testUtterance.volume = 0.1;
      testUtterance.lang = 'he-IL';
      window.speechSynthesis.speak(testUtterance);
      
      setVoiceEnabled(true);
      setShowVoicePrompt(false);
      
      setTimeout(() => {
        if (!hasWelcomed) {
          speakText('ברוכים הבאים למשחק התורה! בחרו דמות תחילה!');
          setHasWelcomed(true);
        }
      }, 500);
    } catch (error) {
      setVoiceEnabled(true);
      setShowVoicePrompt(false);
    }
  };

  // Welcome message
  useEffect(() => {
    if (!hasWelcomed && voiceEnabled) {
      setTimeout(() => {
        speakText('ברוכים הבאים למשחק התורה! בחרו דמות תחילה!');
        setHasWelcomed(true);
      }, 1000);
    }
  }, [hasWelcomed, voiceEnabled]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (speechTimer) clearTimeout(speechTimer);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, [speechTimer]);

  const handleSelectionChange = (category: string, value: string) => {
    latestSelectionRef.current = { category, value };
    
    setSelections(prev => {
      const newSelections = { ...prev, [category]: value };
      
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = null;
      }
      
      setIsTimerActive(true);
      
      feedbackTimerRef.current = setTimeout(() => {
        setIsTimerActive(false);
        if (latestSelectionRef.current?.category === category && latestSelectionRef.current?.value === value) {
          provideFeedback(category, value, newSelections);
        }
      }, 4000);
      
      return newSelections;
    });
    setIsMatched(false);
  };

  const provideFeedback = (category: string, value: string, currentSelections: Selections) => {
    const leadingCategory = 'character';
    
    if (category !== leadingCategory && !currentSelections[leadingCategory]) {
      return;
    }

    if (category === leadingCategory) {
      setCategoryFailures({});
      
      const nextCategoryInLevel = activeCategoriesForLevel.find(cat => 
        categoryOrder.indexOf(cat) > categoryOrder.indexOf(leadingCategory)
      );
      
      if (nextCategoryInLevel) {
        setEnabledCategories(new Set([leadingCategory, nextCategoryInLevel]));
        const message = `${value}! עכשיו בחרו ${torahCategoryNames[nextCategoryInLevel]}!`;
        speakText(message);
      }
      return;
    }

    const leadingValue = currentSelections[leadingCategory];
    const correctMatch = torahMatches.find(match => match[leadingCategory as keyof typeof match] === leadingValue);
    
    if (!correctMatch) {
      const currentFailures = (categoryFailures[category] || 0) + 1;
      setCategoryFailures(prev => ({ ...prev, [category]: currentFailures }));
      
      playErrorSound();
      
      if (currentFailures >= 3) {
        const message = `לא! נסו דמות אחרת תחילה!`;
        speakText(message);
      } else {
        const message = `לא! ${value} לא מתאים ל${leadingValue}! נסו שוב!`;
        speakText(message);
      }
      return;
    }

    const isCorrect = correctMatch[category as keyof typeof correctMatch] === value;

    if (isCorrect) {
      setCategoryFailures(prev => ({ ...prev, [category]: 0 }));
      
      const currentCategoryIndex = activeCategoriesForLevel.indexOf(category as TorahCategoryKey);
      const nextCategoryInLevel = activeCategoriesForLevel[currentCategoryIndex + 1];

      if (nextCategoryInLevel) {
        setEnabledCategories(prev => new Set([...prev, nextCategoryInLevel]));
        const message = `נכון! עכשיו ${torahCategoryNames[nextCategoryInLevel]}!`;
        speakText(message);
      }
    } else {
      playErrorSound();
      const currentFailures = (categoryFailures[category] || 0) + 1;
      setCategoryFailures(prev => ({ ...prev, [category]: currentFailures }));

      if (currentFailures >= 3) {
        setShowingCorrectAnswer(true);
        const correctAnswer = correctMatch[category as keyof typeof correctMatch];
        setSelections(prev => ({ ...prev, [category]: correctAnswer }));
        
        const message = `התשובה הנכונה היא: ${correctAnswer}`;
        speakText(message);
        
        setTimeout(() => {
          setShowingCorrectAnswer(false);
          const nextCategoryIndex = activeCategoriesForLevel.indexOf(category as TorahCategoryKey);
          const nextCategory = activeCategoriesForLevel[nextCategoryIndex + 1];
          
          if (nextCategory) {
            setEnabledCategories(prev => new Set([...prev, nextCategory]));
            const message = `עכשיו ${torahCategoryNames[nextCategory]}!`;
            speakText(message);
          }
        }, 5000);
      } else {
        const message = `לא נכון! נסו שוב!`;
        speakText(message);
      }
    }
  };

  const checkMatch = () => {
    playButtonSound();
    setAttempts(prev => prev + 1);
    console.log('CHECK MATCH clicked - Current selections:', selections);

    // Get the leading character
    const leadingValue = selections['character'];
    if (!leadingValue) {
      toast({
        title: "❌ שגיאה",
        description: "בחרו דמות תחילה!",
        variant: "destructive",
      });
      speakText('בחרו דמות תחילה!');
      return;
    }

    // Find the correct match for this character
    const correctMatch = torahMatches.find(match => match.character === leadingValue);
    
    if (!correctMatch) {
      toast({
        title: "❌ שגיאה", 
        description: "לא נמצא מידע עבור הדמות הזו",
        variant: "destructive",
      });
      return;
    }

    console.log('Found correct match:', correctMatch);

    // Check if all active categories match
    const allCorrect = activeCategoriesForLevel.every(category => {
      const selectedValue = selections[category];
      const correctValue = correctMatch[category];
      console.log(`Checking ${category}: selected="${selectedValue}", correct="${correctValue}"`);
      return selectedValue === correctValue;
    });

    console.log('All correct?', allCorrect);

    if (allCorrect) {
      setIsMatched(true);
      setIsCorrect(true);
      setScore(prev => prev + 100);
      setConsecutiveFailures(0);
      playExcitementSound();
      
      const successMessage = level < 3 ? 'מעולה! עוברים לרמה הבאה!' : 'כל הכבוד! השלמתם את כל הרמות!';
      speakText(successMessage);
      
      toast({
        title: "🎉 מצוין!",
        description: successMessage,
      });

      setTimeout(() => {
        if (level < 3) {
          nextLevel();
        } else {
          celebrateWin();
        }
      }, 3000);
    } else {
      setConsecutiveFailures(prev => prev + 1);
      
      if (consecutiveFailures >= 2) {
        showCorrectAnswer();
      } else {
        playErrorSound();
        speakText('לא נכון! נסו שוב!');
        
        toast({
          title: "❌ לא נכון",
          description: "נסו שוב! אתם יכולים!",
          variant: "destructive",
        });
      }
    }
  };

  const showCorrectAnswer = () => {
    const leadingValue = selections['character'];
    const correctMatch = torahMatches.find(match => match.character === leadingValue);
    
    if (correctMatch) {
      setShowingCorrectAnswer(true);
      const correctSelections: Selections = {};
      
      activeCategoriesForLevel.forEach(category => {
        correctSelections[category] = correctMatch[category];
      });
      
      setSelections(correctSelections);
      speakText('הנה התשובה הנכונה! למדו ותזכרו!');
      
      setTimeout(() => {
        setShowingCorrectAnswer(false);
        resetGame();
      }, 5000);
    }
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    resetGame();
  };

  const resetGame = () => {
    const initialSelections: Selections = {};
    Object.keys(torahCategories).forEach(key => {
      initialSelections[key] = null;
    });
    setSelections(initialSelections);
    setIsMatched(false);
    setIsCorrect(false);
    setCategoryFailures({});
    setEnabledCategories(new Set(['character']));
    setShowingCorrectAnswer(false);
    setConsecutiveFailures(0);
    
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  };

  const resetAll = () => {
    setLevel(1);
    setScore(0);
    setAttempts(0);
    resetGame();
  };

  // Auto-reset celebration after 3 seconds
  useEffect(() => {
    if (isMatched && isCorrect) {
      const timer = setTimeout(() => {
        setIsMatched(false);
        setIsCorrect(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMatched, isCorrect]);

  return (
    <div className="min-h-screen bg-gradient-bg p-4" dir="rtl">
      {/* Voice Enable Prompt for iOS */}
      {showVoicePrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-8 bg-gradient-electric text-white shadow-rainbow border-4 border-yellow-300 max-w-md mx-auto">
            <div className="text-center space-y-6">
              <div className="text-6xl animate-bounce">🔊</div>
              <h2 className="text-2xl font-bold text-white">
                הפעלת קול
              </h2>
              <p className="text-lg text-white/90">
                לחצו כאן להפעלת הקריינות בעברית
              </p>
              <Button 
                onClick={enableVoice}
                className="bg-gradient-success text-white text-xl px-8 py-4 border-4 border-white/30 hover:scale-110 transition-all duration-300 animate-pulse-rainbow font-bold"
              >
                🎵 הפעל קול! 🎵
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MEGA HEADER WITH SPARKLES */}
      <div className="text-center mb-8 space-y-4">
        <Card className="p-4 bg-gradient-electric text-white shadow-rainbow animate-pulse-rainbow border-4 border-double border-white/30">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl py-2 px-4 border-4 border-yellow-400 shadow-2xl">
                🕍 משחק התורה 🕍
              </h1>
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center items-center">
          <div className="relative">
            <Badge className="text-lg px-4 py-2 bg-gradient-success text-white border-4 border-yellow-300 animate-bounce-crazy shadow-rainbow">
              <Trophy className="h-5 w-5 ml-2 animate-spin" />
              ניקוד: {score}
            </Badge>
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">⭐</div>
          </div>
          
          <Badge className="text-lg px-4 py-2 bg-gradient-warm text-white border-4 border-purple-300 animate-wiggle shadow-electric">
            🎯 רמה: {level}/3
          </Badge>
          
          <Badge className="text-lg px-4 py-2 bg-gradient-magical text-white border-4 border-cyan-300 animate-pulse shadow-glow">
            🎮 ניסיונות: {attempts}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudio}
            className={`text-lg px-4 py-2 border-4 font-bold transition-all duration-300 ${
              isEnabled 
                ? 'bg-gradient-success text-white border-green-300 animate-pulse-rainbow shadow-success' 
                : 'bg-gradient-electric text-white border-red-300 animate-wiggle shadow-electric'
            }`}
          >
            🔊 {isEnabled ? 'קול ON' : 'קול OFF'}
          </Button>
        </div>
      </div>

      {/* Timer Bar */}
      {isTimerActive && (
        <div className="mb-6">
          <TimerBar 
            isActive={isTimerActive} 
            onTimeUp={() => setIsTimerActive(false)}
            duration={4000} 
          />
        </div>
      )}

      <div className="max-w-8xl mx-auto space-y-8">
        {/* SLOT MACHINES LAYOUT - EXACT MIRROR OF ENGLISH VERSION */}
        <div className="space-y-6">
          {/* TOP ROWS - 6 SMALLER SLOTS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => {
              const categoryKey = categoryOrder[index];
              if (!categoryKey) {
                // Empty/disabled slot
                return (
                  <div key={`empty-top-${index}`} className="opacity-20 blur-lg pointer-events-none">
                    <SlotMachine
                      category="---"
                      options={[]}
                      selectedValue={null}
                      onSelectionChange={() => {}}
                      isMatched={false}
                      isCorrect={false}
                      isEnabled={false}
                    />
                  </div>
                );
              }
              
              const isActiveInLevel = activeCategoriesForLevel.includes(categoryKey);
              const isEnabled = enabledCategories.has(categoryKey) && isActiveInLevel;
              const containerClass = !isActiveInLevel ? "opacity-20 blur-lg pointer-events-none" : !isEnabled ? "opacity-40 blur-sm pointer-events-none" : "";
              const categoryOptions = torahCategories[categoryKey] || [];
              
              // Skip rendering if no options available
              if (categoryOptions.length === 0) {
                console.warn(`No options available for category: ${categoryKey}`);
                return (
                  <div key={`empty-top-${index}`} className="opacity-20 blur-lg pointer-events-none">
                    <SlotMachine
                      category="---"
                      options={[]}
                      selectedValue={null}
                      onSelectionChange={() => {}}
                      isMatched={false}
                      isCorrect={false}
                      isEnabled={false}
                    />
                  </div>
                );
              }
              
              const isMatched = false; // No individual slot matching in this design
              const isCorrect = false;
              
              return (
                <div key={categoryKey} className={containerClass}>
                  <SlotMachine
                    category={torahCategoryNames[categoryKey]}
                    options={categoryOptions}
                    selectedValue={selections[categoryKey]}
                    onSelectionChange={(value) => handleSelectionChange(categoryKey, value)}
                    audio={{ playSpinSound, playSelectSound }}
                    isMatched={isMatched}
                    isCorrect={isCorrect}
                    isEnabled={isEnabled}
                  />
                </div>
              );
            })}
          </div>
          
          {/* BOTTOM ROW - 3 LARGER SLOTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {Array.from({ length: 3 }).map((_, index) => {
              const slotIndex = index + 6;
              const categoryKey = categoryOrder[slotIndex];
              if (!categoryKey) {
                // Empty/disabled slot
                return (
                  <div key={`empty-bottom-${index}`} className="opacity-20 blur-lg pointer-events-none">
                    <div className="transform scale-110">
                      <SlotMachine
                        category="---"
                        options={[]}
                        selectedValue={null}
                        onSelectionChange={() => {}}
                        isMatched={false}
                        isCorrect={false}
                        isEnabled={false}
                      />
                    </div>
                  </div>
                );
              }
              
              const isActiveInLevel = activeCategoriesForLevel.includes(categoryKey);
              const isEnabled = enabledCategories.has(categoryKey) && isActiveInLevel;
              const containerClass = !isActiveInLevel ? "opacity-20 blur-lg pointer-events-none" : !isEnabled ? "opacity-40 blur-sm pointer-events-none" : "";
              const categoryOptions = torahCategories[categoryKey] || [];
              
              // Skip rendering if no options available
              if (categoryOptions.length === 0) {
                console.warn(`No options available for category: ${categoryKey}`);
                return (
                  <div key={`empty-bottom-${index}`} className="opacity-20 blur-lg pointer-events-none">
                    <div className="transform scale-110">
                      <SlotMachine
                        category="---"
                        options={[]}
                        selectedValue={null}
                        onSelectionChange={() => {}}
                        isMatched={false}
                        isCorrect={false}
                        isEnabled={false}
                      />
                    </div>
                  </div>
                );
              }
              
              const isMatched = false; // No individual slot matching in this design
              const isCorrect = false;
              
              return (
                <div key={categoryKey} className={containerClass}>
                  <div className="transform scale-110">
                    <SlotMachine
                      category={torahCategoryNames[categoryKey]}
                      options={categoryOptions}
                      selectedValue={selections[categoryKey]}
                      onSelectionChange={(value) => handleSelectionChange(categoryKey, value)}
                      audio={{ playSpinSound, playSelectSound }}
                      isMatched={isMatched}
                      isCorrect={isCorrect}
                      isEnabled={isEnabled}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUPER ACTION BUTTONS */}
        <Card className="p-6 bg-gradient-magical border-4 border-double border-yellow-400 shadow-rainbow">
          <div className="flex gap-3 justify-center items-center">
            {/* Level buttons */}
            {[1, 2, 3].map(levelNum => (
              <Button
                key={levelNum}
                onClick={() => {
                  setLevel(levelNum);
                  resetGame();
                  playButtonSound();
                }}
                className={`text-lg px-4 py-2 border-4 font-bold transition-all duration-300 ${
                  level === levelNum 
                    ? 'bg-gradient-success text-success-foreground border-yellow-300 animate-pulse-rainbow shadow-success' 
                    : 'bg-gradient-electric text-primary-foreground border-purple-300 hover:scale-110 shadow-electric'
                }`}
              >
                רמה {levelNum}
              </Button>
            ))}
            
            {/* Fixed container with consistent width to prevent jumping */}
            <div className="flex gap-3 min-w-[500px] justify-center items-center">
              {/* Check if all required categories are filled for current level */}
              {(() => {
                const allFilled = activeCategoriesForLevel.every(cat => {
                  const value = selections[cat];
                  return value !== null && value !== undefined && value !== "";
                });
                console.log(`CHECK MATCH visibility: Level ${level}, ${activeCategoriesForLevel.length} categories, all filled: ${allFilled}, matched: ${isMatched}`);
                return allFilled && !isMatched;
              })() && (
                <Button
                  onClick={checkMatch}
                  className="bg-gradient-success text-success-foreground text-lg px-6 py-2 border-4 border-white/30 hover:scale-110 transition-all duration-300 animate-pulse-rainbow shadow-success font-bold min-w-[220px]"
                >
                  <Sparkles className="h-5 w-5 mr-2 animate-disco-ball" />
                  ✨ בדוק התאמה! ✨
                </Button>
              )}
              
              <Button
                onClick={resetAll}
                className="bg-gradient-warm text-primary-foreground text-lg px-6 py-2 border-4 border-white/30 hover:scale-110 transition-all duration-300 animate-bounce-crazy shadow-rainbow font-bold min-w-[200px]"
              >
                🔄 משחק חדש! 🔄
              </Button>
            </div>
          </div>
        </Card>

        {/* LEARNING MODE DISPLAY */}
        {showingCorrectAnswer && (
          <Card className="p-12 bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-rainbow animate-pulse border-8 border-double border-cyan-300">
            <div className="text-center space-y-6">
              <div className="text-8xl animate-bounce">📚🎯📚</div>
              <h2 className="text-5xl font-bold animate-pulse text-cyan-100">
                🌟 זמן לימוד! 🌟
              </h2>
              <p className="text-2xl font-bold text-white">
                📖 למדו את ההתאמה המושלמת הזו! 📖
              </p>
              <div className="text-xl text-cyan-100">
                המשחק יתחדש אוטומטית בעוד 5 שניות... ⏰
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
                🌟 ניצחון מרהיב! 🌟
              </h2>
              <div className="text-7xl animate-pulse">🎊🎈🎊</div>
              <p className="text-4xl font-bold text-yellow-100 animate-bounce-crazy bg-red-600/30 px-6 py-3 rounded-full border-4 border-yellow-300">
                🧠 שליטה מעולה בידע התורה! 🧠
              </p>
              <div className="text-5xl animate-wiggle">⭐🌈⭐</div>
              <div className="text-2xl text-white/90 animate-pulse bg-green-600/30 px-4 py-2 rounded-lg">
                הרפתקה חדשה מתחילה בעוד 3 שניות! היכונו! ✨
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};