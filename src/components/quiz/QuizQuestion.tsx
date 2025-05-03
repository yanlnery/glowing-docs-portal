
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizQuestion as QuestionType, AnimalAttribute } from "@/types/quiz";

interface QuizQuestionProps {
  question: QuestionType;
  progress: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: AnimalAttribute) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
  question, 
  progress, 
  currentQuestionIndex, 
  totalQuestions, 
  onAnswer 
}) => {
  return (
    <Card className="max-w-lg w-full mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Pergunta {currentQuestionIndex + 1} de {totalQuestions}
          </span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <CardTitle className="text-xl sm:text-2xl mt-4">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.answers.map((answer) => (
          <Button
            key={answer.value}
            variant="outline"
            className="w-full justify-start text-left h-auto py-4 hover:bg-serpente-50 hover:border-serpente-200 transition-colors dark:hover:bg-serpente-900/20"
            onClick={() => onAnswer(answer.value as AnimalAttribute)}
          >
            {answer.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
