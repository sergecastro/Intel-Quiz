import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { torahData, shuffle, TorahRound, TorahChoice } from "@/data/torahData";
import { useToast } from "@/hooks/use-toast";
import { useGameAudio } from "@/hooks/useGameAudio";
import { Clock, Star, Trophy, Zap } from "lucide-react";

// Declare confetti for CDN usage
declare global {
  interface Window {
    confetti: any;
  }
}

type FeedbackType = 'correct' | 'plausible' | 'funny' | 'wrong' | null;

interface GameState {
  currentRoundIndex: number;
  currentCategoryIndex: number;
  score: number;
  lives: number;
  isComplete: boolean;
  selections: { [roundIndex: number]: { [categoryIndex: number]: string } };
}

export const TorahGameShow = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRoundIndex: 0,
    currentCategoryIndex: 0,
    score: 0,
    lives: 3,
    isComplete: false,
    selections: {}
  });

  const [currentRound, setCurrentRound] = useState<TorahRound | null>(null);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [shuffledChoices, setShuffledChoices] = useState<TorahChoice[]>([]);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const { toast } = useToast();
  const { playSuccessSound, playErrorSound, playWinChime } = useGameAudio();

  // Initialize current question
  const initializeQuestion = useCallback(() => {
    if (gameState.currentRoundIndex >= torahData.length) {
      // Game completed!
      setGameState(prev => ({ ...prev, isComplete: true }));
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      playWinChime();
      return;
    }

    const round = torahData[gameState.currentRoundIndex];
    const category = round.categories[gameState.currentCategoryIndex];
    
    setCurrentRound(round);
    setCurrentCategory(category);
    setShuffledChoices(shuffle(category.choices));
    setFeedback(null);
    setShowAnswer(false);
    setTimeLeft(15);
    setIsTimerActive(true);
  }, [gameState.currentRoundIndex, gameState.currentCategoryIndex, playWinChime]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0 && !showAnswer) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, showAnswer]);

  const handleTimeUp = () => {
    playErrorSound();
    setGameState(prev => ({ ...prev, lives: prev.lives - 1 }));
    toast({
      title: "⏰ נגמר הזמן!",
      description: "התשובה הנכונה תוצג עכשיו",
      variant: "destructive"
    });
    setShowAnswer(true);
    setIsTimerActive(false);
  };

  const handleChoiceSelect = (choice: TorahChoice) => {
    if (showAnswer || !isTimerActive) return;

    setIsTimerActive(false);
    
    let feedbackType: FeedbackType = 'wrong';
    let points = 0;
    
    if (choice.correct) {
      feedbackType = 'correct';
      points = Math.max(50, timeLeft * 10); // Bonus for speed
      playSuccessSound();
      
      if (window.confetti) {
        window.confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 }
        });
      }
      
      toast({
        title: "נכון מעולה! ✨",
        description: `+${points} נקודות! ${choice.source ? `מקור: ${choice.source}` : ''}`,
      });
    } else {
      playErrorSound();
      
      if (choice.funny) {
        feedbackType = 'funny';
        toast({
          title: "😄 מצחיק!",
          description: "אבל לא מהתנ\"ך... המשך לנסות!",
          variant: "destructive",
        });
      } else if (choice.plausible) {
        feedbackType = 'plausible';
        toast({
          title: "קרוב מאוד! 🤔",
          description: choice.feedback || "כמעט נכון, אבל לא בדיוק...",
          variant: "destructive",
        });
      } else {
        toast({
          title: "לא נכון",
          description: "נסה שוב בפעם הבאה!",
          variant: "destructive",
        });
      }
      
      setGameState(prev => ({ ...prev, lives: prev.lives - 1 }));
    }

    setFeedback(feedbackType);
    setGameState(prev => ({ 
      ...prev, 
      score: prev.score + points,
      selections: {
        ...prev.selections,
        [prev.currentRoundIndex]: {
          ...prev.selections[prev.currentRoundIndex],
          [prev.currentCategoryIndex]: choice.text
        }
      }
    }));
    
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    const nextCategoryIndex = gameState.currentCategoryIndex + 1;
    const nextRoundIndex = gameState.currentRoundIndex;
    
    if (nextCategoryIndex >= (currentRound?.categories.length || 0)) {
      // Move to next round
      setGameState(prev => ({
        ...prev,
        currentRoundIndex: prev.currentRoundIndex + 1,
        currentCategoryIndex: 0
      }));
    } else {
      // Move to next category in same round
      setGameState(prev => ({
        ...prev,
        currentCategoryIndex: nextCategoryIndex
      }));
    }
  };

  const restartGame = () => {
    setGameState({
      currentRoundIndex: 0,
      currentCategoryIndex: 0,
      score: 0,
      lives: 3,
      isComplete: false,
      selections: {}
    });
  };

  useEffect(() => {
    initializeQuestion();
  }, [initializeQuestion]);

  // Game Over Check
  if (gameState.lives <= 0) {
    return (
      <div className="torah-background min-h-screen flex items-center justify-center p-4" dir="rtl">
        <Card className="torah-card max-w-lg text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="hebrew-title text-3xl font-bold text-destructive mb-4">
              המשחק נגמר
            </h2>
            <p className="hebrew-text text-xl mb-6">
              הניקוד הסופי שלך: {gameState.score}
            </p>
            <Button onClick={restartGame} className="torah-button text-lg px-8 py-3">
              נסה שוב
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Victory Screen
  if (gameState.isComplete) {
    return (
      <div className="torah-background min-h-screen flex items-center justify-center p-4" dir="rtl">
        <Card className="torah-card max-w-lg text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="hebrew-title text-3xl font-bold text-torah-gold mb-4">
              מזל טוב! ניצחת!
            </h2>
            <p className="hebrew-text text-xl mb-6">
              הניקוד הסופי שלך: {gameState.score}
            </p>
            <Button onClick={restartGame} className="torah-button text-lg px-8 py-3">
              שחק שוב
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentRound || !currentCategory) return null;

  const totalQuestions = torahData.reduce((sum, round) => sum + round.categories.length, 0);
  const currentQuestionNumber = 
    torahData.slice(0, gameState.currentRoundIndex).reduce((sum, round) => sum + round.categories.length, 0) +
    gameState.currentCategoryIndex + 1;
  
  const progressValue = (currentQuestionNumber / totalQuestions) * 100;

  return (
    <div className="torah-background min-h-screen p-4" dir="rtl">
      {/* Game Show Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Card className="torah-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2 bg-torah-gold/10 border-torah-gold">
                  <Trophy className="w-5 h-5 ml-2" />
                  <span className="hebrew-text">{gameState.score}</span>
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2 bg-destructive/10 border-destructive">
                  <span className="text-2xl ml-2">💖</span>
                  <span>{gameState.lives}</span>
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-torah-gold'}`}>
                  {timeLeft}
                </span>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="hebrew-text">שאלה {currentQuestionNumber} מתוך {totalQuestions}</span>
                <span className="hebrew-text">{Math.round(progressValue)}%</span>
              </div>
              <Progress value={progressValue} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        {/* Leading Character */}
        <div className="text-center mb-6">
          <Card className="torah-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Zap className="w-8 h-8 text-torah-gold" />
                <h2 className="hebrew-title text-4xl font-bold text-torah-gold">
                  {currentRound.lead}
                </h2>
                <Zap className="w-8 h-8 text-torah-gold" />
              </div>
              <h3 className="hebrew-title text-2xl font-semibold mb-2">
                {currentCategory.name}
              </h3>
              <p className="hebrew-text text-muted-foreground">
                בחר את התשובה הנכונה במהירות!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {shuffledChoices.map((choice, index) => {
            const isSelected = feedback !== null;
            const isCorrect = choice.correct;
            const isWrong = isSelected && !choice.correct;
            
            return (
              <Button
                key={index}
                variant="outline"
                disabled={showAnswer || !isTimerActive}
                onClick={() => handleChoiceSelect(choice)}
                className={`
                  p-6 h-auto min-h-[4rem] text-right hebrew-text text-lg
                  transition-all duration-300 transform hover:scale-105
                  ${showAnswer && isCorrect ? 'choice-correct animate-pulse' : ''}
                  ${showAnswer && isWrong ? 'choice-wrong' : ''}
                  ${!showAnswer && isTimerActive ? 'hover:shadow-lg hover:border-torah-gold' : ''}
                `}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">
                    {choice.correct && showAnswer ? '✅' : 
                     choice.funny ? '😄' : 
                     choice.plausible ? '🤔' : '📚'}
                  </span>
                  <span className="flex-1 text-right leading-relaxed">
                    {choice.text}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Answer Feedback */}
        {showAnswer && (
          <div className="text-center mb-6">
            <Card className="torah-card max-w-2xl mx-auto">
              <CardContent className="p-6">
                {currentCategory.choices.find(c => c.correct)?.source && (
                  <p className="hebrew-text text-torah-gold mb-4">
                    מקור: {currentCategory.choices.find(c => c.correct)?.source}
                  </p>
                )}
                <Button 
                  onClick={nextQuestion}
                  className="torah-button text-lg px-8 py-3"
                >
                  המשך לשאלה הבאה ←
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};