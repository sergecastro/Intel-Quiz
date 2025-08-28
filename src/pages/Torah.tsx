import { celebrateWin } from '../utils/celebration';
import { useState, useEffect, useRef } from 'react';
import { SlotMachine } from '@/components/SlotMachine';
import { TimerBar } from '@/components/TimerBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { torahMatches, torahCategories, torahCategoryNames, TorahCategoryKey } from '@/data/torahMatches';
import { Sparkles, RotateCcw, Trophy, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGameAudio } from '@/hooks/useGameAudio';
import { Link } from 'react-router-dom';

interface Selections {
  [key: string]: string | null;
}

export const Torah = () => {
  const [selections, setSelections] = useState<Selections>({});
  
  // Initialize selections
  useEffect(() => {
    const initialSelections: Selections = {};
    Object.keys(torahCategories).forEach(key => {
      initialSelections[key] = null;
    });
    setSelections(initialSelections);
    setEnabledCategories(new Set(['character'])); // Start with character
    setHasWelcomed(false);
  }, []);
  
  const [isMatched, setIsMatched] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
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
    
    // Use Web Speech API with Hebrew support
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
      } else {
        // All categories complete - check for full match
        checkRoundComplete(currentSelections, correctMatch);
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
          } else {
            checkRoundComplete({ ...currentSelections, [category]: correctAnswer }, correctMatch);
          }
        }, 3000);
      } else {
        const message = `לא נכון! נסו שוב!`;
        speakText(message);
      }
    }
  };

  const checkRoundComplete = (currentSelections: Selections, correctMatch: any) => {
    const allCorrect = activeCategoriesForLevel.every(category => {
      const selectedValue = currentSelections[category];
      const correctValue = correctMatch[category];
      return selectedValue === correctValue;
    });

    if (allCorrect) {
      setIsMatched(true);
      setIsCorrect(true);
      setScore(prev => prev + 100);
      playExcitementSound();
      
      const successMessage = level < 6 ? 'מעולה! עוברים לרמה הבאה!' : 'כל הכבוד! השלמתם את כל הרמות!';
      speakText(successMessage);
      
      toast({
        title: "🎉 מצוין!",
        description: successMessage,
      });

      setTimeout(() => {
        if (level < 6) {
          nextLevel();
        } else {
          celebrateWin();
        }
      }, 2000);
    }
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    resetRound();
  };

  const resetRound = () => {
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

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setAttempts(0);
    resetRound();
  };

  return (
    <div className="relative">
      {/* Navigation to English App */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <Button variant="outline" className="bg-background/80 backdrop-blur-sm" dir="ltr">
            🌍 English Quiz App
          </Button>
        </Link>
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-torah-gold/20 via-background to-torah-gold/10 p-4" dir="rtl">
      {/* Voice Prompt for iOS */}
      {showVoicePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm text-center torah-card">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-torah-gold" />
            <h3 className="text-lg font-bold mb-2 hebrew-title">הפעלת קול</h3>
            <p className="text-sm mb-4 hebrew-text">
              לחצו כאן להפעלת הקריינות בעברית
            </p>
            <Button onClick={enableVoice} className="bg-torah-gold hover:bg-torah-gold/90 text-white">
              הפעל קול
            </Button>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 hebrew-title text-torah-gold">
          משחק התורה
        </h1>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <Badge variant="secondary" className="hebrew-text">
            <Trophy className="w-4 h-4 mr-2" />
            ניקוד: {score}
          </Badge>
          <Badge variant="outline" className="hebrew-text">
            רמה: {level}/6
          </Badge>
          <Badge variant="outline" className="hebrew-text">
            קטגוריות: {activeCategoriesForLevel.length}/8
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudio}
            className={isEnabled ? 'text-green-600' : 'text-red-600'}
          >
            🔊 {isEnabled ? 'ON' : 'OFF'}
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

      {/* Slot Machines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {activeCategoriesForLevel.map((categoryKey) => {
          const category = categoryKey as TorahCategoryKey;
          const isEnabled = enabledCategories.has(category);
          
          return (
            <SlotMachine
              key={category}
              category={torahCategoryNames[category]}
              options={torahCategories[category]}
              selectedValue={selections[category]}
              onSelectionChange={(value) => handleSelectionChange(category, value)}
              isMatched={isMatched}
              isCorrect={isCorrect}
              isEnabled={isEnabled}
              audio={{
                playSpinSound,
                playSelectSound
              }}
            />
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        {isMatched && (
          <div className="mb-4">
            {level < 6 ? (
              <Button 
                onClick={nextLevel}
                className="bg-torah-gold hover:bg-torah-gold/90 text-white text-lg px-8 py-3 hebrew-text"
              >
                <Sparkles className="w-5 h-5 ml-2" />
                רמה הבאה
              </Button>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-torah-gold mb-4 hebrew-title">
                  🎉 מזל טוב! השלמתם את כל הרמות! 🎉
                </h2>
              </div>
            )}
          </div>
        )}
        
        <Button 
          onClick={resetGame}
          variant="outline" 
          className="hebrew-text"
        >
          <RotateCcw className="w-4 h-4 ml-2" />
          משחק חדש
        </Button>
      </div>
    </div>
    </div>
  );
};

export default Torah;