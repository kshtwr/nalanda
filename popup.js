document.getElementById('signInBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' })
})
