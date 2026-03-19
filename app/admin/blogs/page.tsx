'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
    FileText, Plus, Search, Edit3, Trash2, Globe, CheckCircle2,
    AlertCircle, Loader2, X, BarChart3, Bold, Italic, Underline,
    Strikethrough, Link2, List, ListOrdered, Quote, Code, AlignLeft,
    AlignCenter, AlignRight, AlignJustify, Image as ImageIcon, Video,
    Heading1, Heading2, Heading3, Upload, Link, Unlink, RotateCcw,
    RotateCw, Type, Minus, Table, Subscript, Superscript, ArrowUpRight
} from 'lucide-react'

/* ─────────────────── Rich Text Toolbar ─────────────────── */
function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [linkUrl, setLinkUrl] = useState('')
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

    // Sync external value → editor only on mount
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || ''
        }
    }, []) // eslint-disable-line

    const exec = useCallback((cmd: string, val?: string) => {
        document.execCommand(cmd, false, val ?? undefined)
        editorRef.current?.focus()
        if (editorRef.current) onChange(editorRef.current.innerHTML)
    }, [onChange])

    const handleFormat = useCallback(() => {
        const sel = document.getSelection()
        if (!sel) return
        const formats = new Set<string>()
            ;['bold', 'italic', 'underline', 'strikeThrough', 'insertOrderedList', 'insertUnorderedList'].forEach(f => {
                if (document.queryCommandState(f)) formats.add(f)
            })
        setActiveFormats(formats)
    }, [])

    const insertHeading = (level: number) => {
        exec('formatBlock', `h${level}`)
    }

    const insertLink = () => {
        if (linkUrl) {
            exec('createLink', linkUrl)
            setLinkUrl('')
            setShowLinkInput(false)
        }
    }

    const ToolBtn = ({ onClick, active, title, children }: any) => (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`p-1.5 rounded-lg text-[11px] font-bold transition-all hover:bg-slate-100 flex items-center justify-center min-w-[28px] ${active ? 'bg-blue-100 text-blue-600' : 'text-slate-600'}`}
        >
            {children}
        </button>
    )

    const Divider = () => <div className="w-px h-5 bg-slate-200 mx-0.5 self-center" />

    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-white">
            {/* Toolbar */}
            <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-100">
                {/* History */}
                <ToolBtn onClick={() => exec('undo')} title="Undo"><RotateCcw className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('redo')} title="Redo"><RotateCw className="h-3.5 w-3.5" /></ToolBtn>
                <Divider />

                {/* Headings */}
                <ToolBtn onClick={() => exec('formatBlock', 'p')} title="Paragraph"><Type className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => insertHeading(1)} title="H1"><span className="text-[10px] font-black">H1</span></ToolBtn>
                <ToolBtn onClick={() => insertHeading(2)} title="H2"><span className="text-[10px] font-black">H2</span></ToolBtn>
                <ToolBtn onClick={() => insertHeading(3)} title="H3"><span className="text-[10px] font-black">H3</span></ToolBtn>
                <ToolBtn onClick={() => insertHeading(4)} title="H4"><span className="text-[10px] font-black">H4</span></ToolBtn>
                <ToolBtn onClick={() => insertHeading(5)} title="H5"><span className="text-[10px] font-black">H5</span></ToolBtn>
                <ToolBtn onClick={() => insertHeading(6)} title="H6"><span className="text-[10px] font-black">H6</span></ToolBtn>
                <Divider />

                {/* Text Format */}
                <ToolBtn onClick={() => exec('bold')} active={activeFormats.has('bold')} title="Bold"><Bold className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('italic')} active={activeFormats.has('italic')} title="Italic"><Italic className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('underline')} active={activeFormats.has('underline')} title="Underline"><Underline className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('strikeThrough')} active={activeFormats.has('strikeThrough')} title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('superscript')} title="Superscript"><Superscript className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('subscript')} title="Subscript"><Subscript className="h-3.5 w-3.5" /></ToolBtn>
                <Divider />

                {/* Alignment */}
                <ToolBtn onClick={() => exec('justifyLeft')} title="Align Left"><AlignLeft className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('justifyCenter')} title="Align Center"><AlignCenter className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('justifyRight')} title="Align Right"><AlignRight className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('justifyFull')} title="Justify"><AlignJustify className="h-3.5 w-3.5" /></ToolBtn>
                <Divider />

                {/* Lists */}
                <ToolBtn onClick={() => exec('insertUnorderedList')} active={activeFormats.has('insertUnorderedList')} title="Bullet List"><List className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('insertOrderedList')} active={activeFormats.has('insertOrderedList')} title="Numbered List"><ListOrdered className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('indent')} title="Indent"><span className="text-[10px]">→</span></ToolBtn>
                <ToolBtn onClick={() => exec('outdent')} title="Outdent"><span className="text-[10px]">←</span></ToolBtn>
                <Divider />

                {/* Blocks */}
                <ToolBtn onClick={() => exec('formatBlock', 'blockquote')} title="Blockquote"><Quote className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('formatBlock', 'pre')} title="Code Block"><Code className="h-3.5 w-3.5" /></ToolBtn>
                <ToolBtn onClick={() => exec('insertHorizontalRule')} title="Divider"><Minus className="h-3.5 w-3.5" /></ToolBtn>
                <Divider />

                {/* Link */}
                <div className="relative flex items-center gap-1">
                    <ToolBtn onClick={() => setShowLinkInput(!showLinkInput)} title="Insert Link"><Link2 className="h-3.5 w-3.5" /></ToolBtn>
                    <ToolBtn onClick={() => exec('unlink')} title="Remove Link"><Unlink className="h-3.5 w-3.5" /></ToolBtn>
                    {showLinkInput && (
                        <div className="absolute top-9 left-0 z-50 flex items-center gap-2 bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-64">
                            <input
                                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="https://..."
                                value={linkUrl}
                                onChange={e => setLinkUrl(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && insertLink()}
                            />
                            <button type="button" onClick={insertLink} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-bold">Add</button>
                            <button type="button" onClick={() => setShowLinkInput(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="h-3 w-3" /></button>
                        </div>
                    )}
                </div>

                {/* Clear Format */}
                <Divider />
                <ToolBtn onClick={() => exec('removeFormat')} title="Clear Formatting"><span className="text-[10px] font-black text-red-400">Tx</span></ToolBtn>
            </div>

            {/* Editable body */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML) }}
                onKeyUp={handleFormat}
                onMouseUp={handleFormat}
                className="min-h-[420px] p-6 text-slate-700 text-sm leading-relaxed outline-none
                           [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:mb-4 [&_h1]:mt-6
                           [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:mb-3 [&_h2]:mt-5
                           [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mb-3 [&_h3]:mt-4
                           [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-slate-800 [&_h4]:mb-2 [&_h4]:mt-4
                           [&_h5]:text-base [&_h5]:font-bold [&_h5]:text-slate-800 [&_h5]:mb-2 [&_h5]:mt-3
                           [&_h6]:text-sm [&_h6]:font-bold [&_h6]:text-slate-700 [&_h6]:mb-2 [&_h6]:mt-3
                           [&_p]:mb-4 [&_p]:text-slate-700
                           [&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:bg-blue-50 [&_blockquote]:rounded-r-xl [&_blockquote]:my-4 [&_blockquote]:italic
                           [&_pre]:bg-slate-900 [&_pre]:text-emerald-400 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-4 [&_pre]:text-[12px] [&_pre]:font-mono
                           [&_code]:bg-slate-100 [&_code]:text-blue-700 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[12px] [&_code]:font-mono
                           [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
                           [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
                           [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer
                           [&_hr]:my-6 [&_hr]:border-slate-200
                           [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-4"
                data-placeholder="Start writing your article…"
                style={{ caretColor: '#2563eb' }}
            />
            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #94a3b8;
                    font-style: italic;
                    pointer-events: none;
                }
            `}</style>
        </div>
    )
}

/* ─────────────────── Media Upload Component ─────────────────── */
function MediaUpload({
    label, value, onChange, accept, type = 'image'
}: {
    label: string
    value: string
    onChange: (url: string) => void
    accept: string
    type?: 'image' | 'video'
}) {
    const [mode, setMode] = useState<'url' | 'upload'>('url')
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const token = localStorage.getItem('token')
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            })
            if (res.ok) {
                const data = await res.json()
                onChange(data.url)
            } else {
                // Fallback: create a local object URL for preview (dev only)
                const objectUrl = URL.createObjectURL(file)
                onChange(objectUrl)
            }
        } catch {
            const objectUrl = URL.createObjectURL(file)
            onChange(objectUrl)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</label>
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                    <button type="button" onClick={() => setMode('url')} className={`px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all ${mode === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                        URL
                    </button>
                    <button type="button" onClick={() => setMode('upload')} className={`px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all ${mode === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                        Upload
                    </button>
                </div>
            </div>

            {mode === 'url' ? (
                <div className="relative">
                    {type === 'image' ? <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" /> : <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />}
                    <input
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[11px] font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder={type === 'image' ? 'https://images.unsplash.com/...' : 'https://youtube.com/watch?v=...'}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            ) : (
                <div>
                    <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-slate-200 rounded-xl py-4 text-center hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                        {uploading ? (
                            <Loader2 className="h-5 w-5 text-blue-400 animate-spin mx-auto" />
                        ) : (
                            <>
                                <Upload className="h-5 w-5 text-slate-300 group-hover:text-blue-400 mx-auto mb-1 transition-colors" />
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-widest">Click to Upload</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Preview */}
            {value && (
                <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    {type === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={value} alt="Cover" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                        <div className="flex items-center gap-3 p-3">
                            <Video className="h-8 w-8 text-blue-400 flex-shrink-0" />
                            <span className="text-[10px] font-bold text-slate-500 truncate">{value}</span>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-2 right-2 h-6 w-6 bg-slate-900/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}
        </div>
    )
}

/* ─────────────────── Main Page ─────────────────── */
export default function BlogManagementPage() {
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'write' | 'seo' | 'media'>('write')

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        coverImage: '',
        coverVideo: '',
        metaTitle: '',
        metaDesc: '',
        published: false
    })

    const [seoScore, setSeoScore] = useState(0)

    useEffect(() => { fetchBlogs() }, [])

    useEffect(() => { calculateSeoScore() }, [formData]) // eslint-disable-line

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/blogs', { headers: { 'Authorization': `Bearer ${token}` } })
            const data = await res.json()
            setBlogs(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to fetch blogs:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateSeoScore = () => {
        let score = 0
        if (formData.title.length >= 40 && formData.title.length <= 60) score += 20
        if (formData.metaTitle.length >= 50 && formData.metaTitle.length <= 60) score += 20
        if (formData.metaDesc.length >= 120 && formData.metaDesc.length <= 160) score += 20
        if (formData.content.length > 2000) score += 20
        if (formData.coverImage || formData.coverVideo) score += 10
        if (formData.excerpt.length > 100) score += 10
        setSeoScore(score)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            const method = editingId ? 'PATCH' : 'POST'
            const url = editingId ? `/api/admin/blogs/${editingId}` : '/api/admin/blogs'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...formData, seoScore })
            })
            if (res.ok) {
                const savedBlog = await res.json()
                setShowModal(false)
                fetchBlogs()
                resetForm()
                if (savedBlog?.published && savedBlog?.slug) {
                    window.open(`/blogs/${savedBlog.slug}`, '_blank')
                }
            } else {
                const err = await res.json()
                alert(err.message || err.error || 'Failed to save blog')
            }
        } catch (error) {
            console.error('Failed to save blog:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this blog post?')) return
        try {
            const token = localStorage.getItem('token')
            await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
            fetchBlogs()
        } catch (error) {
            console.error('Failed to delete blog:', error)
        }
    }

    const openEdit = (blog: any) => {
        setEditingId(blog.id)
        setFormData({
            title: blog.title || '',
            content: blog.content || '',
            excerpt: blog.excerpt || '',
            coverImage: blog.coverImage || '',
            coverVideo: blog.coverVideo || '',
            metaTitle: blog.metaTitle || '',
            metaDesc: blog.metaDesc || '',
            published: blog.published
        })
        setActiveTab('write')
        setShowModal(true)
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData({ title: '', content: '', excerpt: '', coverImage: '', coverVideo: '', metaTitle: '', metaDesc: '', published: false })
    }

    const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))

    const seoColor = seoScore > 70 ? 'text-emerald-600' : seoScore > 40 ? 'text-amber-600' : 'text-rose-500'
    const seoBg = seoScore > 70 ? 'bg-emerald-500' : seoScore > 40 ? 'bg-amber-500' : 'bg-rose-500'

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 pb-40">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Content <span className="text-blue-600 italic">Engine</span>
                    </h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">SEO Managed Blog & Publication Portal</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            className="pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-50 transition-all w-full sm:w-64 shadow-sm"
                            placeholder="Find Article..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { resetForm(); setActiveTab('write'); setShowModal(true) }}
                        className="bg-blue-600 text-white rounded-xl px-6 py-3 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4" /> Create Blog
                    </button>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scanning Archive...</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                        <FileText className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No articles found</p>
                    </div>
                ) : filteredBlogs.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-900/[0.03] transition-all group">
                        {blog.coverImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={blog.coverImage} alt={blog.title} className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        )}
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${blog.published ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                    {blog.published ? 'Published' : 'Draft'}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(blog)} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors"><Edit3 className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => handleDelete(blog.id)} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                </div>
                            </div>
                            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-tight line-clamp-2">{blog.title}</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
                                    <BarChart3 className="h-3 w-3" />
                                    <span className="text-[10px] font-black">{blog.seoScore || 0}%</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-600">
                                        {blog.author?.firstName?.[0] || 'A'}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{blog.author?.firstName} {blog.author?.lastName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {blog.published && blog.slug && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); window.open(`/blogs/${blog.slug}`, '_blank') }}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                            View Live <ArrowUpRight className="h-3 w-3" />
                                        </button>
                                    )}
                                    <Globe className={`h-4 w-4 ${blog.published ? 'text-emerald-500' : 'text-slate-200'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── EDITOR MODAL ─── */}
            {showModal && (
                <div className="fixed inset-0 z-[500] flex items-start justify-center p-4 pt-10">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-[1100px] bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/80 rounded-t-[2rem]">
                            <div className="flex items-center gap-4">
                                <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{editingId ? 'Edit Article' : 'New Article'}</h2>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Blog Post Editor</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* SEO score pill */}
                                <div className="hidden lg:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">SEO:</span>
                                    <span className={`text-[11px] font-black ${seoColor}`}>{seoScore}%</span>
                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${seoBg} transition-all duration-500`} style={{ width: `${seoScore}%` }} />
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Article Title - Always visible */}
                        <div className="px-8 pt-6 flex-shrink-0">
                            <input
                                required
                                className="w-full text-2xl font-black text-slate-900 border-0 border-b-2 border-slate-100 focus:border-blue-400 pb-3 outline-none placeholder:text-slate-300 bg-transparent transition-colors"
                                placeholder="Article Title..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <div className="flex items-center gap-3 mt-1.5">
                                <p className={`text-[9px] font-bold uppercase tracking-widest ${formData.title.length >= 40 && formData.title.length <= 60 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {formData.title.length} / 60 chars
                                </p>
                                {formData.title.length >= 40 && formData.title.length <= 60 && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 px-8 pt-4 flex-shrink-0">
                            {[
                                { id: 'write', label: '✏️ Write' },
                                { id: 'media', label: '🖼 Media' },
                                { id: 'seo', label: '🔍 SEO' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Scrollable body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 pb-8 pt-5 space-y-6">

                            {/* ── WRITE TAB ── */}
                            {activeTab === 'write' && (
                                <>
                                    <RichEditor
                                        value={formData.content}
                                        onChange={(html) => setFormData({ ...formData, content: html })}
                                    />
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Short Excerpt</label>
                                        <textarea
                                            rows={3}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                            placeholder="One-paragraph preview shown in listings..."
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── MEDIA TAB ── */}
                            {activeTab === 'media' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-blue-600" /> Cover Image
                                        </h3>
                                        <MediaUpload
                                            label="Cover Image"
                                            value={formData.coverImage}
                                            onChange={(url) => setFormData({ ...formData, coverImage: url })}
                                            accept="image/*"
                                            type="image"
                                        />
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                            <Video className="h-4 w-4 text-blue-600" /> Cover Video
                                        </h3>
                                        <MediaUpload
                                            label="Cover Video"
                                            value={formData.coverVideo}
                                            onChange={(url) => setFormData({ ...formData, coverVideo: url })}
                                            accept="video/*"
                                            type="video"
                                        />
                                        <p className="text-[9px] text-slate-400 font-medium italic">Paste a YouTube/Vimeo URL or upload an MP4. If both image and video are set, video takes priority.</p>
                                    </div>
                                </div>
                            )}

                            {/* ── SEO TAB ── */}
                            {activeTab === 'seo' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5">
                                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-blue-600" /> SEO Metadata
                                        </h3>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Meta Title (SERP Heading)</label>
                                            <input
                                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-[11px] font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                                                placeholder="SERP Title (50–60 chars)..."
                                                value={formData.metaTitle}
                                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                            />
                                            <p className={`text-[9px] font-black ${formData.metaTitle.length >= 50 && formData.metaTitle.length <= 60 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {formData.metaTitle.length} / 60
                                            </p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Meta Description (SERP Snippet)</label>
                                            <textarea
                                                rows={4}
                                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-[11px] font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                                                placeholder="SERP description (120–160 chars)..."
                                                value={formData.metaDesc}
                                                onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                                            />
                                            <p className={`text-[9px] font-black ${formData.metaDesc.length >= 120 && formData.metaDesc.length <= 160 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {formData.metaDesc.length} / 160
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className={`rounded-2xl p-6 border ${seoScore > 70 ? 'bg-emerald-50 border-emerald-100' : seoScore > 40 ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">SEO Score</h3>
                                                <span className={`text-3xl font-black ${seoColor}`}>{seoScore}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden mb-5">
                                                <div className={`h-full ${seoBg} transition-all duration-700`} style={{ width: `${seoScore}%` }} />
                                            </div>
                                            <div className="space-y-2.5">
                                                <SeoCheck label="Title length (40–60)" passed={formData.title.length >= 40 && formData.title.length <= 60} />
                                                <SeoCheck label="Meta title (50–60)" passed={formData.metaTitle.length >= 50 && formData.metaTitle.length <= 60} />
                                                <SeoCheck label="Meta description (120–160)" passed={formData.metaDesc.length >= 120 && formData.metaDesc.length <= 160} />
                                                <SeoCheck label="Content depth (>2000 chars)" passed={formData.content.length > 2000} />
                                                <SeoCheck label="Cover media set" passed={!!(formData.coverImage || formData.coverVideo)} />
                                                <SeoCheck label="Excerpt written" passed={formData.excerpt.length > 100} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Actions ── */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Visibility:</span>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, published: !formData.published })}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.published ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                                    >
                                        <div className={`w-8 h-4 rounded-full transition-all p-0.5 ${formData.published ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                            <div className={`h-3 w-3 bg-white rounded-full transition-all ${formData.published ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                        {formData.published ? 'Published' : 'Draft'}
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-8 py-3 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 active:scale-95"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                                        {editingId ? 'Update Article' : 'Publish Article'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function SeoCheck({ label, passed }: { label: string; passed: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
            {passed ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />}
        </div>
    )
}
