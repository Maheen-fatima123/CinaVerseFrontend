import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { endpoints } from '../routes/api';
import { useStore } from '../context/StoreContext';

const AiChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [history, setHistory] = useState([
        { role: 'ai', text: 'Hi! I am CinaAI. Ask me for a movie recommendation!' }
    ]);
    const [loading, setLoading] = useState(false);
    const { token } = useStore();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const userMsg = prompt;
        setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setPrompt('');
        setLoading(true);

        try {
            const res = await fetch(endpoints.googleAI.chat, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ prompt: userMsg })
            });
            const data = await res.json();
            setHistory(prev => [...prev, { role: 'ai', text: data.text || "My brain is fuzzy (Network Error), but you can't go wrong with 'The Shawshank Redemption'!" }]);
        } catch (error) {
            setHistory(prev => [...prev, { role: 'ai', text: "My brain is fuzzy (Network Error), but you can't go wrong with 'The Shawshank Redemption'!" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="position-fixed bottom-0 end-0 mb-4 me-4 animate-in slide-in-from-bottom-5 fade-in"
                    style={{
                        zIndex: 9999,
                        width: '320px',
                        maxWidth: 'calc(100vw - 2rem)'
                    }}
                >
                    <div className="border border-danger rounded-4 shadow-2xl overflow-hidden" style={{ height: '420px', maxHeight: '80vh', backgroundColor: 'var(--background-color)' }}>
                        {/* Header */}
                        <div className="p-2 px-3 border-bottom border-danger d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, var(--primary-red) 0%, var(--secondary-red) 100%)' }}>
                            <div className="d-flex align-items-center gap-2">
                                <Sparkles size={16} className="text-white" />
                                <span className="text-white fw-bold" style={{ fontSize: '14px' }}>CinaVerse AI</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-sm text-white p-0 hover:bg-white/20 rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '24px', height: '24px' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="p-3 overflow-y-auto custom-scrollbar" style={{ height: 'calc(100% - 110px)', background: 'var(--sidebar-bg)' }}>
                            <div className="d-flex flex-column gap-2">
                                {history.map((msg, i) => (
                                    <div key={i} className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div
                                            className={`px-3 py-2 rounded-3 ${msg.role === 'user'
                                                ? 'bg-danger text-white'
                                                : 'border border-secondary'
                                                }`}
                                            style={{
                                                maxWidth: '90%',
                                                fontSize: '12px',
                                                lineHeight: '1.4',
                                                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                                backgroundColor: msg.role === 'ai' ? 'var(--glass-bg)' : undefined,
                                                color: msg.role === 'ai' ? 'var(--text-color)' : 'white'
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="d-flex justify-content-start">
                                        <div className="border border-secondary px-3 py-2 rounded-3" style={{ fontSize: '11px', backgroundColor: 'var(--glass-bg)', color: 'var(--muted-text)' }}>
                                            <span className="animate-pulse">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-2 border-top border-secondary" style={{ backgroundColor: 'var(--background-color)' }}>
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control border-secondary rounded-pill px-3"
                                    placeholder="Ask for a movie..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    style={{ fontSize: '12px' }}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
                                    disabled={loading}
                                    style={{ width: '36px', height: '36px', minWidth: '36px', backgroundColor: 'var(--primary-red)' }}
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="position-fixed bottom-0 end-0 mb-4 me-4 btn rounded-circle shadow-lg d-flex align-items-center justify-content-center transition-all"
                style={{
                    zIndex: 9998,
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                    border: '2px solid rgba(220, 38, 38, 0.3)',
                    transform: isOpen ? 'scale(0.9)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1)'}
            >
                {isOpen ? (
                    <X size={20} className="text-white" />
                ) : (
                    <MessageSquare size={20} className="text-white" fill="white" />
                )}
            </button>
        </>
    );
};

export default AiChatWidget;
