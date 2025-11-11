import React, { useState, useEffect, useCallback } from 'react';
import { getEvaluation } from './services/geminiService';
import { IeltsQuestion, EvaluationResult } from './types';
import { getRandomQuestion } from './constants';
import AudioRecorder from './components/AudioRecorder';
import { TimerIcon, CheckCircle, Loader, Sparkles } from './components/Icons';

type AppState = 'idle' | 'answering' | 'evaluating' | 'result';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<IeltsQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appState === 'answering' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (appState === 'answering' && timeLeft === 0) {
      setIsTimeUp(true);
    }
  }, [appState, timeLeft]);

  const startPractice = useCallback(() => {
    setError(null);
    setEvaluation(null);
    setUserAnswer('');
    setIsTimeUp(false);
    setTimeLeft(180);
    setCurrentQuestion(getRandomQuestion());
    setAppState('answering');
  }, []);

  const handleSubmit = async () => {
    if (!currentQuestion || !userAnswer.trim()) {
      setError("Please provide an answer before submitting.");
      return;
    }
    setAppState('evaluating');
    setError(null);
    try {
      const result = await getEvaluation(currentQuestion.question, userAnswer);
      setEvaluation(result);
      setAppState('result');
    } catch (e) {
      console.error(e);
      setError("Sorry, I couldn't evaluate your answer. Please try again.");
      setAppState('answering');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const renderContent = () => {
    switch (appState) {
      case 'idle':
        return (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">IELTS Speaking Practice</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Get ready to ace your speaking test!</p>
            <button
              onClick={startPractice}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg"
            >
              Start Practice Session
            </button>
          </div>
        );
      case 'answering':
      case 'evaluating':
        return (
          <div className="w-full">
            {currentQuestion && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">IELTS Speaking {currentQuestion.part}</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">{currentQuestion.question}</p>
              </div>
            )}
            <div className={`flex items-center justify-center gap-2 mb-4 font-mono text-4xl ${timeLeft < 20 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
              <TimerIcon className="w-8 h-8"/>
              <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            </div>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isTimeUp || appState === 'evaluating'}
              placeholder="Start typing your answer here..."
              className="w-full h-48 p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition"
            />
            {isTimeUp && <p className="text-center text-red-500 mt-2 font-semibold">Time's up!</p>}
            <button
              onClick={handleSubmit}
              disabled={isTimeUp === false || appState === 'evaluating'}
              className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {appState === 'evaluating' ? <><Loader /> Evaluating...</> : 'Get My Band Score'}
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        );
      case 'result':
        return (
          evaluation && (
            <div className="w-full animate-fade-in">
              <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Your Evaluation</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700">
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">Estimated Band</p>
                  <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-4 border-blue-500">
                    <span className="text-5xl font-bold text-blue-600 dark:text-blue-300">{evaluation.band}</span>
                  </div>
                </div>
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><CheckCircle /> Justification</h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{evaluation.justification}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><Sparkles /> Band 7 Sample Answer</h3>
                <p className="text-gray-600 dark:text-gray-300 italic">"{evaluation.sampleAnswer}"</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
                 <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Practice Your Pronunciation</h3>
                 <p className="text-gray-600 dark:text-gray-300 mb-4">Now, try speaking your answer. Record yourself and listen back.</p>
                <AudioRecorder />
              </div>
              <button
                onClick={startPractice}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Try Another Question
              </button>
            </div>
          )
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;