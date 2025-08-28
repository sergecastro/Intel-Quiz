import { useState } from 'react';
import { LanguageSelector, Language } from '@/components/LanguageSelector';
import { GameBoard } from '@/components/GameBoard';
import { TorahGameShow } from '@/components/TorahGameShow';
import { BackButton } from '@/components/BackButton';

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleBackToLanguageSelection = () => {
    setSelectedLanguage(null);
  };

  if (!selectedLanguage) {
    return <LanguageSelector onLanguageSelect={setSelectedLanguage} />;
  }

  if (selectedLanguage === 'he') {
    return (
      <>
        <BackButton onClick={handleBackToLanguageSelection} />
        <TorahGameShow />
      </>
    );
  }

  return (
    <>
      <BackButton onClick={handleBackToLanguageSelection} />
      <GameBoard />
    </>
  );
};

export default Index;
