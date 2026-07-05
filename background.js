chrome.runtime.onMessageExternal.addListener((message) => {
    if (message.type === 'supabaseSession') {
        chrome.storage.local.set({ session: message.session })
    } else if (message.type === 'clearSession') {
        chrome.storage.local.remove('session') 
    }
})
