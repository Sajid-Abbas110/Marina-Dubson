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
            } else {
                alert('Server failed to save the image. Resetting preview.')
                setPreview(currentImage)
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Upload protocol failed. Please check your connection.')
            setPreview(currentImage)
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
        <div className="relative">
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
            />

            {preview ? (
                <div className="relative group w-fit">
                    <div className="h-28 w-28 lg:h-32 lg:w-32 rounded-[2.5rem] overflow-hidden border-4 border-background shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                        <img src={preview} alt="Profile" className="h-full w-full object-cover" />

                        {uploading && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-20">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}

                        <div
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            className={`absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px] z-10 ${uploading ? 'cursor-not-allowed' : ''}`}
                        >
                            <div className="h-10 w-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <Camera className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Floating Accent */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-[3rem] blur-xl -z-10 group-hover:opacity-100 opacity-50 transition-opacity" />

                    {/* Delete button (Purge) */}
                    <button
                        type="button"
                        disabled={uploading}
                        onClick={() => { if (!uploading && confirm('Purge biometric data?')) { setPreview(''); onUploadComplete('') } }}
                        className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all z-30 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete Image"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`flex items-center gap-6 p-6 rounded-[2.5rem] bg-muted/30 border-2 border-dashed border-border group transition-all hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer max-w-md ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-muted border border-border flex items-center justify-center group-hover:shadow-lg transition-all shrink-0">
                        <User className="h-8 w-8 text-muted-foreground/40" />
                        {uploading && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="text-xs font-black text-foreground uppercase tracking-widest mb-1">{label}</p>
                        <p className="text-[10px] text-muted-foreground font-medium leading-tight">PNG, JPG or WebP up to 5MB.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
