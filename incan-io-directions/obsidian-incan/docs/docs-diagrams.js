
(async function(){
  const nodes=[...document.querySelectorAll('[data-diagram="mermaid"]')];
  if(!nodes.length)return;
  if(!window.mermaid){for(const node of nodes)node.dataset.renderState='unavailable';return;}
  await document.fonts.ready;
  window.mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'base',flowchart:{useMaxWidth:true,htmlLabels:false,curve:'basis'},themeVariables:{background:'#080c0a',primaryColor:'#13241b',primaryTextColor:'#f2f3ef',primaryBorderColor:'#a78b4d',secondaryColor:'#112522',tertiaryColor:'#162019',lineColor:'#83aaa0',edgeLabelBackground:'#080c0a',fontFamily:'Exo 2, sans-serif',fontSize:'14px'}});
  for(const node of nodes){
    try{await window.mermaid.run({nodes:[node],suppressErrors:false});node.dataset.renderState='ready';}
    catch(error){node.dataset.renderState='error';node.textContent='Diagram unavailable. The original source is available below.';console.error('Documentation diagram failed',error);}
  }
})();
