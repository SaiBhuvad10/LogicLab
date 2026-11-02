import React, { useState } from 'react';
import { LESSON_TOPICS, LessonTopic } from '../data/lessons';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const LearningCentre: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(LESSON_TOPICS[0].id);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const filteredTopics = LESSON_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase())
  );

  const activeTopic = LESSON_TOPICS.find((t) => t.id === selectedTopicId) || LESSON_TOPICS[0];

  const toggleQuestion = (idx: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Semester III Digital Electronics Learning Centre</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comprehensive curriculum notes, definitions, circuit formulas, and exam practice questions
        </p>
      </div>

      {/* Main Layout: Left Topic Directory | Right Content Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Topics List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col max-h-72 lg:h-[calc(100vh-14rem)]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter topics..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                  selectedTopicId === topic.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                      selectedTopicId === topic.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {topic.number}
                  </span>
                  <span className="text-xs font-semibold truncate max-w-[190px]">
                    {topic.title}
                  </span>
                </div>
                <ArrowRight
                  className={`w-3 h-3 transition-transform ${
                    selectedTopicId === topic.id
                      ? 'translate-x-0.5 text-white'
                      : 'opacity-0 group-hover:opacity-100 text-slate-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Topic Viewer */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {/* Topic Title & Direct Simulator Launch Button */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                Topic #{activeTopic.number}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                {activeTopic.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeTopic.summary}
              </p>
            </div>

            <button
              onClick={() => navigate(activeTopic.relatedSimulatorPath)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shrink-0 transition-colors"
            >
              <span>{activeTopic.relatedSimulatorLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Key Definitions */}
          {activeTopic.definitions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Key Definitions & Concepts
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {activeTopic.definitions.map((def, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <div className="font-bold text-xs text-blue-600 dark:text-blue-400">
                      {def.term}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {def.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Theory Content Notes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Theoretical Notes & Analysis
            </h3>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeTopic.content.map((para, idx) => (
                <p key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Mathematical Formulas */}
          {activeTopic.formulas && activeTopic.formulas.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Governing Equations & Formulas
              </h3>
              <div className="space-y-1.5">
                {activeTopic.formulas.map((form, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl font-mono text-xs font-bold text-blue-700 dark:text-blue-300"
                  >
                    {form}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Questions with Expandable Solutions */}
          {activeTopic.practiceQuestions.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>Exam Practice Questions</span>
              </h3>

              <div className="space-y-3">
                {activeTopic.practiceQuestions.map((q, idx) => {
                  const isOpen = expandedQuestions[idx];
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(idx)}
                        className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors"
                      >
                        <span>Q{idx + 1}: {q.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {isOpen && (
                        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                          <div className="font-bold text-emerald-600 dark:text-emerald-400">
                            Answer: {q.answer}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

