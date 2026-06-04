const SUPABASE_URL = 'https://mvuafuijosnsgtglomfx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YOoDS5GlFfbfJgmRGUIEqQ_bFXpi0o_'

const { createClient } = supabase
const hDB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.addEventListener("mouseup", () => {
    const text = document.getSelection().toString();
    const cleanText = text.replace(/\u00a0/g, ' ').replace(/\[\d+\]/g, '').trim();
    const checkBtn = document.getElementById("hBtn");
    if (checkBtn){
        checkBtn.remove();
    }

    if (!text){return}

    const range = document.getSelection().getRangeAt(0)
    const coord = range.getBoundingClientRect();
    const nodeText = range.startContainer.textContent
    const prefix = nodeText.slice(Math.max(0, range.startOffset - 50), range.startOffset)
    const suffix = nodeText.slice(range.endOffset, range.endOffset + 50)

    
    const newBtn = document.createElement("button");
    newBtn.textContent = "Click Me";
    newBtn.type = "button";    
    newBtn.id = "hBtn";

    document.body.appendChild(newBtn);
    newBtn.style.position = "fixed";
    newBtn.style.left = `${coord.x + coord.width}px`;
    newBtn.style.top = `${coord.y - coord.height - 5}px`;

    newBtn.addEventListener("click", async (event) => {
        console.log('clicked')
        const { error } = await hDB.from('highlights').insert({ content: cleanText, source_url: window.location.href, prefix: prefix, suffix: suffix})
        if (error) console.error(error)
    });

    newBtn.addEventListener("mouseup", (event) => {
        event.stopPropagation();
    });
    
})

async function rehighlight(){

    const { data, error } = await hDB
    .from('highlights')
    .select('content')
    .eq('source_url', window.location.href)

    if (error || !data || data.length == 0) return;

    data.forEach(highlight => {
        if (!highlight.content){return}

        highlight.content = highlight.content.replace(/\s+/g, ' ').trim()
        const escaped = highlight.content.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const pattern = new RegExp(escaped.replace(/\s+/g, '(\\s|\\[\\d+\\])+'), 'gi')
        const instance = new Mark(document.body)
        instance.markRegExp(pattern, {
            acrossElements: true,
            noMatch: (term) => {
                console.log('no match:', JSON.stringify(term.toString().slice(0, 100)))
            }
        })
    })
}


    

rehighlight()