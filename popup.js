const SUPABASE_URL = 'https://mvuafuijosnsgtglomfx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YOoDS5GlFfbfJgmRGUIEqQ_bFXpi0o_'

const { createClient } = supabase;
const hDB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function popupDisplay(){
    const result = await chrome.storage.local.get('session')
    if (result.session) await hDB.auth.setSession(result.session)

    const { data, error } = await hDB.from('highlights').select('id, content, source_url').order('created_at', { ascending: false }).limit(5)

    if (error || !data || data.length == 0) return;

    data.forEach(highlight => {

    })
}    

document.getElementById('signInBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://nalanda-highlights.vercel.app' })
})

popupDisplay();
