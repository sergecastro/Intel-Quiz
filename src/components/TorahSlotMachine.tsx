import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TorahChoice } from "@/data/torahData";

interface TorahSlotMachineProps {
  category: string;
  choices: TorahChoice[];
  onSelectionChange: (value: string) => void;
  selectedValue: string;
  isEnabled: boolean;
  feedback?: 'correct' | 'plausible' | 'funny' | 'wrong' | null;
}

export const TorahSlotMachine = ({
  category,
  choices,
  onSelectionChange,
  selectedValue,
  isEnabled,
  feedback
}: TorahSlotMachineProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleChoice = (choice: TorahChoice) => {
    if (!isEnabled) return;
    onSelectionChange(choice.text);
  };

  const getFeedbackClass = (choice: TorahChoice) => {
    if (selectedValue !== choice.text || !feedback) return "";
    
    switch (feedback) {
      case 'correct':
        return "choice-correct";
      case 'plausible':
        return "choice-plausible";
      case 'funny':
        return "choice-funny";
      case 'wrong':
        return "choice-wrong";
      default:
        return "";
    }
  };

  const getChoiceIcon = (choice: TorahChoice) => {
    if (choice.correct) return "✨";
    if (choice.funny) return "😄";
    if (choice.plausible) return "🤔";
    return "📚";
  };

  return (
    <Card className={`torah-card transition-all duration-300 ${!isEnabled ? 'opacity-50' : ''}`}>
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="hebrew-title text-lg font-bold text-torah-gold mb-2">
            {category}
          </h3>
        </div>

        <div className="space-y-2">
          {choices.map((choice, index) => (
            <Button
              key={index}
              variant="outline"
              className={`
                w-full text-right hebrew-text p-3 h-auto min-h-[3rem]
                ${selectedValue === choice.text ? 'ring-2 ring-torah-gold' : ''}
                ${getFeedbackClass(choice)}
                ${!isEnabled ? 'cursor-not-allowed' : 'hover:border-torah-gold hover:bg-torah-gold/10'}
                transition-all duration-300
              `}
              onClick={() => handleChoice(choice)}
              disabled={!isEnabled}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-lg ml-2">
                  {getChoiceIcon(choice)}
                </span>
                <span className="flex-1 text-right leading-relaxed">
                  {choice.text}
                </span>
              </div>
            </Button>
          ))}
        </div>

        {feedback && selectedValue && (
          <div className="mt-4 p-3 rounded-lg bg-muted">
            <div className="hebrew-text text-sm">
              {choices.find(c => c.text === selectedValue)?.feedback && (
                <p className="text-muted-foreground">
                  {choices.find(c => c.text === selectedValue)?.feedback}
                </p>
              )}
              {choices.find(c => c.text === selectedValue)?.source && (
                <p className="text-xs text-torah-gold mt-1">
                  מקור: {choices.find(c => c.text === selectedValue)?.source}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};