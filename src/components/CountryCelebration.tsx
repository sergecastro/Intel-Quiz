import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Users, Utensils, Landmark } from 'lucide-react';
import { gameMatches } from '@/data/gameData';

interface CountryCelebrationProps {
  country: string;
  onClose: () => void;
  isOpen: boolean;
}

// Country information database with fun facts for kids
const countryInfo: Record<string, {
  landmarks: string[];
  food: string[];
  culture: string[];
  funFacts: string[];
  colors: string[];
}> = {
  'Australia': {
    landmarks: ['Sydney Opera House', 'Uluru Rock', 'Great Barrier Reef'],
    food: ['Vegemite', 'Meat Pies', 'Lamingtons'],
    culture: ['Didgeridoo Music', 'Aboriginal Art', 'Surfing'],
    funFacts: ['Home to Kangaroos', 'Continent Country', 'Boomerangs'],
    colors: ['bg-gradient-to-r from-yellow-400 to-green-500']
  },
  'Brazil': {
    landmarks: ['Christ the Redeemer', 'Amazon Rainforest', 'Copacabana Beach'],
    food: ['Açaí', 'Brigadeiros', 'Feijoada'],
    culture: ['Carnival', 'Samba Dancing', 'Capoeira'],
    funFacts: ['Largest Country in South America', 'Amazon River', 'Soccer Capital'],
    colors: ['bg-gradient-to-r from-green-400 to-yellow-400']
  },
  'France': {
    landmarks: ['Eiffel Tower', 'Louvre Museum', 'Palace of Versailles'],
    food: ['Croissants', 'Cheese', 'Baguettes'],
    culture: ['Art Museums', 'Fashion', 'Romance'],
    funFacts: ['City of Light', 'Language of Love', 'Perfume Capital'],
    colors: ['bg-gradient-to-r from-blue-500 to-red-500']
  },
  'Germany': {
    landmarks: ['Brandenburg Gate', 'Neuschwanstein Castle', 'Black Forest'],
    food: ['Pretzels', 'Sausages', 'Sauerkraut'],
    culture: ['Oktoberfest', 'Classical Music', 'Fairy Tales'],
    funFacts: ['Land of Poets', 'Invention Country', 'Castle Kingdom'],
    colors: ['bg-gradient-to-r from-red-500 to-yellow-500']
  },
  'India': {
    landmarks: ['Taj Mahal', 'Red Fort', 'Golden Temple'],
    food: ['Curry', 'Naan Bread', 'Chai Tea'],
    culture: ['Bollywood', 'Yoga', 'Festivals'],
    funFacts: ['Spice Kingdom', 'Elephant Land', 'Color Festivals'],
    colors: ['bg-gradient-to-r from-orange-400 to-pink-500']
  },
  'Japan': {
    landmarks: ['Mount Fuji', 'Tokyo Tower', 'Cherry Blossoms'],
    food: ['Sushi', 'Ramen', 'Mochi'],
    culture: ['Anime', 'Origami', 'Tea Ceremony'],
    funFacts: ['Land of Rising Sun', 'Robot Technology', 'Samurai History'],
    colors: ['bg-gradient-to-r from-red-400 to-white']
  },
  'Mexico': {
    landmarks: ['Chichen Itza', 'Frida Kahlo Museum', 'Cancun Beaches'],
    food: ['Tacos', 'Guacamole', 'Churros'],
    culture: ['Mariachi Music', 'Day of the Dead', 'Piñatas'],
    funFacts: ['Ancient Pyramids', 'Chocolate Origin', 'Colorful Art'],
    colors: ['bg-gradient-to-r from-green-500 to-red-500']
  },
  'Russia': {
    landmarks: ['Red Square', 'Trans-Siberian Railway', 'Hermitage Museum'],
    food: ['Borscht', 'Caviar', 'Blini'],
    culture: ['Ballet', 'Matryoshka Dolls', 'Ice Hockey'],
    funFacts: ['Largest Country', 'Space Exploration', 'Winter Wonderland'],
    colors: ['bg-gradient-to-r from-red-600 to-blue-600']
  },
  'Canada': {
    landmarks: ['Niagara Falls', 'CN Tower', 'Banff National Park'],
    food: ['Maple Syrup', 'Poutine', 'Butter Tarts'],
    culture: ['Ice Hockey', 'Mounties', 'Multiculturalism'],
    funFacts: ['Maple Leaf Country', 'Politeness Culture', 'Northern Lights'],
    colors: ['bg-gradient-to-r from-red-500 to-white']
  },
  'Egypt': {
    landmarks: ['Pyramids of Giza', 'Sphinx', 'Nile River'],
    food: ['Falafel', 'Koshari', 'Baklava'],
    culture: ['Ancient Pharaohs', 'Hieroglyphics', 'Desert Oasis'],
    funFacts: ['Pyramid Builders', 'Mummy Land', 'Desert Kingdom'],
    colors: ['bg-gradient-to-r from-yellow-600 to-orange-600']
  },
  'Thailand': {
    landmarks: ['Grand Palace', 'Wat Pho Temple', 'Floating Markets'],
    food: ['Pad Thai', 'Tom Yum', 'Mango Sticky Rice'],
    culture: ['Thai Boxing', 'Buddhist Temples', 'Elephant Riding'],
    funFacts: ['Elephant Country', 'Smile Kingdom', 'Tropical Paradise'],
    colors: ['bg-gradient-to-r from-red-500 to-blue-500']
  },
  'South Africa': {
    landmarks: ['Table Mountain', 'Kruger Park', 'Cape of Good Hope'],
    food: ['Biltong', 'Bobotie', 'Rooibos Tea'],
    culture: ['Safari Adventures', 'Ubuntu Philosophy', 'Rainbow Nation'],
    funFacts: ['Big Five Animals', 'Diamond Mines', 'Nelson Mandela'],
    colors: ['bg-gradient-to-r from-green-500 to-gold']
  }
};

export const CountryCelebration = ({ country, onClose, isOpen }: CountryCelebrationProps) => {
  const [currentSection, setCurrentSection] = useState<'landmarks' | 'food' | 'culture' | 'funFacts'>('landmarks');
  const info = countryInfo[country] || countryInfo['Australia']; // Fallback
  const match = gameMatches.find(m => m.country === country);

  useEffect(() => {
    if (isOpen) {
      setCurrentSection('landmarks');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sections = [
    { key: 'landmarks' as const, label: 'Famous Places', icon: MapPin },
    { key: 'food' as const, label: 'Delicious Food', icon: Utensils },
    { key: 'culture' as const, label: 'Cool Culture', icon: Users },
    { key: 'funFacts' as const, label: 'Fun Facts', icon: Landmark }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden ${info.colors[0]} border-8 border-yellow-300 shadow-rainbow animate-scale-in`}>
        {/* Header */}
        <div className="relative p-6 text-center bg-white/90 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 rounded-full w-10 h-10 p-0"
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-800 drop-shadow-lg animate-bounce">
              🎉 CELEBRATE {country.toUpperCase()}! 🎉
            </h1>
            
            {/* Flag Display */}
            <div className="flex justify-center">
              <div className="w-32 h-24 bg-gray-100 border-4 border-yellow-400 rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
                {match?.flagImage && (
                  <img 
                    src={match.flagImage} 
                    alt={`${country} flag`} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            
            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 p-2">
                Capital: {match?.capital}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 p-2">
                Language: {match?.language}
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 p-2">
                Currency: {match?.currency}
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 p-2">
                Continent: {match?.continent}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 p-4 border-y-4 border-yellow-300">
          <div className="flex justify-center gap-2 flex-wrap">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.key}
                  onClick={() => setCurrentSection(section.key)}
                  variant={currentSection === section.key ? "default" : "outline"}
                  className={`transition-all duration-300 ${
                    currentSection === section.key 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110 shadow-lg' 
                      : 'bg-white hover:bg-purple-100 hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {section.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-white/90 backdrop-blur-sm overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {info[currentSection].map((item, index) => (
              <Card 
                key={index} 
                className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 border-3 border-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {currentSection === 'landmarks' ? '🏛️' :
                     currentSection === 'food' ? '🍽️' :
                     currentSection === 'culture' ? '🎭' : '⭐'}
                  </div>
                  <p className="font-bold text-gray-800 text-lg drop-shadow-sm">
                    {item}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-400 text-center">
          <p className="text-white font-bold text-lg drop-shadow-lg">
            🌟 Amazing job learning about {country}! 🌟
          </p>
          <p className="text-white/90 text-sm mt-1">
            You're becoming a geography expert! 🗺️✨
          </p>
        </div>
      </Card>
    </div>
  );
};