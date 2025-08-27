import { celebrateWin } from '../utils/celebration';
import { useState, useEffect, useRef } from 'react';
import { SlotMachine } from './SlotMachine';
import { FlagSlotMachine } from './FlagSlotMachine';
import { TimerBar } from './TimerBar';
import { CountryCelebration } from './CountryCelebration';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subjects, SubjectKey, AnyCategoryKey } from '@/data/subjects';
import { SubjectSelector } from './SubjectSelector';
import { Sparkles, RotateCcw, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGameAudio } from '@/hooks/useGameAudio';
import { supabase } from '@/integrations/supabase/client';

interface Selections {
  [key: string]: string | null;
}

export const GameBoard = () => {
  const [currentSubject, setCurrentSubject] = useState<SubjectKey>('geography');
  const [selections, setSelections] = useState<Selections>({});
  
  // Get current subject data
  const subjectData = subjects[currentSubject];
  const matches = subjectData.matches;
  const subjectCategories = subjectData.categories;
  const subjectCategoryNames = subjectData.categoryNames;
  
  // Initialize selections based on current subject
  useEffect(() => {
    const initialSelections: Selections = {};
    Object.keys(subjectData.categories).forEach(key => {
      initialSelections[key] = null;
    });
    setSelections(initialSelections);
    setEnabledCategories(new Set([Object.keys(subjectData.categories)[0]])); // Enable first category
    setHasWelcomed(false);
  }, [currentSubject]);
  
  const [isMatched, setIsMatched] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationCountry, setCelebrationCountry] = useState<string>('');
  const speechQueueRef = useRef<string[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showVoicePrompt, setShowVoicePrompt] = useState(false);
  const [level, setLevel] = useState(1);
  
  const { toast } = useToast();
  const { playButtonSound, playErrorSound, playSpinSound, playSelectSound, playCountryMusic, playExcitementSound, toggleAudio, isEnabled } = useGameAudio();

  // Enhanced Text-to-Speech function with queue and error handling
  const speakText = async (text: string) => {
    console.log(`speakText called with: "${text}"`);
    
    // Check if voice is enabled (important for iOS)
    if (!voiceEnabled) {
      console.log('Voice not enabled yet, skipping speech');
      return;
    }
    
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
      // iOS Safari detection and special handling
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      // Cancel any existing speech to avoid conflicts
      window.speechSynthesis.cancel();
      
      // iOS needs a delay after canceling and voice loading
      const delay = isIOS ? 200 : 50;
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 1.0; // Max volume for iOS
        utterance.lang = 'en-US';
        
        // iOS-specific voice selection for better compatibility
        if (isIOS || isSafari) {
          const setVoiceAndSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log('Available voices:', voices.map(v => v.name));
            
            // Prefer enhanced or high-quality English voices on iOS
            let selectedVoice = voices.find(voice => 
              voice.lang.includes('en') && (
                voice.name.includes('Enhanced') ||
                voice.name.includes('Premium') ||
                voice.name.includes('Samantha') ||
                voice.name.includes('Alex')
              )
            );
            
            // Fallback to any English voice
            if (!selectedVoice) {
              selectedVoice = voices.find(voice => voice.lang.includes('en'));
            }
            
            if (selectedVoice) {
              utterance.voice = selectedVoice;
              console.log('Selected voice:', selectedVoice.name);
            }
            
            utterance.onend = () => {
              console.log('Web Speech playback ended');
              setTimeout(() => processNextSpeech(), 300);
            };
            
            utterance.onerror = (event) => {
              console.log('Web Speech error:', event.error, 'continuing anyway');
              setTimeout(() => processNextSpeech(), 300);
            };
            
            // Ensure speechSynthesis is ready before speaking
            try {
              window.speechSynthesis.speak(utterance);
            } catch (error) {
              console.log('Speech synthesis error:', error);
              setTimeout(() => processNextSpeech(), 300);
            }
          };
          
          // Wait for voices to be loaded on iOS
          if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
              window.speechSynthesis.onvoiceschanged = null;
              setVoiceAndSpeak();
            };
          } else {
            setVoiceAndSpeak();
          }
        } else {
          // Non-iOS devices
          utterance.onend = () => {
            console.log('Web Speech playback ended');
            setTimeout(() => processNextSpeech(), 300);
          };
          
          utterance.onerror = (event) => {
            console.log('Web Speech error:', event.error, 'continuing anyway');
            setTimeout(() => processNextSpeech(), 300);
          };
          
          window.speechSynthesis.speak(utterance);
        }
      }, delay);
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

  const categoryOrder = Object.keys(subjectData.categories);
  
  // Level-based active categories
  const getLevelCategories = (currentLevel: number): string[] => {
    return subjectData.levels[currentLevel] || Object.keys(subjectData.categories).slice(0, 3);
  };
  
  const activeCategoriesForLevel = getLevelCategories(level);

  // Enhanced state management for robust selection handling
  const [speechTimer, setSpeechTimer] = useState<NodeJS.Timeout | null>(null);
  const [categoryFailures, setCategoryFailures] = useState<Record<string, number>>({});
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set([Object.keys(subjectData.categories)[0]]));
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const latestSelectionRef = useRef<{category: string, value: string} | null>(null);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check for iOS on mount and show voice prompt
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !voiceEnabled) {
      setShowVoicePrompt(true);
    } else if (!isIOS) {
      setVoiceEnabled(true); // Auto-enable for non-iOS
    }
  }, [voiceEnabled]);

  // Enhanced voice enablement for iOS
  const enableVoice = async () => {
    try {
      // Test speech synthesis with user interaction
      const testUtterance = new SpeechSynthesisUtterance('Voice enabled!');
      testUtterance.volume = 0.1; // Very quiet test
      window.speechSynthesis.speak(testUtterance);
      
      setVoiceEnabled(true);
      setShowVoicePrompt(false);
      
      // Welcome message after enabling voice
      setTimeout(() => {
        if (!hasWelcomed) {
          const firstCategory = Object.keys(subjectData.categories)[0];
          const firstCategoryName = subjectData.categoryNames[firstCategory];
          speakText(`WELCOME TO ${subjectData.name.toUpperCase()} MATCHING GAME! PLEASE CHOOSE THE ${firstCategoryName.toUpperCase()} FIRST!`);
          setHasWelcomed(true);
        }
      }, 500);
    } catch (error) {
      console.log('Voice enablement failed:', error);
      setVoiceEnabled(true); // Continue anyway
      setShowVoicePrompt(false);
    }
  };

  // Welcome message on component mount
  useEffect(() => {
    if (!hasWelcomed && voiceEnabled) {
      setTimeout(() => {
        const firstCategory = Object.keys(subjectData.categories)[0];
        const firstCategoryName = subjectData.categoryNames[firstCategory];
        speakText(`WELCOME TO ${subjectData.name.toUpperCase()} MATCHING GAME! PLEASE CHOOSE THE ${firstCategoryName.toUpperCase()} FIRST!`);
        setHasWelcomed(true);
      }, 1000);
    }
  }, [hasWelcomed, voiceEnabled]);

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

  const handleSelectionChange = (category: string, value: string) => {
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
      }, 4000);
      
      return newSelections;
    });
    setIsMatched(false);
  };

  const provideFeedback = (category: string, value: string, currentSelections: Selections) => {
    console.log(`provideFeedback called: category=${category}, value=${value}, selections=`, currentSelections);
    
    // Rule 1 & 2: Don't speak until leading category is chosen
    const leadingCategory = categoryOrder[0];
    if (category !== leadingCategory && !currentSelections[leadingCategory]) {
      console.log('No leading category selected yet, skipping feedback');
      return;
    }

    if (category === leadingCategory) {
      console.log(`${leadingCategory} selected: ${value} - enabling next category and speaking`);
      // Reset failures when new country is chosen
      setCategoryFailures({});
      
      // Enable next category based on level
      const nextCategoryInLevel = activeCategoriesForLevel.find(cat => 
        categoryOrder.indexOf(cat) > categoryOrder.indexOf(leadingCategory)
      );
      
      if (nextCategoryInLevel) {
        setEnabledCategories(new Set([leadingCategory, nextCategoryInLevel]));
        console.log(`Enabled categories updated to ${leadingCategory} and ${nextCategoryInLevel}`);
        
        const message = `${value.toUpperCase()}! NOW CHOOSE ${subjectCategoryNames[nextCategoryInLevel].toUpperCase()}!`;
        console.log(`Speaking: ${message}`);
        speakText(message);
      } else {
        // If no next category (shouldn't happen but defensive programming)
        const message = `${value.toUpperCase()}! GREAT CHOICE!`;
        console.log(`Speaking: ${message}`);
        speakText(message);
      }
      return;
    }

    console.log(`Providing feedback for ${category}: ${value}`);
    
    // For other categories, check if choice is correct for selected country
    const correctMatch = matches.find(match => match[categoryOrder[0]] === currentSelections[categoryOrder[0]]);
    if (!correctMatch) {
      console.log('No correct match found for leading item:', currentSelections[categoryOrder[0]]);
      return;
    }

    const isCorrect = correctMatch[category] === value;
    const nextCategoryIndex = categoryOrder.indexOf(category) + 1;
    const nextCategory = nextCategoryIndex < categoryOrder.length ? categoryOrder[nextCategoryIndex] : null;

    if (isCorrect) {
      // Reset failures for this category on success
      setCategoryFailures(prev => ({ ...prev, [category]: 0 }));
      
      // Find the next category in the level progression
      const currentCategoryIndex = activeCategoriesForLevel.indexOf(category);
      const nextCategoryInLevel = activeCategoriesForLevel[currentCategoryIndex + 1];
      
      // Enable the next category when current one is correct
      if (nextCategoryInLevel) {
        setEnabledCategories(prev => {
          const newSet = new Set(prev);
          newSet.add(nextCategoryInLevel);
          console.log(`Enabled next category: ${nextCategoryInLevel}, all enabled:`, Array.from(newSet));
          return newSet;
        });
        
        let message = `CORRECT! ${value.toUpperCase()}! NOW ${subjectCategoryNames[nextCategoryInLevel].toUpperCase()}!`;
        console.log(`Speaking success message: ${message}`);
        speakText(message);
      } else {
        // No more categories to unlock, ready to check match
        let message = `CORRECT! ${value.toUpperCase()}! CHECK MATCH!`;
        console.log(`Speaking success message: ${message}`);
        speakText(message);
      }
    } else {
      // Track failures for this category
      const currentFailures = (categoryFailures[category] || 0) + 1;
      setCategoryFailures(prev => ({ ...prev, [category]: currentFailures }));
      
      if (currentFailures >= 3) {
        // After 3 failures, reveal the correct answer
        const correctValue = correctMatch[category];
        const message = `NO! CORRECT ${subjectCategoryNames[category].toUpperCase()} IS ${correctValue?.toUpperCase()}!`;
        console.log(`Speaking failure message (3 tries): ${message}`);
        speakText(message);
      } else {
        // Don't reveal answer, just say it's wrong
        const message = `NO! ${value.toUpperCase()} WRONG! TRY AGAIN!`;
        console.log(`Speaking failure message: ${message}`);
        speakText(message);
      }
    }
  };

  const checkMatch = () => {
    playButtonSound();
    console.log('Current selections:', selections);
    const allSelected = activeCategoriesForLevel.every(cat => {
      const value = selections[cat];
      console.log(`Category ${cat}: "${value}" (type: ${typeof value})`);
      return value && value !== null && value !== "";
    });
    console.log('All selected:', allSelected);
    
    if (!allSelected) {
      playErrorSound();
      toast({
        title: "Incomplete Selection",
        description: `Please select all items for Level ${level}!`,
        variant: "destructive"
      });
      return;
    }

    setAttempts(prev => prev + 1);

    // Find if there's a matching set (only check active categories for current level)
    const match = matches.find(gameMatch => 
      activeCategoriesForLevel.every(cat => gameMatch[cat] === selections[cat])
    );

    setIsMatched(true);

    if (match) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      setConsecutiveFailures(0);  // Reset failures on success

      // 🎉 Show champagne overlay now; run your existing flow AFTER closing it
      const leadingItem = match[categoryOrder[0]];
      celebrateWin({
        title: `Celebrate ${leadingItem}! 🎉`,
        sub:  `Great job — everything matches ${leadingItem}.`,
        // flag: `/assets/flags/${match.country.toLowerCase()}.svg`, // optional if you have this path
        onDone: () => {
          // Voice AFTER celebration
          speakText(`PERFECT! ${leadingItem} WINS!`);

          // Country celebration popup AFTER celebration (only for geography)
          if (currentSubject === 'geography') {
            setCelebrationCountry(leadingItem);
            setShowCelebration(true);
            
            // Music AFTER popup (only for geography)
            setTimeout(() => {
              playCountryMusic(leadingItem);
              setTimeout(() => playCountryMusic(leadingItem), 8000);
              setTimeout(() => playCountryMusic(leadingItem), 16000);
            }, 1000);
          }

          // Toast AFTER celebration
          toast({
            title: "🎉 INCREDIBLE MATCH! 🎉",
            description: `🌟 AMAZING! You matched ${leadingItem} perfectly! ${currentSubject === 'geography' ? '🎵 Listen to their beautiful children\'s song! 🎶' : '📚 Excellent knowledge! 🧠'}`,
            variant: "default"
          });
        }
      });

      // Prevent any old win code below (none in this file), and avoid quick reset
      return;
    } else {
      setIsCorrect(false);
      const newFailures = consecutiveFailures + 1;
      setConsecutiveFailures(newFailures);
      
      // Provide specific feedback about what's wrong
      const leadingItem = selections[categoryOrder[0]];
      const secondItem = selections[categoryOrder[1]];
      
      // Find correct capital for selected country
      const correctMatch = matches.find(m => m[categoryOrder[0]] === selections[categoryOrder[0]]);
      let feedbackText = "That combination is not correct. ";
      
      if (selections[categoryOrder[0]] && selections[categoryOrder[1]] && correctMatch && correctMatch[categoryOrder[1]] !== selections[categoryOrder[1]]) {
        feedbackText = `${selections[categoryOrder[1]]} is not the ${subjectCategoryNames[categoryOrder[1]]} of ${selections[categoryOrder[0]]}. The correct ${subjectCategoryNames[categoryOrder[1]]} is ${correctMatch[categoryOrder[1]]}. Try again!`;
      }
      
      speakText(feedbackText);
      
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
    // Use the user's selected leading item to teach the correct match
    const userSelectedLeadingItem = selections[categoryOrder[0]];
    const correctMatch = matches.find(match => match[categoryOrder[0]] === userSelectedLeadingItem) || 
                        matches[Math.floor(Math.random() * matches.length)];
    
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
          const leadingCategory = categoryOrder[0];
          const leadingValue = correctMatch[leadingCategory];
          speakText(`Here's the perfect match! ${leadingValue} is the ${subjectCategoryNames[leadingCategory]}!`);
          
          // Set selections one by one with voice feedback
          setSelections(prev => ({ ...prev, [leadingCategory]: leadingValue }));
          
          // Show other categories in sequence
          activeCategoriesForLevel.slice(1).forEach((cat, index) => {
            setTimeout(() => {
              const value = correctMatch[cat];
              speakText(`${value} is the ${subjectCategoryNames[cat]} of ${leadingValue}!`);
              setSelections(prev => ({ ...prev, [cat]: value }));
            }, (index + 1) * 1000);
          });
          
          // Final message
          setTimeout(() => {
            speakText(`Study this perfect match for ${leadingValue}!`);
            
            toast({
              title: "🎓 EDUCATIONAL MOMENT! 🎓",
              description: `Perfect match for ${leadingValue}! Learn this combination!`,
              variant: "default"
            });
          }, activeCategoriesForLevel.length * 1000);
          
          // Reset after showing the complete match
          setTimeout(() => {
            setShowingCorrectAnswer(false);
            setConsecutiveFailures(0);
            resetGame();
            speakText("Now try again with what you've learned!");
          }, (activeCategoriesForLevel.length + 5) * 1000);
          
        }, 2000);
      }
    }, 1500); // Spin every 1.5 seconds
  };

  const resetGame = () => {
    console.log('resetGame called');
    const initialSelections: Selections = {};
    Object.keys(subjectData.categories).forEach(key => {
      initialSelections[key] = null;
    });
    setSelections(initialSelections);
    setIsMatched(false);
    setIsCorrect(false);
    // Reset enabled categories to only the first one
    setEnabledCategories(new Set([categoryOrder[0]]));
    // Reset welcome message so it shows again
    setHasWelcomed(false);
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
      {/* Voice Enable Prompt for iOS */}
      {showVoicePrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-8 bg-gradient-electric text-white shadow-rainbow border-4 border-yellow-300 max-w-md mx-auto">
            <div className="text-center space-y-6">
              <div className="text-6xl animate-bounce">🔊</div>
              <h2 className="text-2xl font-bold text-white">
                Enable Voice Features
              </h2>
              <p className="text-lg text-white/90">
                Tap the button below to enable voice narration and make the game more exciting!
              </p>
              <Button
                onClick={enableVoice}
                size="lg"
                className="bg-gradient-success text-white text-xl px-8 py-4 border-4 border-white/30 hover:scale-110 transition-all duration-300 animate-pulse-rainbow font-bold"
              >
                🎵 ENABLE VOICE 🎵
              </Button>
              <p className="text-sm text-white/70">
                (Required for iPhone/iPad voice features)
              </p>
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* SUPER EXCITING HEADER */}
        <Card className="p-8 bg-gradient-electric text-white shadow-rainbow animate-pulse-rainbow border-4 border-double border-white/30">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sparkles className="h-12 w-12 animate-disco-ball text-yellow-300" />
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl py-4 px-8 border-4 border-yellow-400 shadow-2xl">
                  🌍 INTELLIGENT QUIZ ADVENTURE! 🌍
                </h1>
                <Sparkles className="h-12 w-12 animate-disco-ball text-yellow-300" />
              </div>
              <SubjectSelector 
                selectedSubject={currentSubject}
                onSubjectChange={(newSubject) => {
                  setCurrentSubject(newSubject);
                  resetAll();
                }}
              />
            </div>
            <p className="text-2xl font-bold text-white bg-blue-800/80 px-4 py-2 rounded-2xl border-2 border-yellow-300 shadow-lg">
              🎵 Master {subjectData.name} with interactive learning! 🎵
            </p>
            <div className="text-lg font-semibold text-white bg-purple-800/80 px-4 py-2 rounded-2xl border-2 border-pink-300 shadow-lg">
              Spin the magical slots and explore {subjectData.name}! 🎰✨
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
            const isActiveInLevel = activeCategoriesForLevel.includes(categoryKey);
            const isEnabled = enabledCategories.has(categoryKey) && isActiveInLevel;
            const containerClass = !isActiveInLevel ? "opacity-20 blur-lg pointer-events-none" : !isEnabled ? "opacity-40 blur-sm pointer-events-none" : "";
            const categoryOptions = subjectCategories[categoryKey] || []; // Defensive programming
            
            // Skip rendering if no options available
            if (categoryOptions.length === 0) {
              console.warn(`No options available for category: ${categoryKey}`);
              return null;
            }
            
            if (categoryKey === 'flag') {
              return (
                <div key={categoryKey} className={containerClass}>
                  <FlagSlotMachine
                    category={subjectCategoryNames[categoryKey]}
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
            }
            return (
              <div key={categoryKey} className={containerClass}>
                <SlotMachine
                  category={subjectCategoryNames[categoryKey]}
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
                LEVEL {levelNum}
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
                  ✨ CHECK MATCH! ✨
                </Button>
              )}
              
              <Button
                onClick={resetAll}
                className="bg-gradient-warm text-primary-foreground text-lg px-6 py-2 border-4 border-white/30 hover:scale-110 transition-all duration-300 animate-bounce-crazy shadow-rainbow font-bold min-w-[200px]"
              >
                🔄 NEW GAME! 🔄
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
                {currentSubject === 'geography' ? '🎵 ENJOY THE COUNTRY\'S BEAUTIFUL MUSIC! 🎵' : '🧠 EXCELLENT KNOWLEDGE MASTERY! 🧠'}
              </p>
              <div className="text-5xl animate-wiggle">⭐🌈⭐</div>
              <div className="text-2xl text-white/90 animate-pulse bg-green-600/30 px-4 py-2 rounded-lg">
                New adventure starts in 3 seconds! Get ready! ✨
              </div>
            </div>
          </Card>
        )}
        
        {/* Country Celebration Popup - only show for geography */}
        {currentSubject === 'geography' && (
          <CountryCelebration 
            country={celebrationCountry}
            isOpen={showCelebration}
            onClose={() => setShowCelebration(false)}
          />
        )}
      </div>
    </div>
  );
};
