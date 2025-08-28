import { useState } from 'react';
import { TorahGameBoard } from '@/components/TorahGameBoard';
import { HolidaysGameBoard } from '@/components/HolidaysGameBoard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Torah = () => {
  const [currentGame, setCurrentGame] = useState<'main' | 'holidays'>('main');
  const [language, setLanguage] = useState<'en' | 'he'>('he');

  if (currentGame === 'holidays') {
    return (
      <div className="relative">
        <div className="absolute top-4 left-4 z-50">
          <Button
            onClick={() => setCurrentGame('main')}
            variant="ghost"
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            ← {language === 'he' ? 'חזור למשחק הראשי' : 'Back to Main Game'}
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={() => setLanguage('en')}
            variant={language === 'en' ? 'default' : 'ghost'}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            English
          </Button>
          <Button
            onClick={() => setLanguage('he')}
            variant={language === 'he' ? 'default' : 'ghost'}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            עברית
          </Button>
        </div>
        <HolidaysGameBoard />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Game Selection Menu */}
      <Card className="max-w-md mx-auto mb-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border-2 border-yellow-400/30">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === 'he' ? 'בחר משחק' : 'Choose Game'}
          </h2>
          <div className="space-y-3">
            <Button
              onClick={() => setCurrentGame('main')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            >
              📚 {language === 'he' ? 'משחק התורה הראשי' : 'Main Torah Game'}
            </Button>
            <Button
              onClick={() => setCurrentGame('holidays')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500"
            >
              🕯️ {language === 'he' ? 'משחק החגים היהודיים' : 'Jewish Holidays Game'}
            </Button>
          </div>
          
          {/* Language Toggle */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              onClick={() => setLanguage('en')}
              variant={language === 'en' ? 'default' : 'ghost'}
              size="sm"
            >
              English
            </Button>
            <Button
              onClick={() => setLanguage('he')}
              variant={language === 'he' ? 'default' : 'ghost'}
              size="sm"
            >
              עברית
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <TorahGameBoard />
    </div>
  );
};

export default Torah;