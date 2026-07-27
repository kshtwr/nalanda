"use client"
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useEffect, useRef } from 'react'

export default function ChatBar(){
    const { messages, sendMessage, status, stop, error } = useChat({
        transport: new DefaultChatTransport({ api: '/api/ask' }), 
    });

    const [input, setInput] = useState('')
    const [isExpanded, setisExpanded] = useState(false)

    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const chatRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
                setisExpanded(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])        

    return (
        <div ref={chatRef}
        className={`flex flex-col fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-lg px-4 py-2 transition-all duration-300
        ${isExpanded ? 'w-[33vw] rounded-2xl' : 'w-72 rounded-3xl'} ${isExpanded && messages.length > 0 ? 'h-64' : ''}`}
            >
            <div className = {`flex-1 flex-col overflow-y-auto min-h-0`}>
                {isExpanded && messages.map(message => (
                <div key={message.id}>
                    {message.role === 'user' ? 'User: ' : 'AI: '}
                    {message.parts.map((part, index) =>
                    part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                    )}
                </div>
                ))}
                <div ref={bottomRef} /> 
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (input.trim()) {
                    sendMessage({ text: input });
                    setInput('');
                    setisExpanded(true);
                    }
                }}
                className = "flex items-center justify-between gap-2"
            >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setisExpanded(true)}
              disabled={status !== 'ready'}
              placeholder="Ask anything..."
              className="outline-none flex-1"
            />
            <button type="submit" disabled={status !== 'ready'} 
            className={`transition-colors duration-200 ${input.trim() ? 'text-gray-800' : 'text-gray-400'}`}

            >
                <i className="bi bi-arrow-up-circle"></i>
            </button>
          </form>
        </div>
      );
}

