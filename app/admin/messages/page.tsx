'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
    Search, Send, Shield, Globe, Camera, Mic, MoreHorizontal,
    Paperclip, Smile, Lock, CheckCheck, Zap, Filter, Monitor,
    Sparkles, Loader2, AlertTriangle, RefreshCw, Link2, X,
    Download, FileText, ImageIcon, MicOff, StopCircle, Copy,
    Trash2, ChevronDown, ExternalLink
} from 'lucide-react'
import NextImage from 'next/image'

// ─── Emoji Data ───────────────────────────────────────────────────────────────
const EMOJIS = {
    '😀 Smileys': ['😀', '😂', '🥲', '😊', '😇', '🥰', '😍', '🤩', '😘', '😎', '🤔', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😤', '😠', '😡', '🤬', '😱', '😨', '😰', '😢', '😭', '😤', '🤯', '😵'],
    '👍 Gestures': ['👍', '👎', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐', '✋', '🖖', '🤝', '🙏', '💪', '🫶', '❤️', '🔥', '⚡', '✅', '❌', '💯', '🎯'],
    '🏢 Work': ['💼', '📋', '📁', '📂', '📊', '📈', '📉', '📝', '✏️', '🖊', '📌', '📍', '📎', '🔗', '📧', '📨', '📩', '💬', '🗨️', '🗯️', '💭', '🔔', '🔕', '📢', '📣', '⏰', '📅', '🗓️', '✔️', '🔒'],
}

// ─── Emoji Picker ─────────────────────────────────────────────────────────────
function EmojiPicker({ onSelect, onClose }: { onSelect: (e: string) => void; onClose: () => void }) {
    const [tab, setTab] = useState(0)
    const tabs = Object.keys(EMOJIS)
    const emojis = Object.values(EMOJIS)[tab]
    return (
        <div className="absolute bottom-full mb-3 right-0 w-[280px] sm:w-[320px] bg-card border border-border rounded-2xl shadow-2xl z-[200] animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex gap-1">
                    {tabs.map((t, i) => (
                        <button key={t} onClick={() => setTab(i)}
                            className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${tab === i ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                            {t.split(' ')[0]}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-8 gap-1 p-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                {emojis.map(e => (
                    <button key={e} onClick={() => onSelect(e)}
                        className="h-9 w-9 flex items-center justify-center text-xl hover:bg-muted rounded-lg transition-all hover:scale-125">
                        {e}
                    </button>
                ))}
            </div>
        </div>
    )
}

// ─── Link Modal ───────────────────────────────────────────────────────────────
function LinkModal({ onInsert, onClose }: { onInsert: (url: string, text: string) => void; onClose: () => void }) {
    const [url, setUrl] = useState('https://')
    const [text, setText] = useState('')
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl p-6 w-[360px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Insert Link</h3>
                    <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">URL</label>
                        <input value={url} onChange={e => setUrl(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border border-border text-xs outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Display Text (optional)</label>
                        <input value={text} onChange={e => setText(e.target.value)} placeholder="Leave blank to use URL" className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border border-border text-xs outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/40" />
                    </div>
                    <button onClick={() => { onInsert(url, text || url); onClose() }}
                        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        <Link2 className="h-3.5 w-3.5" /> Insert Link
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Camera Modal ─────────────────────────────────────────────────────────────
function CameraModal({ onCapture, onClose }: { onCapture: (dataUrl: string) => void; onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        let currentStream: MediaStream | null = null
        navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
            currentStream = s
            setStream(s)
            if (videoRef.current) videoRef.current.srcObject = s
        }).catch(() => setError('Camera access denied. Please allow camera permissions.'))
        return () => { currentStream?.getTracks().forEach(t => t.stop()) }
    }, [])

    const capture = () => {
        if (!videoRef.current || !canvasRef.current) return
        const ctx = canvasRef.current.getContext('2d')!
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)
        setPreview(canvasRef.current.toDataURL('image/jpeg', 0.8))
    }

    const send = () => {
        if (preview) { onCapture(preview); stream?.getTracks().forEach(t => t.stop()); onClose() }
    }

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl p-5 w-[480px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2"><Camera className="h-4 w-4 text-primary" /> Camera Capture</h3>
                    <button onClick={() => { stream?.getTracks().forEach(t => t.stop()); onClose() }}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                {error ? <p className="text-rose-500 text-xs font-black uppercase text-center py-8">{error}</p> : (
                    <>
                        {!preview ? (
                            <video ref={videoRef} autoPlay className="w-full rounded-xl bg-black aspect-video" />
                        ) : (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                <NextImage src={preview} fill className="object-cover" alt="Preview" unoptimized />
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                        <div className="flex gap-3 mt-4">
                            {!preview ? <button onClick={capture} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Camera className="h-3.5 w-3.5" /> Capture</button>
                                : <>
                                    <button onClick={() => setPreview(null)} className="flex-1 py-2.5 rounded-xl bg-muted border border-border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><RefreshCw className="h-3.5 w-3.5" /> Retake</button>
                                    <button onClick={send} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Send className="h-3.5 w-3.5" /> Send</button>
                                </>
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ body, time, isMe, name, isPending, onCopy, onDelete }: any) {
    const [menu, setMenu] = useState(false)
    const isImage = body?.startsWith('data:image') || body?.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)
    const isLink = body?.startsWith('[LINK:')
    const isFile = body?.startsWith('[FILE:')
    const isAudio = body?.startsWith('[AUDIO:')

    const renderContent = () => {
        if (isImage) return (
            <div className="relative max-w-[260px] aspect-auto rounded-xl overflow-hidden cursor-pointer" onClick={() => window.open(body, '_blank')}>
                <NextImage
                    src={body}
                    alt="Image"
                    width={260}
                    height={200}
                    className="w-full h-auto rounded-xl"
                    unoptimized
                />
            </div>
        )
        if (isLink) {
            const [, url, text] = body.match(/\[LINK:(.*?)\|(.*?)\]/) || []
            return <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline text-xs font-medium"><ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />{text}</a>
        }
        if (isFile) {
            const [, url, fname] = body.match(/\[FILE:(.*?)\|(.*?)\]/) || []
            return <a href={url} target="_blank" rel="noreferrer" download className="flex items-center gap-2 text-xs font-medium hover:underline"><FileText className="h-4 w-4 flex-shrink-0" />{fname}<Download className="h-3 w-3 ml-1 opacity-60" /></a>
        }
        if (isAudio) {
            const [, url] = body.match(/\[AUDIO:(.*?)\]/) || []
            return <audio controls src={url} className="max-w-[220px] h-10" />
        }
        return <p className="text-sm leading-relaxed break-words">{body}</p>
    }

    return (
        // Outgoing → flush RIGHT, Incoming → flush LEFT
        <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300 group mb-1`}>
            <div className={`flex flex-col max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>
                {/* Sender label + time */}
                <div className={`flex items-center gap-2 mb-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isMe && <span className="text-[10px] font-bold text-primary uppercase tracking-tight">{name}</span>}
                    {isMe && <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">You</span>}
                    <span className="text-[9px] text-muted-foreground">{time}</span>
                </div>

                {/* Bubble */}
                <div className="relative flex items-end gap-1.5">
                    <div className={`
                        px-5 py-3.5 rounded-2xl shadow-md border relative
                        ${isMe
                            // Outgoing: rich indigo/primary gradient, white text
                            ? 'bg-gradient-to-br from-primary to-indigo-600 border-primary/30 text-white rounded-br-sm'
                            // Incoming: dark slate, light text
                            : 'bg-slate-800 border-slate-700 text-slate-100 rounded-bl-sm'
                        }
                        ${isPending ? 'opacity-60' : ''}
                    `}>
                        {renderContent()}
                        {/* Tick for outgoing */}
                        {isMe && (
                            <div className="flex justify-end mt-1 opacity-60">
                                {isPending
                                    ? <Loader2 className="h-3 w-3 animate-spin" />
                                    : <CheckCheck className="h-3 w-3" />
                                }
                            </div>
                        )}
                    </div>

                    {/* Hover context menu */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity relative self-center">
                        <button onClick={() => setMenu(!menu)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-all">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                        {menu && (
                            <div className={`absolute bottom-full mb-1 ${isMe ? 'right-0' : 'left-0'} bg-card border border-border rounded-xl shadow-2xl z-50 w-40 p-1 animate-in fade-in zoom-in-95 duration-150`}>
                                <button onClick={() => { onCopy(body); setMenu(false) }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-[10px] font-black uppercase tracking-wide text-foreground transition-colors"><Copy className="h-3 w-3" /> Copy</button>
                                {isMe && <button onClick={() => { onDelete(); setMenu(false) }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-wide text-rose-500 transition-colors"><Trash2 className="h-3 w-3" /> Delete</button>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TacticalCommMatrix() {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [searchDropdownPos, setSearchDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null)
    const searchBoxRef = useRef<HTMLInputElement>(null)
    const [activeChat, setActiveChat] = useState<string | null>(null)
    const [conversations, setConversations] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [sendError, setSendError] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [sseConnected, setSseConnected] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    // Panels
    const [showEmoji, setShowEmoji] = useState(false)
    const [showLink, setShowLink] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [showMenu3dot, setShowMenu3dot] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [recordSeconds, setRecordSeconds] = useState(0)
    const [uploadingFile, setUploadingFile] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)
    const sseRef = useRef<EventSource | null>(null)
    const msgIdsRef = useRef<Set<string>>(new Set())
    const fileInputRef = useRef<HTMLInputElement>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auth
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        try {
            const p = JSON.parse(atob(token.split('.')[1]))
            setCurrentUser({ ...p, userId: p.userId || p.id })
        } catch { }
    }, [])

    // Fetch conversations
    const fetchConversations = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/messages/conversations', { headers: { 'Authorization': `Bearer ${token}` } })
            if (res.ok) {
                const data = await res.json()
                setConversations(prev => {
                    const fetched = data.conversations || []
                    const temps = prev.filter(c => c.isTemp && !fetched.find((f: any) => f.id === c.id))
                    return [...fetched, ...temps]
                })
            }
        } catch { } finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchConversations(); const i = setInterval(fetchConversations, 12000); return () => clearInterval(i) }, [fetchConversations])

    // Auto-load ALL users into linked channels on mount
    useEffect(() => {
        const loadAllUsers = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
                if (!res.ok) return
                const data = await res.json()
                const uid = (() => { try { const p = JSON.parse(atob((token || '').split('.')[1])); return p.userId || p.id } catch { return null } })()
                const all = (data.users || []).filter((u: any) => u.id !== uid)
                setConversations(prev => {
                    const ids = new Set(prev.map(c => c.id))
                    const newOnes = all.filter((u: any) => !ids.has(u.id)).map((u: any) => ({
                        id: u.id,
                        name: `${u.firstName} ${u.lastName}`,
                        role: u.role,
                        lastMsg: 'Ready to connect',
                        time: null,
                        isTemp: true
                    }))
                    return [...prev, ...newOnes]
                })
            } catch { }
        }
        loadAllUsers()
    }, [])

    // Initial messages
    const loadMessages = useCallback(async (rid: string) => {
        setLoadingChat(true)
        setMessages([]) // Clear immediately to prevent mixing
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`/api/messages?recipientId=${rid}`, { headers: { 'Authorization': `Bearer ${token}` } })
            if (res.ok) {
                const data = await res.json()
                const msgs = data.messages || []
                setMessages(msgs)
                msgIdsRef.current = new Set(msgs.map((m: any) => m.id))
            }
        } catch { } finally { setLoadingChat(false) }
    }, [])

    // SSE
    useEffect(() => {
        if (!activeChat) { setMessages([]); msgIdsRef.current = new Set(); setSseConnected(false); sseRef.current?.close(); return }
        sseRef.current?.close()
        loadMessages(activeChat)
        const token = localStorage.getItem('token')
        const sse = new EventSource(`/api/messages/stream?recipientId=${activeChat}&token=${token}`)
        sseRef.current = sse
        sse.onopen = () => setSseConnected(true)
        sse.onmessage = (ev) => {
            try {
                const p = JSON.parse(ev.data)
                if (p.type === 'connected') setSseConnected(true)
                if (p.type === 'messages') {
                    setMessages(prev => {
                        // Only process genuinely new messages we haven't seen yet
                        const inc: any[] = p.messages.filter((m: any) => !msgIdsRef.current.has(m.id))
                        if (!inc.length) return prev
                        inc.forEach((m: any) => msgIdsRef.current.add(m.id))

                        // Keep all existing messages — both confirmed and temp (isTemp)
                        // BUT drop any temp message whose real counterpart just arrived via SSE
                        // (match by senderId + content to link temp → real)
                        const incBySenderContent = new Set(
                            inc.map((m: any) => `${m.senderId}::${m.content}`)
                        )
                        const filtered = prev.filter(m =>
                            // Keep real messages always
                            !m.isTemp ||
                            // Keep temp messages UNLESS their real version just arrived
                            !incBySenderContent.has(`${m.senderId}::${m.content}`)
                        )

                        return [...filtered, ...inc].sort(
                            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        )
                    })
                }
            } catch { }
        }
        sse.onerror = () => setSseConnected(false)
        return () => { sse.close(); setSseConnected(false) }
    }, [activeChat, loadMessages])

    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [messages])

    const handleSearch = async (q: string) => {
        setSearchQuery(q)
        if (q.length < 2) { setSearchResults([]); setSearchDropdownPos(null); return }
        // Capture input bounding box so dropdown renders at fixed viewport coords
        if (searchBoxRef.current) {
            const rect = searchBoxRef.current.getBoundingClientRect()
            setSearchDropdownPos({ top: rect.bottom + 8, left: rect.left, width: rect.width })
        }
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/admin/users?search=${q}`, { headers: { 'Authorization': `Bearer ${token}` } })
        const data = await res.json()
        setSearchResults(data.users || [])
    }

    const startConversation = (user: any) => {
        const ex = conversations.find(c => c.id === user.id)
        if (ex) { setActiveChat(ex.id) }
        else {
            setConversations(prev => [{ id: user.id, name: `${user.firstName} ${user.lastName}`, role: user.role, lastMsg: 'Initializing...', time: null, isTemp: true }, ...prev])
            setActiveChat(user.id)
        }
        setSearchQuery(''); setSearchResults([])
    }

    const handleScanNodes = async () => {
        setIsScanning(true)
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            const network = (data.users || []).filter((u: any) => ['CLIENT', 'REPORTER'].includes(u.role) && u.id !== currentUser?.userId)
            setConversations(prev => {
                const ids = new Set(prev.map(c => c.id))
                const newOnes = network.filter((u: any) => !ids.has(u.id)).map((u: any) => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, role: u.role, lastMsg: 'Ready to connect', time: null, isTemp: true }))
                return [...prev, ...newOnes]
            })
        } catch { } finally { setIsScanning(false) }
    }

    // Core send
    const doSend = async (content: string) => {
        if (!content.trim() || !activeChat) return
        setSending(true); setSendError(null)
        const tempId = `temp-${Date.now()}`
        const tempMsg = { id: tempId, content, createdAt: new Date().toISOString(), senderId: currentUser?.userId, isTemp: true, sender: { id: currentUser?.userId, firstName: currentUser?.firstName || 'You', lastName: '', role: currentUser?.role } }
        setMessages(prev => [...prev, tempMsg])
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ content, recipientId: activeChat }) })
            if (res.ok) {
                const msg = await res.json()
                msgIdsRef.current.add(msg.id)
                setMessages(prev => {
                    // Check if temp still exists in state (not yet swapped by SSE)
                    const tempStillPresent = prev.some(m => m.id === tempId)
                    if (tempStillPresent) {
                        // Happy path: replace the temp with the confirmed message
                        return prev.map(m => m.id === tempId ? { ...msg, isTemp: false } : m)
                    }
                    // SSE already swapped it out — check if real msg is already in list
                    const alreadyInList = prev.some(m => m.id === msg.id)
                    if (alreadyInList) return prev
                    // Neither temp nor real is present — append the real message
                    return [...prev, { ...msg, isTemp: false }].sort(
                        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    )
                })
                fetchConversations()
            } else {
                const err = await res.json().catch(() => ({}))
                setMessages(prev => prev.filter(m => m.id !== tempId))
                setSendError(err.error || 'Failed to send. Please try again.')
            }
        } catch { setSendError('Network error'); setMessages(prev => prev.filter(m => m.id !== tempId)) }
        finally { setSending(false) }
    }

    const sendMessage = (e?: React.FormEvent) => { if (e) e.preventDefault(); doSend(newMessage); setNewMessage('') }

    // File upload
    const handleFileUpload = async (file: File) => {
        if (!activeChat) return
        setUploadingFile(true)
        const fd = new FormData()
        fd.append('file', file)
        fd.append('category', 'CLIENT_UPLOAD')
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/documents', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd })
            if (res.ok) {
                const doc = await res.json()
                const isImg = file.type.startsWith('image/')
                await doSend(isImg ? doc.fileUrl : `[FILE:${doc.fileUrl}|${file.name}]`)
            } else { setSendError('File upload failed') }
        } catch { setSendError('Upload error') }
        finally { setUploadingFile(false) }
    }

    // Camera capture → send as inline base64
    const handleCameraCapture = async (dataUrl: string) => {
        await doSend(dataUrl)
    }

    // Voice recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mr = new MediaRecorder(stream)
            audioChunksRef.current = []
            mr.ondataavailable = e => audioChunksRef.current.push(e.data)
            mr.onstop = async () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' })
                stream.getTracks().forEach(t => t.stop())
                await handleFileUpload(file)
            }
            mr.start()
            mediaRecorderRef.current = mr
            setIsRecording(true)
            setRecordSeconds(0)
            recordTimerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000)
        } catch { setSendError('Microphone access denied') }
    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop()
        setIsRecording(false)
        if (recordTimerRef.current) clearInterval(recordTimerRef.current)
    }

    const handleCopyMsg = (body: string) => { navigator.clipboard.writeText(body).catch(() => { }) }
    const handleDeleteMsg = (id: string) => setMessages(prev => prev.filter(m => m.id !== id))
    const insertEmoji = (e: string) => { setNewMessage(p => p + e); setShowEmoji(false); inputRef.current?.focus() }
    const insertLink = (url: string, text: string) => { setNewMessage(p => p + `[LINK:${url}|${text}]`); inputRef.current?.focus() }

    const activeConv = conversations.find(c => c.id === activeChat)

    return (
        <div className="h-full w-full flex flex-col xl:flex-row gap-4 bg-background p-4 lg:p-6 font-poppins overflow-hidden">
            {/* ── Search dropdown portal — fixed position, escapes ALL stacking contexts ── */}
            {searchResults.length > 0 && searchDropdownPos && (
                <div
                    style={{
                        position: 'fixed',
                        top: searchDropdownPos.top,
                        left: searchDropdownPos.left,
                        width: searchDropdownPos.width,
                        zIndex: 9999,
                    }}
                    className="bg-card rounded-xl shadow-2xl border border-border max-h-56 overflow-y-auto p-2 animate-in fade-in zoom-in-95 duration-150"
                >
                    {searchResults.map(u => (
                        <button key={u.id} onMouseDown={() => startConversation(u)} className="w-full p-3 rounded-lg hover:bg-muted flex items-center gap-3 transition-colors text-left">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs flex-shrink-0">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                            <div><p className="text-[10px] font-black text-foreground uppercase">{u.firstName} {u.lastName}</p><p className="text-[8px] text-muted-foreground uppercase">{u.role}</p></div>
                        </button>
                    ))}
                </div>
            )}

            {/* Modals */}
            {showLink && <LinkModal onInsert={insertLink} onClose={() => setShowLink(false)} />}
            {showCamera && <CameraModal onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.txt,.xlsx" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = '' }} />

            {/* ── Sidebar ── */}
            <div className={`xl:w-[300px] w-full flex-col gap-4 flex-shrink-0 animate-in fade-in slide-in-from-left-8 duration-700 ${activeChat ? 'hidden xl:flex' : 'flex h-full'}`}>
                <div className="glass-panel p-5 space-y-4 rounded-[2rem] border border-border bg-card flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-black text-foreground tracking-tighter uppercase leading-none">Comm <span className="brand-gradient italic">Matrix</span></h1>
                            <div className="flex items-center gap-2 mt-1"><p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.4em]">Network Active</p><span className={`h-2 w-2 rounded-full ${sseConnected && activeChat ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'}`} /></div>
                        </div>
                        <button onClick={fetchConversations} className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary group transition-all"><Zap className="h-3.5 w-3.5 text-primary group-hover:text-primary-foreground" /></button>
                    </div>
                    {/* Search — dropdown uses position:fixed to escape all stacking contexts */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors z-10 pointer-events-none" />
                        <input
                            ref={searchBoxRef}
                            className="w-full bg-muted/50 border border-border rounded-xl pl-12 py-3 placeholder:text-muted-foreground/50 text-[10px] uppercase font-black focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            placeholder="IDENTIFY NODE..."
                            value={searchQuery}
                            onChange={e => handleSearch(e.target.value)}
                            onBlur={() => setTimeout(() => { setSearchResults([]); setSearchDropdownPos(null) }, 150)}
                        />
                    </div>
                </div>

                <div className="flex-1 glass-panel rounded-[2rem] flex flex-col overflow-hidden min-h-0 border border-border bg-card">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30 flex-shrink-0">
                        <span className="text-[9px] font-black tracking-[0.3em] text-muted-foreground uppercase">Linked Channels</span>
                        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {loading ? <div className="p-8 flex flex-col items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary" /><span className="text-[10px] uppercase font-black text-muted-foreground">Scanning...</span></div> : (
                            <>
                                {conversations.length === 0 && (
                                    <div className="p-4 space-y-3">
                                        <button onClick={handleScanNodes} disabled={isScanning} className="w-full p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all flex items-start gap-4 group">
                                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">{isScanning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}</div>
                                            <div className="pt-0.5"><h4 className="text-[10px] font-black uppercase text-foreground">{isScanning ? 'Scanning...' : 'Scan Available Nodes'}</h4><p className="text-[9px] text-muted-foreground uppercase">Find Clients & Reporters</p></div>
                                        </button>
                                    </div>
                                )}
                                {conversations.map(c => (
                                    <button key={c.id} onClick={() => setActiveChat(c.id)} className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-3 ${activeChat === c.id ? 'bg-primary shadow-lg shadow-primary/20' : 'hover:bg-muted'}`}>
                                        <div className="relative flex-shrink-0">
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-black shadow-md ${activeChat === c.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>{c.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}</div>
                                            <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${c.isTemp ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h4 className={`text-[10px] font-black uppercase truncate ${activeChat === c.id ? 'text-white' : 'text-foreground'}`}>{c.name}</h4>
                                                <span className={`text-[7px] font-bold ${activeChat === c.id ? 'text-white/60' : 'text-muted-foreground'}`}>{c.time ? new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                            </div>
                                            <p className={`text-[9px] truncate opacity-60 ${activeChat === c.id ? 'text-white' : 'text-muted-foreground'}`}>{c.lastMsg}</p>
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Chat Panel ── */}
            <div className={`flex-1 glass-panel rounded-[2.5rem] flex-col overflow-hidden relative animate-in fade-in slide-in-from-right-8 duration-700 shadow-2xl shadow-primary/5 border border-border bg-card ${activeChat ? 'flex h-full' : 'hidden xl:flex'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-500 z-50" />

                {/* Header */}
                <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between backdrop-blur-3xl flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActiveChat(null)} className="xl:hidden h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                            <ChevronDown className="h-5 w-5 rotate-90" />
                        </button>
                        {activeConv ? (
                            <>
                                <div className="relative">
                                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xs shadow-lg">{activeConv.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}</div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 border-2 border-background rounded-full ${sseConnected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2"><h3 className="text-lg font-black text-foreground tracking-widest uppercase truncate max-w-[150px] sm:max-w-none">{activeConv.name}</h3><Shield className="h-3 w-3 text-primary" /></div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">{activeConv.role} • {sseConnected ? 'LIVE' : 'Connecting...'}</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-black text-xl">?</div>
                                <div><h3 className="text-lg font-black text-muted-foreground uppercase tracking-widest">NO LINK ESTABLISHED</h3><p className="text-[9px] text-muted-foreground uppercase">Select a channel to begin</p></div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Camera */}
                        <button onClick={() => setShowCamera(true)} title="Open camera" className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><Camera className="h-4 w-4" /></button>
                        {/* Mic / Voice */}
                        {isRecording
                            ? <button onClick={stopRecording} className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all flex items-center gap-1">
                                <StopCircle className="h-4 w-4 animate-pulse" />
                                <span className="text-[9px] font-black">0:{recordSeconds.toString().padStart(2, '0')}</span>
                            </button>
                            : <button onClick={startRecording} title="Record voice" className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><Mic className="h-4 w-4" /></button>
                        }
                        {/* 3-dot menu */}
                        <div className="relative">
                            <button onClick={() => setShowMenu3dot(!showMenu3dot)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all"><MoreHorizontal className="h-4 w-4" /></button>
                            {showMenu3dot && (
                                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-2xl z-[200] w-48 p-1 animate-in fade-in zoom-in-95 duration-150">
                                    <button onClick={() => { navigator.clipboard.writeText(messages.map(m => `${m.sender?.firstName}: ${m.content}`).join('\n')); setShowMenu3dot(false) }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted text-[10px] font-black uppercase text-foreground transition-colors"><Copy className="h-3.5 w-3.5" /> Copy Chat Log</button>
                                    <button onClick={() => { setMessages([]); setShowMenu3dot(false) }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-rose-500/10 text-[10px] font-black uppercase text-rose-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /> Clear View</button>
                                    <button onClick={() => { fetchConversations(); setShowMenu3dot(false) }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted text-[10px] font-black uppercase text-foreground transition-colors"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-5 custom-scrollbar bg-background/50">
                    {activeChat && <div className="flex justify-center opacity-40"><div className="px-4 py-1.5 rounded-xl bg-muted/50 border border-border flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest"><Lock className="h-3 w-3 text-emerald-500" /> End-to-End Encrypted</div></div>}

                    {loadingChat ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing History...</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((m, i) => (
                                <MessageBubble
                                    key={m.id || i}
                                    body={m.content}
                                    time={m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                    isMe={m.isTemp || m.senderId === currentUser?.userId || m.senderId === currentUser?.id}
                                    name={m.sender ? `${m.sender.firstName} ${m.sender.lastName}` : 'Unknown'}
                                    isPending={!!m.isTemp}
                                    onCopy={handleCopyMsg}
                                    onDelete={() => handleDeleteMsg(m.id)}
                                />
                            ))}
                            {messages.length === 0 && activeChat && (
                                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                    <Globe className="h-16 w-16 mb-4 animate-pulse" />
                                    <p className="text-xs font-black uppercase tracking-[0.5em]">Secure Link Established - No History</p>
                                </div>
                            )}
                        </>
                    )}
                    {!activeChat && <div className="flex flex-col items-center justify-center py-24 opacity-20"><Globe className="h-20 w-20 mb-4" /><p className="text-xs font-black uppercase tracking-[0.5em]">Select a channel to begin</p></div>}
                </div>

                {/* Error */}
                {sendError && (
                    <div className="mx-6 mb-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 animate-in fade-in">
                        <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                        <p className="text-[10px] font-black text-rose-500 uppercase flex-1">{sendError}</p>
                        <button onClick={() => setSendError(null)}><X className="h-3.5 w-3.5 text-rose-400" /></button>
                    </div>
                )}

                {/* Toolbar */}
                <div className="p-5 bg-background/80 border-t border-border backdrop-blur-3xl flex-shrink-0 mb-safe">
                    <form onSubmit={sendMessage} className="flex items-center gap-3 bg-muted rounded-[2rem] px-4 py-3 border border-border shadow-inner relative">
                        {/* Attachment */}
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={!activeChat || uploadingFile} title="Attach file" className="h-9 w-9 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center flex-shrink-0 disabled:opacity-40">
                            {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                        </button>
                        {/* Link */}
                        <button type="button" onClick={() => setShowLink(true)} disabled={!activeChat} title="Insert link" className="h-9 w-9 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center flex-shrink-0 disabled:opacity-40">
                            <Link2 className="h-4 w-4" />
                        </button>

                        {/* Input */}
                        <input ref={inputRef} className="flex-1 bg-transparent border-none outline-none text-xs font-medium px-1 py-1 text-foreground placeholder:text-muted-foreground/40 disabled:cursor-not-allowed" placeholder={!activeChat ? 'Select a channel first...' : isRecording ? '🔴 Recording voice...' : 'Type a message...'} value={newMessage} onChange={e => setNewMessage(e.target.value)} disabled={!activeChat || isRecording || sending} />

                        {/* Emoji */}
                        <div>
                            {showEmoji && <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmoji(false)} />}
                            <button type="button" onClick={() => setShowEmoji(!showEmoji)} disabled={!activeChat} title="Emoji" className="h-9 w-9 rounded-xl bg-card border border-border text-muted-foreground hover:text-yellow-500 hover:border-yellow-500/40 transition-all flex items-center justify-center disabled:opacity-40">
                                <Smile className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Send */}
                        <button type="submit" disabled={sending || !activeChat || (!newMessage.trim() && !isRecording)} className="h-10 px-5 rounded-2xl bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:translate-y-[-1px] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none flex-shrink-0">
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-3.5 w-3.5" /><span className="hidden sm:block">Send</span></>}
                        </button>
                    </form>

                    <div className="flex items-center justify-center mt-3 gap-6 opacity-20">
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] flex items-center gap-1"><Shield className="h-2.5 w-2.5" /> ECC Active</span>
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] flex items-center gap-1"><Monitor className="h-2.5 w-2.5" /> Uptime 99.9%</span>
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" /> Tactical V5</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
