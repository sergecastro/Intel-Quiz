import { celebrateWin } from '../utils/celebration';
import { useState, useEffect, useRef } from 'react';
import { SlotMachine } from './SlotMachine';
import { TimerBar } from './TimerBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { holidayMatches, holidayCategories, holidayCategoryNames, HolidayCategoryKey } from '@/data/holidaysData';
import { Sparkles, RotateCcw, Trophy, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGameAudio } from '@/hooks/useGameAudio';
import { supabase } from '@/integrations/supabase/client';

interface Selections {
  [key: string]: string | null;
}

export const HolidaysGameBoard = () => {
  const [selections, setSelections] = useState<Selections>({});
  
  // Initialize selections based on Holiday categories
  useEffect(() => {
    const initialSelections: Selections = {};
    Object.keys(holidayCategories).forEach(key => {
      initialSelections[key] = null;
    });
    setSelections(initialSelections);
    setEnabledCategories(new Set([Object.keys(holidayCategories)[0]])); // Enable first category
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

  const categoryOrder = Object.keys(holidayCategories) as HolidayCategoryKey[];
  
  // Level-based active categories (5 slots total)
  const getLevelCategories = (currentLevel: number): HolidayCategoryKey[] => {
    const levels: Record<number, HolidayCategoryKey[]> = {
      1: ['name', 'story', 'food'],
      2: ['name', 'story', 'food', 'season'],
      3: ['name', 'story', 'food', 'season', 'symbol']
    };
    return levels[currentLevel] || categoryOrder.slice(0, 3);
  };
  
  const activeCategoriesForLevel = getLevelCategories(level);

  // Enhanced state management
  const [speechTimer, setSpeechTimer] = useState<NodeJS.Timeout | null>(null);
  const [categoryFailures, setCategoryFailures] = useState<Record<string, number>>({});
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set(['name']));
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
          speakText('ברוכים הבאים למשחק החגים! בחרו חג תחילה!');
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
        speakText('ברוכים הבאים למשחק החגים! בחרו חג תחילה!');
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
      }, 6000);
      
      return newSelections;
    });
    setIsMatched(false);
  };

  const provideFeedback = (category: string, value: string, currentSelections: Selections) => {
    const leadingCategory = 'name';
    
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
        const message = `${value}! עכשיו בחרו ${holidayCategoryNames[nextCategoryInLevel]}!`;
        speakText(message);
      }
      return;
    }

    const leadingValue = currentSelections[leadingCategory];
    const correctMatch = holidayMatches.find(match => match[leadingCategory as keyof typeof match] === leadingValue);
    
    if (!correctMatch) {
      const currentFailures = (categoryFailures[category] || 0) + 1;
      setCategoryFailures(prev => ({ ...prev, [category]: currentFailures }));
      
      playErrorSound();
      
      if (currentFailures >= 3) {
        const message = `לא! נסו חג אחר תחילה!`;
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
      
      const currentCategoryIndex = activeCategoriesForLevel.indexOf(category as HolidayCategoryKey);
      const nextCategoryInLevel = activeCategoriesForLevel[currentCategoryIndex + 1];

      // Show success toast
      toast({
        title: "✅ נכון!",
        description: `${value} - בחירה מעולה!`,
        variant: "default",
      });

      // Clear any pending feedback timer to prevent game freezing
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = null;
      }
      setIsTimerActive(false);

      if (nextCategoryInLevel) {
        setEnabledCategories(prev => new Set([...prev, nextCategoryInLevel]));
        const message = `נכון! ${value}! עכשיו ${holidayCategoryNames[nextCategoryInLevel]}!`;
        speakText(message);
      } else {
        const message = `נכון! ${value}! בדקו התאמה!`;
        speakText(message);
      }
    } else {
      playErrorSound();
      const currentFailures = (categoryFailures[category] || 0) + 1;
      setCategoryFailures(prev => ({ ...prev, [category]: currentFailures }));

      if (currentFailures >= 3) {
        const correctAnswer = correctMatch[category as keyof typeof correctMatch];
        const message = `לא! התשובה הנכונה ל${leadingValue} היא: ${correctAnswer}!`;
        speakText(message);
        
        // Enable next category after telling them the answer
        const nextCategoryIndex = activeCategoriesForLevel.indexOf(category as HolidayCategoryKey);
        const nextCategory = activeCategoriesForLevel[nextCategoryIndex + 1];
        
        if (nextCategory) {
          setEnabledCategories(prev => new Set([...prev, nextCategory]));
          setTimeout(() => {
            const message = `עכשיו ${holidayCategoryNames[nextCategory]}!`;
            speakText(message);
          }, 3000);
        }
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

    // Get the leading holiday name
    const leadingValue = selections['name'];
    if (!leadingValue) {
      toast({
        title: "❌ שגיאה",
        description: "בחרו חג תחילה!",
        variant: "destructive",
      });
      speakText('בחרו חג תחילה!');
      return;
    }

    // Find the correct match for this holiday
    const correctMatch = holidayMatches.find(match => match.name === leadingValue);
    
    if (!correctMatch) {
      toast({
        title: "❌ שגיאה", 
        description: "לא נמצא מידע עבור החג הזה",
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
    const leadingValue = selections['name'];
    const correctMatch = holidayMatches.find(match => match.name === leadingValue);
    
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
    Object.keys(holidayCategories).forEach(key => {
      initialSelections[key] = null;
    });
    setSelections(initialSelections);
    setIsMatched(false);
    setIsCorrect(false);
    setCategoryFailures({});
    setEnabledCategories(new Set(['name']));
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
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🔊</div>
              <h2 className="text-2xl font-bold mb-4">הפעלת קול</h2>
              <p className="text-lg mb-6">
                המשחק כולל דיבור והדרכה קולית בעברית. 
                הקישו כדי להפעיל את הקול!
              </p>
              <Button onClick={enableVoice} className="w-full text-xl h-14 bg-gradient-success">
                🎤 הפעילו קול!
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold bg-gradient-text mb-4 animate-rainbow-text">
          🕯️ משחק החגים היהודיים 🕯️
        </h1>
        <p className="text-2xl text-white mb-4">התאימו בין החגים לסיפוריהם, מאכליהם וסמליהם!</p>
        
        <div className="flex justify-center gap-4 items-center mb-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            רמה {level}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            ניקוד: {score}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            ניסיונות: {attempts}
          </Badge>
        </div>

        {isTimerActive && (
          <div className="mb-4">
            <TimerBar 
              isActive={isTimerActive} 
              onTimeUp={() => setIsTimerActive(false)} 
            />
          </div>
        )}
      </div>

      {/* Main Game Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {activeCategoriesForLevel.map(category => (
          <SlotMachine
            key={category}
            category={holidayCategoryNames[category]}
            options={holidayCategories[category]}
            selectedValue={selections[category]}
            onSelectionChange={(value) => handleSelectionChange(category, value)}
            isMatched={isMatched}
            isCorrect={isCorrect}
            isEnabled={enabledCategories.has(category)}
            audio={{
              playSpinSound,
              playSelectSound
            }}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={checkMatch}
          disabled={showingCorrectAnswer}
          className="text-xl px-8 py-4 h-auto bg-gradient-success hover:bg-gradient-success-hover shadow-rainbow border-4 border-yellow-300"
        >
          <Trophy className="mr-2" />
          בדקו התאמה!
        </Button>
        
        <Button
          onClick={resetGame}
          variant="outline"
          className="text-xl px-8 py-4 h-auto border-4 border-purple-300"
        >
          <RotateCcw className="mr-2" />
          משחק חדש
        </Button>

        <Button
          onClick={resetAll}
          variant="secondary"
          className="text-xl px-8 py-4 h-auto"
        >
          <Sparkles className="mr-2" />
          התחילו מהתחלה
        </Button>

        <Button
          onClick={toggleAudio}
          variant="ghost"
          className="text-xl px-8 py-4 h-auto"
        >
          {isEnabled ? '🔊' : '🔇'}
        </Button>
      </div>

      {/* Win Celebration */}
      {isMatched && isCorrect && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-12 bg-gradient-success text-white shadow-rainbow border-4 border-yellow-300 max-w-2xl mx-auto animate-bounce-crazy">
            <div className="text-center space-y-6">
              <div className="text-8xl mb-6">🎉</div>
              <h2 className="text-4xl font-bold mb-4">מצוין!</h2>
              <p className="text-2xl mb-6">השלמתם בהצלחה את רמה {level}!</p>
              <div className="text-6xl animate-spin">🏆</div>
            </div>
          </Card>
        </div>
      )}

      {/* Correct Answer Display */}
      {showingCorrectAnswer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-8 bg-gradient-warm text-white shadow-rainbow border-4 border-orange-300 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold mb-6">💡 התשובה הנכונה</h2>
              <p className="text-xl mb-4">למדו ותזכרו:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCategoriesForLevel.map(category => (
                  <div key={category} className="bg-black/20 p-4 rounded-lg">
                    <div className="font-bold text-lg mb-2">{holidayCategoryNames[category]}</div>
                    <div className="text-xl">{selections[category]}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};