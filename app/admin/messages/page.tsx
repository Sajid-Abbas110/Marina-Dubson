'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
    Search,
    Send,
    Shield,
    Globe,
    Terminal,
    Camera,
    Mic,
    MoreHorizontal,
    Paperclip,
    Smile,
    Lock,
    CheckCheck,
    Zap,
    Filter,
    Monitor,
    Sparkles,
    UserCircle
} from 'lucide-react'

export default function TacticalCommMatrix() {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [activeChat, setActiveChat] = useState<string | null>(null)
    const [conversations, setConversations] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const fetchConversations = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/messages/conversations', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setConversations(data.conversations || [])
            if (data.conversations?.length > 0 && !activeChat) {
                if (!activeChat) setActiveChat(data.conversations[0].id)
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error)
        } finally {
            setLoading(false)
        }
    }, [activeChat])

    const fetchMessages = async (recipientId: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/messages?recipientId=${recipientId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch messages')
            const data = await res.json()
            setMessages(Array.isArray(data.messages) ? data.messages : [])
        } catch (error) {
            console.error('Failed to fetch messages:', error)
            setMessages([])
        }
    }

    const handleSearch = async (query: string) => {
        setSearchQuery(query)
        if (query.length < 2) {
            setSearchResults([])
            return
        }

        try {
            const res = await fetch(`/api/admin/users?search=${query}`)
            const data = await res.json()
            setSearchResults(data.users || [])
        } catch (error) {
            console.error('Search failed:', error)
        }
    }

    const startConversation = (user: any) => {
        const existing = conversations.find(c => c.id === user.id)
        if (existing) {
            setActiveChat(existing.id)
        } else {
            const newConv = {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role,
                lastMsg: 'Drafting transmission...',
                time: new Date().toISOString()
            }
            setConversations([newConv, ...conversations])
            setActiveChat(user.id)
        }
        setSearchQuery('')
        setSearchResults([])
    }

    const sendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!newMessage.trim()) return

        const isClientNoChat = currentUser?.role === 'CLIENT' && !activeChat

        try {
            const token = localStorage.getItem('token')
            const body: any = { content: newMessage }

            if (activeChat) {
                body.recipientId = activeChat
            }

            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                const msg = await res.json()
                setMessages([...messages, msg])
                setNewMessage('')
                fetchConversations()

                if (isClientNoChat) {
                    setTimeout(fetchConversations, 1000)
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    }

    useEffect(() => {
        fetchConversations()
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                setCurrentUser(payload)
            } catch (e) { }
        }
    }, [fetchConversations])

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat)
            const interval = setInterval(() => fetchMessages(activeChat), 5000)
            return () => clearInterval(interval)
        }
    }, [activeChat])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const activeConv = conversations.find(c => c.id === activeChat)

    return (
        <div className="h-full w-full flex flex-col xl:flex-row gap-4 bg-background p-4 lg:p-6 font-poppins transition-colors duration-500 overflow-hidden">
            {/* Sidebar Context */}
            <div className="xl:w-[320px] w-full flex flex-col gap-4 flex-shrink-0 animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="glass-panel p-5 space-y-4 rounded-[2rem] border border-border bg-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-black text-foreground tracking-tighter uppercase leading-none">
                                Comm <span className="brand-gradient italic">Matrix</span>
                            </h1>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-1.5">Network Active</p>
                        </div>
                        <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group cursor-pointer hover:bg-primary transition-all">
                            <Zap className="h-3.5 w-3.5 text-primary group-hover:text-primary-foreground" />
                        </div>
                    </div>

                    <div className="relative group z-50">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            className="w-full bg-muted/50 border border-border rounded-xl pl-12 py-3 placeholder:text-muted-foreground/50 text-[10px] uppercase font-black focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            placeholder="IDENTIFY NODE..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl border border-border max-h-60 overflow-y-auto custom-scrollbar p-2">
                                {searchResults.map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => startConversation(user)}
                                        className="w-full p-3 rounded-lg hover:bg-muted flex items-center gap-3 transition-colors text-left"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-foreground uppercase">{user.firstName} {user.lastName}</p>
                                            <p className="text-[8px] font-bold text-muted-foreground uppercase">{user.role}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 glass-panel rounded-[2rem] flex flex-col overflow-hidden min-h-[300px] border border-border bg-card">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                        <span className="text-[9px] font-black tracking-[0.3em] text-muted-foreground uppercase">Linked Channels</span>
                        <Filter className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {loading ? (
                            <div className="p-8 text-center text-[10px] uppercase font-black text-muted-foreground">Scanning Signal...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-[10px] uppercase font-black text-muted-foreground">
                                {currentUser?.role === 'CLIENT' ? 'Ready to Transmit to HQ' : 'No Active Channels Found'}
                            </div>
                        ) : conversations.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setActiveChat(c.id)}
                                className={`w-full p-4 rounded-2xl text-left transition-all relative group flex items-start gap-4 ${activeChat === c.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-transparent hover:bg-muted'}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className={`h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-sm font-black ${activeChat === c.id ? 'text-primary-foreground' : 'text-primary'} shadow-md`}>
                                        {c.name.split(' ').map((n: any) => n[0]).join('')}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500"></div>
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className={`text-[10px] font-black uppercase tracking-tight truncate ${activeChat === c.id ? 'text-primary-foreground' : 'text-foreground'}`}>{c.name}</h4>
                                        <span className={`text-[7px] font-bold ${activeChat === c.id ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                                            {c.time ? new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <p className={`text-[9px] font-medium truncate opacity-60 ${activeChat === c.id ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{c.lastMsg}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tactical Stream */}
            <div className="flex-1 glass-panel rounded-[2.5rem] flex flex-col overflow-hidden relative animate-in fade-in slide-in-from-right-8 duration-700 shadow-2xl shadow-primary/5 border border-border bg-card">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-500 z-50"></div>

                {/* Header */}
                <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between backdrop-blur-3xl">
                    <div className="flex items-center gap-4">
                        {activeConv ? (
                            <>
                                <div className="relative">
                                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xs shadow-lg">
                                        {activeConv.name.split(' ').map((n: any) => n[0]).join('')}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-background rounded-full"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-black text-foreground tracking-widest uppercase">
                                            {activeConv.name}
                                        </h3>
                                        <Shield className="h-3 w-3 text-primary" />
                                    </div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Linked {activeConv.role} Node • Secure</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">?</div>
                                <div>
                                    <h3 className="text-lg font-black text-muted-foreground uppercase tracking-widest">NO LINK ESTABLISHED</h3>
                                    <p className="text-[9px] text-muted-foreground uppercase">Transmit context to initiate connection</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all"><Camera className="h-4 w-4" /></button>
                        <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all"><Mic className="h-4 w-4" /></button>
                        <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                </div>

                {/* Message Stream */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 bg-gradient-to-b from-muted/20 to-transparent custom-scrollbar">
                    <div className="flex flex-col items-center py-4">
                        <div className="px-6 py-2 rounded-xl bg-muted/50 border border-border flex items-center gap-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            <Lock className="h-3.5 w-3.5 text-emerald-500" /> RSA-4096 Tactical Relay Active
                        </div>
                    </div>

                    {messages.map((m, idx) => (
                        <MessageBubble
                            key={m.id || idx}
                            body={m.content}
                            time={m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            isMe={m.senderId === currentUser?.userId || m.senderId === currentUser?.id}
                            name={m.sender ? `${m.sender.firstName} ${m.sender.lastName}` : 'Unknown User'}
                        />
                    ))}
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <Globe className="h-20 w-20 mb-4" />
                            <p className="text-xs font-black uppercase tracking-[0.5em]">Initiate Node Discovery...</p>
                        </div>
                    )}
                </div>

                {/* Tactical Input */}
                <div className="p-6 bg-background/80 border-t border-border backdrop-blur-3xl">
                    <form onSubmit={sendMessage} className="flex items-center gap-4 bg-muted rounded-[2rem] p-3 border border-border shadow-inner">
                        <button type="button" className="h-10 w-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary transition-all flex items-center justify-center flex-shrink-0">
                            <Paperclip className="h-5 w-5" />
                        </button>
                        <input
                            className="flex-1 bg-transparent border-none outline-none text-xs font-medium px-2 py-2 text-foreground placeholder:text-muted-foreground/50"
                            placeholder={currentUser?.role === 'CLIENT' && !activeChat ? "TRANSMIT DIRECT TO HQ..." : "COMMUNICATE SECURE NODE TRANSMISSION..."}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <button type="button" className="h-10 w-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-yellow-500 transition-all flex items-center justify-center">
                                <Smile className="h-5 w-5" />
                            </button>
                            <button
                                type="submit"
                                className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest flex items-center gap-3 hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/20"
                            >
                                Transmit <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                    <div className="flex items-center justify-center mt-6 gap-6 opacity-30">
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] flex items-center gap-2"><Shield className="h-2.5 w-2.5" /> ECC_ACTIVE</span>
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] flex items-center gap-2"><Monitor className="h-2.5 w-2.5" /> UPTIME_99.9%</span>
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] flex items-center gap-2"><Sparkles className="h-2.5 w-2.5" /> TACTICAL_V4</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MessageBubble({ body, time, isMe, name }: any) {
    return (
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-${isMe ? 'right' : 'left'}-4 duration-500`}>
            <div className="flex items-center gap-3 mb-2 px-2">
                {!isMe && <span className="text-[9px] font-black text-foreground uppercase tracking-tighter">{name}</span>}
                <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">{time}</span>
                {isMe && <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Command Unit</span>}
            </div>
            <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-lg relative border ${isMe ? 'bg-primary border-primary/20 text-primary-foreground rounded-tr-none' : 'bg-card border-border text-foreground rounded-tl-none shadow-sm'}`}>
                <p className="text-xs leading-relaxed font-medium uppercase tracking-tight">{body}</p>
                {isMe && <div className="absolute bottom-3 right-5 opacity-40"><CheckCheck className="h-3 w-3" /></div>}
            </div>
        </div>
    )
}
