
import React from "react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizStartProps {
  onStart: () => void;
}

const QuizStart: React.FC<QuizStartProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-serpente-100 text-serpente-600 h-16 w-16 rounded-full flex items-center justify-center mb-4 dark:bg-serpente-900/50">
            <Brain className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Descubra Qual Espécie Combina com Você</CardTitle>
          <CardDescription className="text-lg mt-2">
            Responda 7 perguntas e descubra qual dos nossos animais combina com seu estilo de vida.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Este quiz interativo vai ajudar você a encontrar o animal ideal baseado nas suas preferências, 
            experiência e disponibilidade para cuidados.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <span className="font-bold text-xl mb-1">7</span>
              <span className="text-muted-foreground text-sm">Perguntas</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <span className="font-bold text-xl mb-1">2 min</span>
              <span className="text-muted-foreground text-sm">Tempo estimado</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onStart} size="lg" className="w-full md:w-auto min-h-[44px]">
            Começar Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizStart;
