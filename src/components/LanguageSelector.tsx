import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Language = 'en' | 'he';

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
}

export const LanguageSelector = ({ onLanguageSelect }: LanguageSelectorProps) => {
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLang(lang);
    setTimeout(() => onLanguageSelect(lang), 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <Card className="w-full max-w-2xl torah-card">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              IntelliQuiz
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose Your Learning Language
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Option */}
            <Card 
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                selectedLang === 'en' ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => handleLanguageSelect('en')}
            >
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold mb-2">English</h3>
                <p className="text-muted-foreground mb-4">
                  Geography, Biology, Chemistry & More
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">🗺️ Geography</Badge>
                  <Badge variant="secondary">🧬 Biology</Badge>
                  <Badge variant="secondary">⚗️ Chemistry</Badge>
                  <Badge variant="secondary">📚 Literature</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Hebrew Option */}
            <Card 
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                selectedLang === 'he' ? 'ring-2 ring-torah-gold shadow-lg' : ''
              }`}
              onClick={() => handleLanguageSelect('he')}
            >
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">📜</div>
                <h3 className="text-2xl font-bold mb-2 hebrew-title">עברית</h3>
                <p className="text-muted-foreground mb-4 hebrew-text">
                  לימוד תורה אינטרקטיבי ומהנה
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-torah-gold border-torah-gold hebrew-text">✨ תורה</Badge>
                  <Badge variant="outline" className="text-torah-gold border-torah-gold hebrew-text">📖 תנ״ך</Badge>
                  <Badge variant="outline" className="text-torah-gold border-torah-gold hebrew-text">🎯 חידון</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Select a language to start your interactive learning journey
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};