
import React from "react";
import { useQuiz } from "@/hooks/useQuiz";
import QuizStart from "@/components/quiz/QuizStart";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResults from "@/components/quiz/QuizResults";

export default function Quiz() {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    results,
    showResults,
    quizStarted,
    progress,
    startQuiz,
    resetQuiz,
    answerQuestion
  } = useQuiz();

  return (
    <div className="min-h-[80vh] py-12">
      <div className="container px-4 sm:px-6">
        {!quizStarted && !showResults && (
          <QuizStart onStart={startQuiz} />
        )}

        {quizStarted && currentQuestion && !showResults && (
          <div className="animate-fade-in">
            <QuizQuestion
              question={currentQuestion}
              progress={progress}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              onAnswer={answerQuestion}
            />
          </div>
        )}

        {showResults && (
          <div className="animate-fade-in">
            <QuizResults results={results} onReset={resetQuiz} />
          </div>
        )}
      </div>
    </div>
  );
};
