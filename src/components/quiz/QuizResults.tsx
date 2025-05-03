
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { QuizResult } from "@/types/quiz";
import { RefreshCw, ArrowRight } from "lucide-react";

interface QuizResultsProps {
  results: QuizResult[];
  onReset: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ results, onReset }) => {
  const topResult = results[0];
  const otherResults = results.slice(1);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Seu Animal Ideal é...</h2>
          {results.length > 0 && (
            <p className="text-muted-foreground mt-2">
              Com base nas suas respostas, encontramos {results.length === 1 ? 'este animal' : 'estes animais'} que combinam com seu perfil.
            </p>
          )}
        </div>

        {topResult && (
          <div className="mb-8">
            <Card className="overflow-hidden border-serpente-200 shadow-md dark:border-serpente-800">
              <div className="sm:flex">
                <div className="sm:w-2/5 h-64 sm:h-auto">
                  <img
                    src={topResult.animal.imagem}
                    alt={topResult.animal.nome_popular}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:w-3/5 p-6">
                  <div className="mb-1">
                    <span className="inline-block bg-serpente-100 text-serpente-800 text-xs px-2 py-1 rounded-full dark:bg-serpente-900/50 dark:text-serpente-300">
                      Mais compatível com você
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{topResult.animal.nome_popular}</h3>
                  <p className="text-sm text-muted-foreground italic mb-3">
                    {topResult.animal.nome_cientifico}
                  </p>
                  <p className="text-muted-foreground mb-6">{topResult.animal.descricao}</p>
                  <Button asChild>
                    <Link to={`/especies/${topResult.animal.slug}`} className="flex items-center">
                      Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {otherResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Outras que combinam com seu perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherResults.map((result) => (
                <Card key={result.animal.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 h-36">
                      <img
                        src={result.animal.imagem}
                        alt={result.animal.nome_popular}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full sm:w-2/3 p-4">
                      <h4 className="font-bold mb-1">{result.animal.nome_popular}</h4>
                      <p className="text-xs text-muted-foreground italic mb-2">
                        {result.animal.nome_cientifico}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {result.animal.descricao}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/especies/${result.animal.slug}`}>Ver Detalhes</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Button variant="outline" onClick={onReset} className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" /> Refazer Quiz
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            O quiz é apenas uma recomendação com base em afinidade. Consulte sempre um especialista antes de adquirir um animal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
