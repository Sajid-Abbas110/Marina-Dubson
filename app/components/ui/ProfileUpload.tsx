'use client'

import React, { useState, useRef } from 'react'
import { Camera, Loader2, User, X } from 'lucide-react'

interface ProfileUploadProps {
    currentImage?: string
    onUploadComplete: (url: string) => void
    label?: string
}

export default function ProfileUpload({ currentImage, onUploadComplete, label = "Profile Picture" }: ProfileUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(currentImage)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Set local preview immediately
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to server
        setUploading(true)
        try {
            const base64 = await toBase64(file)
            const res = await fetch('/api/upload/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64, name: file.name })
            })

            const data = await res.json()
            if (data.url) {
                onUploadComplete(data.url)
            }
        } catch (error) {
            console.error('Upload failed:', error)
        } finally {
            setUploading(false)
        }
    }

    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = error => reject(error)
        })
    }

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2 flex items-center gap-2">
                <Camera className="h-3 w-3" /> {label}
            </label>

            <div className="flex items-center gap-6 p-4 rounded-[2rem] bg-muted/30 border border-border group transition-all hover:border-primary/30">
                <div className="relative h-20 w-20 rounded-[1.5rem] overflow-hidden bg-muted border border-border flex items-center justify-center group-hover:shadow-lg transition-all">
                    {preview ? (
                        <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-10 w-10 text-muted-foreground/40" />
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <p className="text-[11px] font-bold text-foreground">Upload your bio-metric signature</p>
                    <p className="text-[9px] text-muted-foreground leading-relaxed">PNG, JPG or WebP up to 5MB. Recommend 400x400px.</p>

                    <div className="flex items-center gap-4 pt-1">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.05] transition-all"
                        >
                            {preview ? 'Update Biometrics' : 'Select Source'}
                        </button>
                        {preview && (
                            <button
                                type="button"
                                onClick={() => { setPreview(''); onUploadComplete('') }}
                                className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all"
                            >
                                Purge
                            </button>
                        )}
                    </div>
                </div>

                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}
