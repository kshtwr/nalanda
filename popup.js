document.getElementById('signInBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://nalanda-highlights.vercel.app' })
})

async function rehighlight(){
    const result = await chrome.storage.local.get('session')
    if (result.session) await hDB.auth.setSession(result.session)
    const pageUrl = new URL(window.location.href)
    pageUrl.searchParams.delete('nalanda_id')
    const cleanUrl = pageUrl.toString()


    const { data, error } = await hDB
    .from('highlights')
    .select('id,content')
    .eq('source_url', cleanUrl)

    if (error || !data || data.length == 0) return;

    data.forEach(highlight => {
        markText(highlight.id, highlight.content);
    })
    const id = new URLSearchParams(window.location.search).get('nalanda_id')
    const target = document.querySelector(`.highlight-${id}`)
    target?.scrollIntoView({behavior:'smooth', block:'center'})
    target.style.transition = 'background-color 1s'
    target.style.backgroundColor = 'orange'
    setTimeout(() => { target.style.backgroundColor = '' }, 1000)
}    