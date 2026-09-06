"use client"
import { useState, useEffect } from 'react'

export default function OnboardingModal() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        try {
            if (!localStorage.getItem('nalanda_onboarded')) {
                setShow(true)
            }
        } catch {}
    }, [])

    function dismiss() {
        try { localStorage.setItem('nalanda_onboarded', '1') } catch {}
        setShow(false)
    }

    if (!show) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative rounded-2xl shadow-xl p-6 w-full max-w-xl mx-4" style={{ background: '#F0F0EC' }}>
                <button
                    onClick={dismiss}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none cursor-pointer"
                    aria-label="Close"
                >
                    ✕
                </button>
                <h2 className="font-display text-3xl mb-2 text-gray-900">Welcome to Nalanda</h2>
                <p className="font-sans text-sm text-gray-500 mb-4">Here's a quick look at what you can do:</p>
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/0pvSvrw-lXs?autoplay=1"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                </div>
                <button
                    onClick={dismiss}
                    className="mt-4 w-full py-2 rounded-xl border border-gray-300 font-sans text-sm text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors cursor-pointer"
                >
                    Get started
                </button>
            </div>
        </div>
    )
}
