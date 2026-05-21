document.addEventListener("mouseup", () => {
    const text = document.getSelection().toString();
    const checkBtn = document.getElementById("hBtn");
    if (checkBtn){
        checkBtn.remove();
    }

    if (text){
        const coord = document.getSelection().getRangeAt(0).getBoundingClientRect();
        
        const newBtn = document.createElement("button");
        newBtn.textContent = "Click Me";
        newBtn.type = "button";    
        newBtn.id = "hBtn";

        document.body.appendChild(newBtn);
        newBtn.style.position = "fixed";
        newBtn.style.left = `${coord.x + coord.width}px`;
        newBtn.style.top = `${coord.y - coord.height - 5}px`;
    }
})
