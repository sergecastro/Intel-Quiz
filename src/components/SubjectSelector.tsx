import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableSubjects, SubjectKey } from "@/data/subjects";

interface SubjectSelectorProps {
  selectedSubject: SubjectKey;
  onSubjectChange: (subject: SubjectKey) => void;
}

export const SubjectSelector = ({ selectedSubject, onSubjectChange }: SubjectSelectorProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-white font-bold text-lg">Subject:</span>
      <Select value={selectedSubject} onValueChange={onSubjectChange}>
        <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all duration-300">
          <SelectValue placeholder="Choose Subject" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          {availableSubjects.map(subject => (
            <SelectItem 
              key={subject.id} 
              value={subject.id}
              className="text-lg font-medium"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{subject.icon}</span>
                {subject.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};