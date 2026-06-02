const SUPABASE_URL = 'https://mvuafuijosnsgtglomfx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_YOoDS5GlFfbfJgmRGUIEqQ_bFXpi0o_'

const { createClient } = supabase
const hDB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.addEventListener("mouseup", () => {
    const text = document.getSelection().toString();
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
        const { error } = await hDB.from('highlights').insert({ content: text, source_url: window.location.href, prefix: prefix, suffix: suffix})
        if (error) console.error(error)
    });

    newBtn.addEventListener("mouseup", (event) => {
        event.stopPropagation();
    });
    
})

async function rehighlight(){

    const { data, error } = await hDB
    .from('highlights')
    .select('content, prefix, suffix')
    .eq('source_url', window.location.href)

    if (data.length == 0){
        return;
    } else {

        data.forEach(highlight => {

            if (document.body.includes((highlight.prefix + highlight.content + highlight.suffix))){
                const range = document.createRange();
                range.setStart()

                const treeWalker = document.createTreeWalker(
                    document.querySelector("body"),
                    NodeFilter.SHOW_TEXT,
                );

                while (treeWalker.nextNode()) {
                    const node = treeWalker.currentNode;
                    node.data = node.data.toUpperCase();
                }

                const mark = document.createElement("mark");
                range.surroundContents(mark);
            }
        })

    }





}


    

rehighlight()