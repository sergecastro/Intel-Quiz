import { GameBoard } from '@/components/GameBoard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="relative">
      {/* Navigation to Hebrew App */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/torah">
          <Button variant="outline" className="bg-background/80 backdrop-blur-sm">
            🕍 Hebrew Torah App
          </Button>
        </Link>
      </div>
      
      <GameBoard />
    </div>
  );
};

export default Index;
