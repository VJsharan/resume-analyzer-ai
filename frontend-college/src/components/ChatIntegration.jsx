import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, FileText, Minimize2, Maximize2, X, Send, User, Loader2, Link2, Share2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const PROMPTS = [
  "What's wrong with my resume?",
  "How can I improve my resume?",
  "Where am I lacking in my resume?",
  "What should I fix to get shortlisted?"
];

// Helper to format bot responses nicely
const formatBotMessage = (text) => {
  // Simple markdown-ish processing for bold and lists
  return text.split('\n').map((line, i) => {
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      return <li key={i} className="ml-4 list-disc my-1">{line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>;
    }
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p key={i} className="my-1.5" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
  });
};

export default function ChatIntegration({ data, fileInfo, apiKey }) {
  const [viewState, setViewState] = useState('popup'); // 'popup', 'drawer', 'fullscreen', 'hidden'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Randomize initial prompt text
    setPlaceholder(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    
    // Set initial greeting
    if (messages.length === 0) {
      setMessages([{
        role: 'bot',
        content: `Hi there! I've reviewed your resume text for the **${data.job_role}** role. I'm here to act as your specialized career coach. Shoot me a question like: "${PROMPTS[Math.floor(Math.random() * PROMPTS.length)]}"`
      }]);
    }
  }, [data.job_role]);

  useEffect(() => {
    if (viewState === 'drawer' || viewState === 'fullscreen') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [messages, viewState, loading]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || loading) return;
    
    const userMsg = { role: 'user', content: messageText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto'; // Reset height
    setLoading(true);
    
    try {
      const history = messages.slice(1).map(m => ({ // Skip the initial local greeting for the backend history
        role: m.role === 'bot' ? 'model' : 'user',
        content: m.content
      }));

      const payload = {
        message: messageText,
        resume_text: data.raw_text || "Resume text unavailable.",
        job_role: data.job_role,
        history: history
      };

      const response = await axios.post('http://127.0.0.1:8000/chat', payload, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      setMessages([...newMessages, { role: 'bot', content: response.data.response }]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorDetail = err.response?.data?.detail || "Oops, I encountered an error connecting to my AI backend. Please try again.";
      setMessages([...newMessages, { role: 'bot', content: typeof errorDetail === 'string' ? errorDetail : "Oops, an error occurred with the AI API." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const PDFContextIndicator = () => (
    <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg mb-4 w-fit shadow-sm">
      <div className="flex bg-rose-500 rounded p-1">
        <FileText className="w-3.5 h-3.5 text-white" />
      </div>
      <div>
         <p className="text-xs font-bold text-slate-800 leading-tight">
           {fileInfo?.name || "Uploaded_Resume.pdf"}
         </p>
         <p className="text-[10px] uppercase font-bold tracking-wider text-rose-600 leading-tight mt-0.5">PDF</p>
      </div>
    </div>
  );

  const renderChatContent = (isFullScreen) => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className={`p-4 border-b border-slate-200 bg-white flex justify-between items-center ${isFullScreen ? 'pt-6 pb-5 px-8' : ''}`}>
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Career Coach AI
          </h3>
          <p className="text-xs text-slate-500 font-medium">Powered by Gemini Engine</p>
        </div>
        <div className="flex items-center gap-1">
          {isFullScreen ? (
            <button onClick={() => setViewState('drawer')} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => setViewState('fullscreen')} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setViewState('hidden')} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${isFullScreen ? 'p-8 max-w-4xl mx-auto w-full' : 'p-4'}`}>
        <PDFContextIndicator />
        
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="w-4 h-4 text-indigo-600" />
                </div>
              )}
              
              <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
              }`}>
                {msg.role === 'user' ? msg.content : formatBotMessage(msg.content)}
              </div>
              
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={`p-4 bg-white border-t border-slate-200 ${isFullScreen ? 'pb-8' : ''}`}>
        <div className={`flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 ${isFullScreen ? 'max-w-4xl mx-auto w-full' : ''}`}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={true}
            className="flex-1 bg-transparent max-h-32 min-h-[44px] resize-none outline-none text-slate-800 px-3 py-2.5 text-sm"
            rows="1"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">Gemini AI can make mistakes. Verify important advice.</p>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {viewState === 'popup' && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 bg-[#1e1e1e] rounded-3xl p-6 shadow-2xl border border-white/10"
          >
            <button onClick={() => setViewState('hidden')} className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors bg-white/5 rounded-full p-1.5">
              <X className="w-4 h-4" />
            </button>
            
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 mb-5 flex items-center justify-center shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-white font-bold text-xl mb-3 leading-tight">Want to understand what’s wrong with your resume?</h3>
            <p className="text-white/70 text-sm mb-6 font-medium leading-relaxed">
              Don't guess what to fix. Chat with our AI coach to identify exactly why your resume might get rejected and how to fix it immediately.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setInput(placeholder);
                  setViewState('drawer');
                  setTimeout(() => handleSend(placeholder), 300);
                }}
                className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                Chat here <strong className="font-black text-lg leading-none">&rarr;</strong>
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setInput(placeholder);
                    setViewState('fullscreen');
                    setTimeout(() => handleSend(placeholder), 300);
                  }}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/15 transition-colors border border-white/5 flex flex-col items-center justify-center gap-1"
                >
                  <Maximize2 className="w-4 h-4 opacity-50 mb-0.5" />
                  <span className="text-[11px] uppercase tracking-wider">New Window</span>
                </button>
                <button
                  onClick={() => setViewState('hidden')}
                  className="flex-1 py-3 bg-white/5 text-white/50 rounded-xl font-semibold hover:bg-white/10 transition-colors border border-transparent flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-[13px]">Maybe later</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewState === 'drawer' && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 h-screen w-[420px] max-w-[100vw] z-[60] shadow-2xl bg-white border-l border-slate-200"
          >
            {renderChatContent(false)}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewState === 'fullscreen' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-slate-50"
          >
            {renderChatContent(true)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-open float button when hidden */}
      <AnimatePresence>
        {(viewState === 'hidden') && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => setViewState('drawer')}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 transition-colors group border-4 border-white"
          >
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce"></span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
