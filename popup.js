const SUPABASE_URL = 'https://mvuafuijosnsgtglomfx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YOoDS5GlFfbfJgmRGUIEqQ_bFXpi0o_'

const { createClient } = supabase;
const hDB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function popupDisplay(){
    const result = await chrome.storage.local.get('session')
    if (!result.session) {
        document.getElementById('signInBtn').style.display = 'block'
        return
    }
    await hDB.auth.setSession(result.session)
    

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const pageUrl = new URL(tab.url)
    pageUrl.searchParams.delete('nalanda_id')
    const cleanUrl = pageUrl.toString()
        
    const { data, error } = await hDB.from('highlights').select('id, content, source_url').order('created_at', { ascending: false }).eq('source_url', cleanUrl)
    console.log(data, error)
    if (error || !data || data.length == 0){
        const card = document.createElement('p')
        card.innerText = "No highlights found."
        document.body.appendChild(card)
        return
    };

    data.forEach(highlight => {
        const card = document.createElement('div')
        card.className = 'card'
        card.textContent = highlight.content.length > 100 
            ? highlight.content.slice(0, 100) + '...' 
            : highlight.content
        document.body.appendChild(card)
    })
    
}    

document.getElementById('signInBtn').addEventListener('click', () => {
    //chrome.tabs.create({ url: 'https://nalanda-highlights.vercel.app' })
    chrome.tabs.create({ url: 'http://localhost:3000' })
})

popupDisplay();
