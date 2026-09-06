"use client"
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'

export default function ChatBar(){
    const pendingSourcesRef = useRef<any[]>([])
    const [sourcesMap, setSourcesMap] = useState<Record<string, any[]>>({})
    const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set())

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/ask',
            fetch: async (url, options) => {
                const response = await fetch(url as string, options as RequestInit)
                const raw = response.headers.get('x-sources')
                pendingSourcesRef.current = raw && raw !== '[]' ? JSON.parse(decodeURIComponent(raw)) : []
                return response
            }
        }),
        onFinish: ({ message }: { message: any }) => {
            if (pendingSourcesRef.current.length > 0) {
                const sources = [...pendingSourcesRef.current]
                pendingSourcesRef.current = []
                setSourcesMap(prev => ({ ...prev, [message.id]: sources }))
            }
        },
    });

    const [input, setInput] = useState('')
    const [isExpanded, setisExpanded] = useState(false)

    const bottomRef = useRef<HTMLDivElement>(null)
    const chatRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

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
        className={`flex flex-col fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg px-4 py-2 transition-all duration-300
        ${isExpanded ? 'w-[33vw] rounded-2xl' : 'w-72 rounded-3xl'} ${isExpanded && messages.length > 0 ? 'h-[28rem]' : ''}`}
            >
            <div className={`flex-1 flex flex-col chat-messages gap-1 overflow-y-auto min-h-0 ${isExpanded && messages.length > 0 ? 'border-b border-black/15' : ''}`}>
                {isExpanded && messages.map(message => (
                <div key={message.id} className="flex flex-col">
                    <div className={`flex ${message.role === "user" ? 'justify-end mr-2' : 'justify-start'}`}>
                        <div className={`rounded-2xl px-3 py-1 max-w-[80%] text-sm ${message.role === 'user' ? 'bg-gray-100 shadow-sm' : 'bg-transparent'}`}>
                            {message.parts.map((part, index) =>
                            part.type === 'text' ? <div key={index} className="prose prose-sm"><ReactMarkdown>{part.text}</ReactMarkdown></div> : null,
                            )}
                        </div>
                    </div>

                    {message.role === 'assistant' && sourcesMap[message.id]?.length > 0 && (
                        <div className="pl-1 pb-2 pt-0.5">
                            <button
                                onClick={() => setExpandedSources(prev => {
                                    const next = new Set(prev)
                                    next.has(message.id) ? next.delete(message.id) : next.add(message.id)
                                    return next
                                })}
                                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <span className="inline-block transition-transform duration-200" style={{ transform: expandedSources.has(message.id) ? 'rotate(90deg)' : 'rotate(0deg)' }}>▸</span>
                                {' '}{sourcesMap[message.id].length} source{sourcesMap[message.id].length > 1 ? 's' : ''}
                            </button>
                            <div className="grid transition-all duration-200 ease-in-out" style={{ gridTemplateRows: expandedSources.has(message.id) ? '1fr' : '0fr' }}>
                                <div className="overflow-hidden">
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {sourcesMap[message.id].map((source: any) => (
                                            <button
                                                key={source.id}
                                                onClick={() => {
                                                    const target = document.getElementById(String(source.id))
                                                    target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                                    target?.classList.add('flash')
                                                    setTimeout(() => target?.classList.remove('flash'), 1500)
                                                }}
                                                className="text-xs text-gray-600 bg-gray-200/70 border border-gray-300 rounded-lg px-2 py-0.5 max-w-[200px] truncate hover:bg-gray-300/70 transition-colors cursor-pointer"
                                                title={source.source_url}
                                            >
                                                {source.content ? source.content.slice(0, 35).trim() + '…' : source.source_url}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                ))}
                {status === 'submitted' && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl px-3 py-1 text-gray-400 text-sm">
                            <i className="bi bi-arrow-repeat animate-spin inline-block"></i>
                        </div>
                    </div>
                )}

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
                className={`flex items-center justify-between gap-2 ${isExpanded && messages.length > 0 ? 'pt-2' : ''}`}
            >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setisExpanded(true)}
              disabled={status !== 'ready'}
              placeholder="Ask anything..."
              className="outline-none flex-1 text-sm"
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
