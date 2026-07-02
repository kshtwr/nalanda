chrome.runtime.onMessageExternal.addListener((message) => {
    if (message.type === 'supabaseSession') {
        chrome.storage.local.set({ session: message.session })
        console.log('session stored:', message.session.user.email)
    } else if (message.type === 'clearSession') {
        chrome.storage.local.remove('session') 
    }
})
