import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TorahSlotMachine } from "./TorahSlotMachine";
import { torahData, shuffle, TorahRound, TorahChoice } from "@/data/torahData";
import { useToast } from "@/hooks/use-toast";
import { useGameAudio } from "@/hooks/useGameAudio";

type FeedbackType = 'correct' | 'plausible' | 'funny' | 'wrong' | null;

interface Selections {
  [category: string]: string;
}

interface CategoryFeedback {
  [category: string]: FeedbackType;
}

interface CategoryFailures {
  [category: string]: number;
}

export const TorahGameBoard = () => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState<TorahRound | null>(null);
  const [selections, setSelections] = useState<Selections>({});
  const [categoryFeedback, setCategoryFeedback] = useState<CategoryFeedback>({});
  const [categoryFailures, setCategoryFailures] = useState<CategoryFailures>({});
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set());
  const [isGameStarted, setIsGameStarted] = useState(false);

  const { toast } = useToast();
  const { playSuccessSound, playErrorSound, playWinChime } = useGameAudio();

  const initializeRound = useCallback(() => {
    if (currentRoundIndex >= torahData.length) {
      // Game completed
      toast({
        title: "🎉 כל הכבוד!",
        description: "סיימת את כל הסבבים בהצלחה!",
      });
      return;
    }

    const round = torahData[currentRoundIndex];
    
    // Shuffle choices for each category
    const shuffledRound = {
      ...round,
      categories: round.categories.map(category => ({
        ...category,
        choices: shuffle(category.choices)
      }))
    };

    setCurrentRound(shuffledRound);
    setSelections({});
    setCategoryFeedback({});
    setCategoryFailures({});
    setIsRoundComplete(false);
    
    // Enable all categories for this round
    const categoryNames = new Set(shuffledRound.categories.map(cat => cat.name));
    setEnabledCategories(categoryNames);
    
    setIsGameStarted(true);
  }, [currentRoundIndex, toast]);

  useEffect(() => {
    initializeRound();
  }, [initializeRound]);

  const handleSelectionChange = useCallback((category: string, value: string) => {
    if (!currentRound) return;

    setSelections(prev => ({ ...prev, [category]: value }));
    
    // Find the selected choice
    const categoryData = currentRound.categories.find(cat => cat.name === category);
    const selectedChoice = categoryData?.choices.find(choice => choice.text === value);
    
    if (!selectedChoice) return;

    // Determine feedback type
    let feedbackType: FeedbackType = 'wrong';
    if (selectedChoice.correct) {
      feedbackType = 'correct';
      playSuccessSound();
      toast({
        title: "נכון! ✨",
        description: selectedChoice.source ? `מקור: ${selectedChoice.source}` : "תשובה מצוינת!",
      });
    } else if (selectedChoice.funny) {
      feedbackType = 'funny';
      playErrorSound();
      toast({
        title: "😄 מצחיק!",
        description: "אבל לא מהתנ\"ך... נסה שוב",
        variant: "destructive",
      });
    } else if (selectedChoice.plausible) {
      feedbackType = 'plausible';
      playErrorSound();
      toast({
        title: "קרוב! 🤔",
        description: selectedChoice.feedback || "כמעט... נסה שוב",
        variant: "destructive",
      });
    } else {
      feedbackType = 'wrong';
      playErrorSound();
      toast({
        title: "לא נכון",
        description: "נסה שוב",
        variant: "destructive",
      });
    }

    setCategoryFeedback(prev => ({ ...prev, [category]: feedbackType }));

    if (feedbackType !== 'correct') {
      // Track failures for this category
      const currentFailures = (categoryFailures[category] || 0) + 1;
      setCategoryFailures(prev => ({ ...prev, [category]: currentFailures }));

      if (currentFailures >= 3) {
        // After 3 failures, show the correct answer
        const correctChoice = categoryData?.choices.find(choice => choice.correct);
        if (correctChoice) {
          toast({
            title: "💡 התשובה הנכונה:",
            description: `${correctChoice.text}${correctChoice.source ? ` (${correctChoice.source})` : ''}`,
          });
        }
      }
    }

    setAttempts(prev => prev + 1);
  }, [currentRound, categoryFailures, toast, playSuccessSound, playErrorSound]);

  const checkRoundComplete = useCallback(() => {
    if (!currentRound) return false;

    const allCorrect = currentRound.categories.every(category => {
      const selection = selections[category.name];
      const selectedChoice = category.choices.find(choice => choice.text === selection);
      return selectedChoice?.correct === true;
    });

    if (allCorrect && Object.keys(selections).length === currentRound.categories.length) {
      setIsRoundComplete(true);
      setScore(prev => prev + 100);
      playWinChime();
      
      toast({
        title: "🎉 מזל טוב!",
        description: `סיימת את הסבב על ${currentRound.lead} בהצלחה!`,
      });
      
      return true;
    }
    
    return false;
  }, [currentRound, selections, toast, playWinChime]);

  useEffect(() => {
    checkRoundComplete();
  }, [checkRoundComplete]);

  const nextRound = () => {
    setCurrentRoundIndex(prev => prev + 1);
  };

  const resetGame = () => {
    setCurrentRoundIndex(0);
    setScore(0);
    setAttempts(0);
    setIsGameStarted(false);
  };

  if (!currentRound) {
    return (
      <div className="torah-background flex items-center justify-center p-8">
        <Card className="torah-card">
          <CardContent className="p-8 text-center">
            <h1 className="hebrew-title text-3xl font-bold text-torah-gold mb-4">
              לימוד תורה אינטרקטיבי
            </h1>
            <p className="hebrew-text text-lg mb-6">
              בחן את הידע שלך בתורה שבכתב
            </p>
            <Button onClick={initializeRound} className="torah-button text-lg px-8 py-3">
              התחל משחק
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressValue = ((currentRoundIndex + (isRoundComplete ? 1 : 0)) / torahData.length) * 100;

  return (
    <div className="torah-background min-h-screen p-4" dir="rtl">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="torah-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="text-center lg:text-right">
                <h1 className="hebrew-title text-2xl lg:text-3xl font-bold text-torah-gold mb-2">
                  לימוד תורה אינטרקטיבי
                </h1>
                <p className="hebrew-text text-lg text-muted-foreground">
                  בראשית • שמות • ויקרא • במדבר • דברים
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <span className="hebrew-text">ניקוד: {score}</span>
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <span className="hebrew-text">נסיונות: {attempts}</span>
                </Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="hebrew-text text-sm font-medium">
                  סבב {currentRoundIndex + 1} מתוך {torahData.length}
                </span>
                <span className="hebrew-text text-sm text-muted-foreground">
                  {Math.round(progressValue)}% הושלם
                </span>
              </div>
              <Progress value={progressValue} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto">
        {/* Lead Character */}
        <div className="text-center mb-8">
          <Card className="torah-card max-w-md mx-auto">
            <CardContent className="p-6">
              <h2 className="hebrew-title text-3xl font-bold text-torah-gold mb-2">
                🧭 {currentRound.lead}
              </h2>
              <p className="hebrew-text text-muted-foreground">
                מצא את ההתאמות הנכונות
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {currentRound.categories.map((category) => (
            <TorahSlotMachine
              key={category.name}
              category={category.name}
              choices={category.choices}
              onSelectionChange={(value) => handleSelectionChange(category.name, value)}
              selectedValue={selections[category.name] || ""}
              isEnabled={enabledCategories.has(category.name)}
              feedback={categoryFeedback[category.name]}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {isRoundComplete ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="hebrew-text text-xl font-bold text-torah-gold mb-4">
                  🎉 כל הכבוד! סיימת את הסבב בהצלחה
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {currentRoundIndex < torahData.length - 1 ? (
                  <Button 
                    onClick={nextRound} 
                    className="torah-button text-lg px-8 py-3"
                  >
                    סבב הבא ←
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="hebrew-text text-2xl font-bold text-torah-gold mb-4">
                      🏆 סיימת את כל המשחק!
                    </p>
                    <Button 
                      onClick={resetGame} 
                      className="torah-button text-lg px-8 py-3"
                    >
                      התחל מחדש
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={resetGame} 
                  variant="outline"
                  className="text-lg px-8 py-3 hebrew-text"
                >
                  איפוס משחק
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="hebrew-text text-lg text-muted-foreground mb-4">
                בחר תשובה בכל קטגוריה להשלמת הסבב
              </p>
              <p className="hebrew-text text-sm text-muted-foreground">
                💡 לאחר 3 טעויות בקטגוריה תוצג התשובה הנכונה
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};