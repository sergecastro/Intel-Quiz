import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <div className="fixed top-4 right-4 z-50" dir="ltr">
      <Button
        onClick={onClick}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-background/80 backdrop-blur-sm"
      >
        <ArrowRight className="w-4 h-4" />
        Back to Language Selection
      </Button>
    </div>
  );
};