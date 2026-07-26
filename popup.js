const SUPABASE_URL = 'https://mvuafuijosnsgtglomfx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YOoDS5GlFfbfJgmRGUIEqQ_bFXpi0o_'

const { createClient } = supabase;
const hDB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let tabID= null;

async function popupDisplay(){
    const result = await chrome.storage.local.get('session')
    if (!result.session) {
        document.getElementById('signOutBtn').style.display = 'none'
        document.getElementById('dashboardBtn').style.display = 'none'
        document.getElementById('signInBtn').style.display = 'inline'
        return
    }
    await hDB.auth.setSession(result.session)
    document.getElementById('signOutBtn').style.display = 'inline'
    document.getElementById('dashboardBtn').style.display = 'inline'
    

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    tabID = tab.id;
    const pageUrl = new URL(tab.url)
    pageUrl.searchParams.delete('nalanda_id')
    const cleanUrl = pageUrl.toString()
        
    const { data, error } = await hDB.from('highlights').select('id, content, source_url').order('created_at', { ascending: false }).eq('source_url', cleanUrl)
    if (error || !data || data.length == 0){
        const card = document.createElement('p')
        card.innerText = "No highlights found on this page."
        document.body.appendChild(card)
        return
    };

    data.forEach(highlight => {
        const cardsContainer = document.getElementById('cardsContainer')
        const card = document.createElement('div')
        card.className = 'card'
        const cardText = document.createElement('p')
        cardText.className = 'card-text'
        cardText.textContent = highlight.content
        card.appendChild(cardText)
        cardsContainer.appendChild(card)

        card.addEventListener('click', () => {
            chrome.tabs.sendMessage(tabID, { type: 'scrollFlash', id: highlight.id })
        })
    })
    
}    

document.getElementById('signInBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://mynalanda.vercel.app' })
})

document.getElementById('signOutBtn').addEventListener('click', async() => {
    await chrome.storage.local.remove('session');
    await hDB.auth.signOut();
    chrome.tabs.sendMessage(tabID, { type: 'signOut'})
    window.close()
})

document.getElementById('dashboardBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://mynalanda.vercel.app' })
})


popupDisplay();
