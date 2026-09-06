chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({ url: 'https://mynalanda.vercel.app' })
    }
})

chrome.runtime.onMessageExternal.addListener((message) => {
    if (message.type === 'supabaseSession') {
        chrome.storage.local.set({ session: message.session })
    } else if (message.type === 'clearSession') {
        chrome.storage.local.remove('session') 
    }
})
