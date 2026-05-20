/*document.addEventListener("selectionchange", () => { 
    console.log(document.getSelection());
})*/

document.onselectionchange = () => {
    console.log(document.getSelection());
  };
  
console.log("extension check!")