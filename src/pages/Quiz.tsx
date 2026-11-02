import React, { useState } from 'react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/questions';
import { StorageUtil } from '../utils/storage';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Sparkles,
  RotateCcw,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export const Quiz: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Filter questions based on topic
  const questions: QuizQuestion[] =
    selectedTopic === 'all'
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter((q) => q.topicId === selectedTopic);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz complete
      setIsFinished(true);
      const total = questions.length;
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 1 : 0);
      const percentage = Math.round((finalScore / total) * 100);

      // Record in LocalStorage
      StorageUtil.recordQuizAttempt({
        topicId: selectedTopic,
        topicName: selectedTopic === 'all' ? 'Comprehensive Exam' : currentQ.topicName,
        score: finalScore,
        total,
        percentage
      });

      // Celebration
      if (percentage >= 70) {
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {}
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const topics = [
    { id: 'all', label: 'All Topics (Full Exam)' },
    { id: 'logic-gates', label: 'Logic Gates' },
    { id: 'number-systems', label: 'Number Systems' },
    { id: 'boolean-algebra', label: 'Boolean Algebra' },
    { id: 'k-maps', label: 'K-Maps' },
    { id: 'adders-subtractors', label: 'Adders & Subtractors' },
    { id: 'multiplexers-demultiplexers', label: 'Multiplexers' },
    { id: 'flip-flops', label: 'Flip-Flops' },
    { id: 'counters', label: 'Counters' },
    { id: 'shift-registers', label: 'Shift Registers' }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Semester III Quiz & Practice Assessment</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Interactive multiple-choice practice with instant textbook explanations and local score tracking
        </p>
      </div>

      {/* Topic Filter Pills */}
      {!isFinished && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTopic(t.id);
                handleRestart();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Quiz Card */}
      {!isFinished ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          {/* Progress Bar & Header */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-blue-600 dark:text-blue-400">
                Question {currentIdx + 1} of {questions.length} ({currentQ.topicName})
              </span>
              <span className="font-mono text-slate-500">
                Current Score: {score}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </div>

          {/* 4 Answer Choices */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              let btnStyle = 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200';

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold ring-1 ring-emerald-500';
                } else if (idx === selectedOption) {
                  btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500';
                } else {
                  btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs space-y-1">
              <div className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Textbook Explanation</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Scorecard */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Assessment Completed!
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your performance has been recorded in your local study progress profile.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 max-w-sm mx-auto border border-slate-200 dark:border-slate-700">
            <div className="font-mono text-4xl font-extrabold text-blue-600 dark:text-blue-400">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
              {score} out of {questions.length} questions correct
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

