const SUPABASE_URL = 'https://mvuafuijosnsgtglomfx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YOoDS5GlFfbfJgmRGUIEqQ_bFXpi0o_'

const { createClient } = supabase
const hDB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const DASHBOARD_URL = 'https://nalanda-highlights.vercel.app'

const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css'
document.head.appendChild(link)

let hideTimeout = null;

document.addEventListener("mouseup", () => {
    const selection = document.getSelection();
    const text = selection.toString();
    const cleanText = text.replace(/\u00a0/g, ' ').replace(/\[\d+\]/g, '').trim();
    const checkBtn = document.getElementById("hBtn");
    if (checkBtn){
        checkBtn.remove();
    }

    if (!text){return}

    const range = selection.getRangeAt(0)
    const coord = range.getBoundingClientRect();
    const nodeText = range.startContainer.textContent
    const prefix = nodeText.slice(Math.max(0, range.startOffset - 50), range.startOffset)
    const suffix = nodeText.slice(range.endOffset, range.endOffset + 50)

    if ((selection.anchorNode.parentElement.tagName == "INPUT") ||
        (selection.anchorNode.parentElement.tagName == "TEXTAREA") ||  
        (selection.anchorNode.parentElement.isContentEditable)){
            return;
    }

    const newBtn = document.createElement("button");
    newBtn.innerHTML= '<i class="bi bi-highlighter"></i>';
    newBtn.type = "button";    
    newBtn.id = "hBtn";

    document.body.appendChild(newBtn);
    newBtn.style.position = "fixed";
    newBtn.style.left = `${coord.x + coord.width}px`;
    newBtn.style.top = `${coord.top - 30}px`;
    

    newBtn.addEventListener("click", async (event) => {
        console.log('clicked')
        const result = await chrome.storage.local.get('session')
        const session = result.session
        if (session) await hDB.auth.setSession(session)
        const { data, error } = await hDB.from('highlights').insert({ content: cleanText, source_url: window.location.href, prefix: prefix, suffix: suffix}).select('id').single()
        if (error) { console.error(error)} else {markText(data.id, cleanText);}
        
        selection.removeAllRanges();
        document.getElementById("hBtn").remove();
        
        
    });

    newBtn.addEventListener("mouseup", (event) => {
        event.stopPropagation();
    });
    
});

document.addEventListener("keydown", (event) =>{
    const isShortcut = (event.altKey && (event.code=="KeyH")); 
    const isEscape = event.code=="Escape";
    
    if (isShortcut){
        document.getElementById('hBtn')?.click();
    } else if (isEscape){
        event.stopPropagation();
        document.getSelection().removeAllRanges();
        document.getElementById("hBtn")?.remove();
    }

}); 

function markText(id, content){
    if (!content){return}

        content = content.replace(/\s+/g, ' ').trim()
        const escaped = content.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const pattern = new RegExp(escaped.replace(/\s+/g, '(\\s|\\[\\d+\\])+'), 'gi')
        const instance = new Mark(document.body)
        instance.markRegExp(pattern, {
            acrossElements: true,
            noMatch: (term) => {
                console.log('no match:', JSON.stringify(term.toString().slice(0, 100)))
            },
            className:`highlight-${id}`,
            each:(element)=>{
                element.addEventListener("mouseenter", (e) => {
                    e.target.style.backgroundColor = "#ffcc00"; 
                    const hoverDiv = document.createElement("div");
                    const hoverBtn = document.createElement("button");
                    const delBtn = document.createElement("button");

                    hoverBtn.addEventListener('click',(e)=>{
                        url = `${DASHBOARD_URL}/?id=${id}`
                        window.open(url,'_blank');
                    })

                    delBtn.addEventListener('click',async (e)=>{                        
                        await hDB.from('highlights').delete().eq('id', id)
                        new Mark(document.body).unmark({className:`highlight-${id}`});
                        
                    })
                    delBtn.addEventListener('mouseenter', (e)=>{                        
                        delBtn.style.color = 'red';
                    })
                    delBtn.addEventListener('mouseleave', (e)=>{                        
                        delBtn.style.color = '';
                    })

                    hoverDiv.appendChild(hoverBtn);
                    hoverDiv.appendChild(delBtn);
                    hoverDiv.id = "hoverDiv";

                    hoverBtn.innerHTML = '<i class="bi bi-arrow-up-right"></i>';
                    hoverBtn.type = "button";    
                    delBtn.innerHTML = '<i class="bi bi-trash"></i>';
                    delBtn.type = "button";   

                    const coord = element.getBoundingClientRect();

                    document.body.appendChild(hoverDiv);
                    hoverDiv.addEventListener("mouseenter", (e) =>{
                        clearTimeout(hideTimeout);
                    })
                    hoverDiv.addEventListener("mouseleave", (e) =>{
                        document.getElementById("hoverDiv")?.remove();
                    })
                    hoverDiv.style.position = "fixed";
                    hoverDiv.style.left = `${coord.x + coord.width}px`;
                    hoverDiv.style.top = `${coord.top - 30}px`;
                    
                });

                element.addEventListener("mouseleave", (e) => {
                    e.target.style.backgroundColor = ""; // Resets to original highlight color
                    hideTimeout = setTimeout(() => {
                        document.getElementById("hoverDiv")?.remove();
                    }, 300);
                    
                });
            }
        })
    
}

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

rehighlight()

