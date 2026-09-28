import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, Bot, User, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_AI_CHAT, aiService } from '../services/aiService';
import type { AIChatMessage } from '../types/debt';

export const StudentAIAssistant: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AIChatMessage[]>(INITIAL_AI_CHAT);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    const reply = await aiService.chatWithAssistant(query, {
      studentName: user?.name || 'Akash Sharma',
      subjects: ['DBMS', 'Java', 'Data Structures'],
      weakConcepts: ['Functional Dependency', 'Recursion', 'Normalization'],
      learningDebt: 37,
    });

    setIsTyping(false);
    setMessages((prev) => [...prev, reply]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interactive Learning Tutor • Powered by Gemini</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            LearnDebt AI Study Assistant
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
            Ask questions, request concept simplifications, or generate custom practice drills tailored specifically to your prerequisite gaps.
          </p>
        </div>

        {/* Student Context Badge */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-slate-200 shrink-0 space-y-1">
          <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">Context Vector Active</span>
          <div className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Target: Functional Dependency (35%)</span>
          </div>
          <div className="text-[11px] text-amber-300 font-medium">Debt Score: 37 / 100 (Moderate Risk)</div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Messages Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-3xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(act)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{act}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic font-medium p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
              <span>LearnDebt AI Tutor is synthesizing response...</span>
            </div>
          )}
        </div>

        {/* Action Prompts Bar */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] font-bold text-slate-600 dark:text-slate-300">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0">Quick Prompts:</span>
          <button
            onClick={() => handleSendMessage('Explain Functional Dependency in simple words')}
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 shrink-0 transition"
          >
            💡 Explain Simpler
          </button>
          <button
            onClick={() => handleSendMessage('Give me a real-world DBMS example of Functional Dependency')}
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 shrink-0 transition"
          >
            📚 Give Example
          </button>
          <button
            onClick={() => handleSendMessage('Give me 1 practice question on Candidate Keys')}
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 shrink-0 transition"
          >
            ✏️ Give Practice Question
          </button>
          <button
            onClick={() => navigate('/student/quiz')}
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-500 text-indigo-600 dark:text-indigo-400 shrink-0 transition flex items-center gap-1"
          >
            <span>🎯 Create Quiz</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask anything about Functional Dependency, Normalization, or quiz topics..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
