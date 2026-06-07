document.getElementById('signInBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage('signIn')
})
