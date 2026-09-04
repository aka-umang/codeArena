import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Sparkles, Bot, User, Copy, Check, RotateCcw } from 'lucide-react';

// Quick-start prompts shown when the chat is empty, so the user isn't
// staring at a blank box wondering what to ask.
const QUICK_PROMPTS = [
    "Explain this problem in simple terms",
    "Give me a hint, not the answer",
    "What's the optimal time complexity?",
    "Why is my approach wrong?",
];

// Splits a message into plain-text and fenced-code segments so code blocks
// can be rendered in a monospace box with a copy button, LeetCode-style.
function parseMessageParts(text = "") {
    const parts = [];
    const regex = /```(\w+)?\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
        }
        parts.push({ type: "code", lang: match[1] || "", content: match[2].trim() });
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
        parts.push({ type: "text", content: text.slice(lastIndex) });
    }
    return parts.length ? parts : [{ type: "text", content: text }];
}

function CodeBlock({ lang, content }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="my-2 rounded-lg overflow-hidden border border-base-300 bg-neutral text-neutral-content">
            <div className="flex items-center justify-between px-3 py-1.5 bg-black/20 text-xs">
                <span className="opacity-70 font-mono">{lang || "code"}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 opacity-70 hover:opacity-100 transition"
                >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className="p-3 overflow-x-auto text-sm">
                <code className="font-mono">{content}</code>
            </pre>
        </div>
    );
}

function MessageBubble({ role, text }) {
    const isUser = role === "user";
    const parts = parseMessageParts(text);

    return (
        <div className={`chat ${isUser ? "chat-end" : "chat-start"} group`}>
            <div className="chat-image avatar">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isUser
                            ? "bg-primary text-primary-content"
                            : "bg-gradient-to-br from-accent to-primary text-primary-content"
                    }`}
                >
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>
            </div>
            <div
                className={`chat-bubble ${
                    isUser
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content border border-base-300"
                } shadow-sm max-w-[85%]`}
            >
                {parts.map((part, i) =>
                    part.type === "code" ? (
                        <CodeBlock key={i} lang={part.lang} content={part.content} />
                    ) : (
                        part.content.trim() && (
                            <p key={i} className="whitespace-pre-wrap text-sm leading-relaxed m-0">
                                {part.content}
                            </p>
                        )
                    )
                )}
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-accent to-primary text-primary-content">
                    <Bot size={16} />
                </div>
            </div>
            <div className="chat-bubble bg-base-200 border border-base-300 flex items-center gap-1 py-3">
                <span className="w-2 h-2 rounded-full bg-base-content/40 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-base-content/40 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-base-content/40 animate-bounce"></span>
            </div>
        </div>
    );
}

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const messageField = register("message", { required: true, minLength: 2 });

    const messageValue = watch("message", "");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Auto-grow the textarea as the user types, capped at a few lines.
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [messageValue]);

    const sendMessage = async (text) => {
        const trimmed = text.trim();
        if (!trimmed || isTyping) return;

        // Include the message the user just typed in what we send to the
        // backend — sending only the *prior* history meant the very first
        // message of a conversation went out as an empty array, which the
        // Gemini SDK rejects.
        const updatedMessages = [...messages, { role: 'user', parts: [{ text: trimmed }] }];
        setMessages(updatedMessages);
        reset();
        setIsTyping(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: updatedMessages,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.message }]
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: "Sorry, I couldn't reach the AI right now. Please try again in a moment." }]
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const onSubmit = (data) => sendMessage(data.message);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const handleReset = () => setMessages([]);

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px] rounded-xl border border-base-300 overflow-hidden bg-base-100">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 via-accent/10 to-transparent border-b border-base-300">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-content shrink-0">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <p className="font-display font-semibold text-sm leading-tight">AI Assistant</p>
                        <p className="text-xs text-base-content/50 leading-tight">
                            Knows this problem &mdash; ask anything
                        </p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-ghost btn-xs gap-1 text-base-content/50"
                        title="Start a new conversation"
                    >
                        <RotateCcw size={13} /> Reset
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4 px-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-content">
                            <Bot size={26} />
                        </div>
                        <div>
                            <p className="font-display font-semibold">
                                Stuck on {problem?.title || "this problem"}?
                            </p>
                            <p className="text-sm text-base-content/60 mt-1">
                                Ask for a hint, a nudge on complexity, or a review of your code.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 max-w-md">
                            {QUICK_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => sendMessage(prompt)}
                                    className="btn btn-sm btn-outline rounded-full normal-case font-normal"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <MessageBubble key={index} role={msg.role} text={msg.parts[0].text} />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-3 bg-base-100 border-t border-base-300"
            >
                <div className="flex items-end gap-2 bg-base-200 rounded-2xl border border-base-300 focus-within:border-primary/50 transition-colors px-3 py-2">
                    <textarea
                        {...messageField}
                        ref={(el) => {
                            messageField.ref(el);
                            textareaRef.current = el;
                        }}
                        placeholder="Ask me anything about this problem..."
                        rows={1}
                        onKeyDown={handleKeyDown}
                        className="textarea textarea-ghost flex-1 resize-none min-h-[24px] max-h-[120px] px-0 py-1 bg-transparent border-none focus:outline-none leading-relaxed text-sm"
                    />
                    <button
                        type="submit"
                        className={`btn btn-circle btn-sm shrink-0 ${
                            !errors.message && messageValue?.trim() ? "btn-primary" : "btn-disabled"
                        }`}
                        disabled={isTyping || !messageValue?.trim()}
                    >
                        <Send size={16} />
                    </button>
                </div>
                <p className="text-[11px] text-base-content/40 mt-1.5 ml-1">
                    Enter to send &middot; Shift+Enter for a new line
                </p>
            </form>
        </div>
    );
}

export default ChatAi;
