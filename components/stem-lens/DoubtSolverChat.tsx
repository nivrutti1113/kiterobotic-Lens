'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, Volume2 } from 'lucide-react';
import { StemComponent } from '@/lib/stem-data';

interface DoubtSolverChatProps {
  component: StemComponent;
  currentLang?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  source?: string;
}

export const DoubtSolverChat: React.FC<DoubtSolverChatProps> = ({ component }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hi! I'm your Kite AI Doubt-Solver. Ask me anything about ${component.name}!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/lens/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentInput,
          componentId: component.id,
          gradeBand: 'grade6_8'
        })
      });
      const data = await res.json();
      const answerText = data.answer || `Here is how ${component.name} operates: ${component.shortDesc}`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'STEM Engine'
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const pinDetails = component.grades.grade9_10.pinout.map(p => `${p.pin}: ${p.function}`).join(', ');
      const offlineMsg = `[Built-in STEM Guide for ${component.name}]: VCC connects to 5V/3.3V power, GND to Ground, and signal lines connect to digital/analog pins. Pinout details: ${pinDetails}.`;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: offlineMsg,
          timestamp: 'Just now',
          source: 'Offline STEM KB'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col h-[480px] shadow-sm font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EEDCD0] shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-700" />
          <div>
            <h3 className="font-black text-sm text-[#111827] flex items-center gap-2 font-heading">
              <span>Vernacular AI Doubt-Solver</span>
              <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-full font-black">
                Instant Q&A
              </span>
            </h3>
            <p className="text-xs text-[#374151] font-semibold">Asking about: {component.name}</p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                msg.sender === 'user' ? 'bg-purple-700 text-white' : 'bg-purple-100 border border-purple-300 text-purple-900'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] p-3 rounded-2xl text-xs flex flex-col gap-1.5 font-semibold ${
                msg.sender === 'user'
                  ? 'bg-purple-700 text-white rounded-tr-none'
                  : 'bg-[#FAF3EC] border border-[#EEDCD0] text-[#111827] rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px] opacity-90 font-heading font-black">
                <span>{msg.sender === 'user' ? 'You' : 'Kite AI Assistant'}</span>
                {msg.source && <span className="font-mono text-purple-800">[{msg.source}]</span>}
              </div>
              <p className="leading-relaxed">{msg.text}</p>

              {msg.sender === 'ai' && (
                <button
                  onClick={() => handleSpeak(msg.text)}
                  className="self-end p-1 rounded hover:bg-purple-100 text-[#374151] hover:text-purple-900 transition-colors"
                  title="Read aloud with Web Speech TTS"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-purple-700 animate-pulse' : ''}`} />
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-800 font-mono p-2 font-bold">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI is composing response...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-3 border-t border-[#EEDCD0] shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask a question about ${component.name}...`}
          className="flex-1 bg-white border border-[#EEDCD0] rounded-xl px-4 py-2.5 text-xs text-[#111827] placeholder-[#4B5563] focus:outline-none focus:ring-2 focus:ring-purple-600 font-semibold shadow-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black transition-all disabled:opacity-40 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
