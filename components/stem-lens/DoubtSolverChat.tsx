'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { StemComponent } from '@/lib/stem-data';

interface DoubtSolverChatProps {
  component: StemComponent;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
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

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || `Here is how ${component.name} operates: ${component.shortDesc}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `For ${component.name}: VCC goes to 5V, GND to Ground, and signal wires to Arduino pins. You can write code for it in Kinetic Canvas!`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col h-[480px]">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-gray-800 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <span>AI Doubt-Solver Chat</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              ONLINE
            </span>
          </h3>
          <p className="text-[11px] text-gray-400">Context: {component.name}</p>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-3.5 rounded-2xl ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                  : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed">{m.text}</p>
              <span className="text-[9px] opacity-60 mt-1 block text-right">{m.timestamp}</span>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-blue-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-center text-xs text-cyan-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI is analyzing circuit logic...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="pt-3 border-t border-gray-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a question about ${component.name}...`}
            className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold transition-all disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
