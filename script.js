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

    const coord = document.getSelection().getRangeAt(0).getBoundingClientRect();
    
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
        const { error } = await hDB.from('highlights').insert({ content: text, source_url: window.location.href})
        if (error) console.error(error)
    });
    
})
