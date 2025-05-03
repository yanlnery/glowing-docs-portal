
import { useState } from "react";
import { AnimalAttribute, QuizQuestion, Animal, QuizResult } from "@/types/quiz";
import { quizQuestions, animalsData } from "@/data/quizData";

export const useQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnimalAttribute[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults([]);
    setShowResults(false);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults([]);
    setShowResults(false);
  };

  const answerQuestion = (answer: AnimalAttribute) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate results
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (userAnswers: AnimalAttribute[]) => {
    const resultScores: QuizResult[] = animalsData.map(animal => {
      let score = 0;

      // Experience level
      if (userAnswers[0] === animal.nivel) {
        score += 3;
      }

      // Interest
      if (animal.interesse.includes(userAnswers[1])) {
        score += 3;
      }

      // Class (type)
      if (userAnswers[2] === "tanto_faz" || userAnswers[2] === animal.classe) {
        score += userAnswers[2] === "tanto_faz" ? 1 : 3;
      }

      // Time commitment
      if (userAnswers[3] === animal.tempo) {
        score += 2;
      }

      // Size
      if (userAnswers[4] === animal.tamanho) {
        score += 2;
      }

      // Space
      if (userAnswers[5] === animal.espaco) {
        score += 2;
      }

      // Habit
      if (userAnswers[6] === "indiferente" || userAnswers[6] === animal.habito) {
        score += userAnswers[6] === "indiferente" ? 1 : 2;
      }

      return { animal, score };
    });

    // Sort by score (descending)
    const sortedResults = resultScores.sort((a, b) => b.score - a.score);
    
    // Take top 3 results
    setResults(sortedResults.slice(0, 3));
    setShowResults(true);
  };

  const currentQuestion: QuizQuestion | undefined = quizStarted 
    ? quizQuestions[currentQuestionIndex]
    : undefined;
  
  const progress = quizStarted 
    ? Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100) 
    : 0;

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: quizQuestions.length,
    answers,
    results,
    showResults,
    quizStarted,
    progress,
    startQuiz,
    resetQuiz,
    answerQuestion
  };
};
