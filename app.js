let categories = JSON.parse(localStorage.getItem("categories")) || [
  {
    name:"Logic",
    colour:210,
    blocks:["controls_if","logic_compare"]
  },
  {
    name:"Math",
    colour:230,
    blocks:["math_number","math_arithmetic"]
  }
];

let workspace;

function buildToolbox(){
  let xml = "<xml>";

  categories.forEach(cat=>{
    xml += `<category name="${cat.name}" colour="${cat.colour}">`;

    cat.blocks.forEach(b=>{
      xml += `<block type="${b}"></block>`;
    });

    xml += "</category>";
  });

  xml += "</xml>";
  return xml;
}

function init(){
  workspace = Blockly.inject('blocklyDiv',{
    toolbox: buildToolbox(),
    trashcan:true,
    scrollbars:true
  });

  const saved = localStorage.getItem("workspace");
  if(saved){
    Blockly.Xml.domToWorkspace(
      Blockly.Xml.textToDom(saved),
      workspace
    );
  }

  workspace.addChangeListener(saveWorkspace);
}

function saveWorkspace(){
  const xml = Blockly.Xml.workspaceToDom(workspace);
  localStorage.setItem(
    "workspace",
    Blockly.Xml.domToText(xml)
  );
  localStorage.setItem(
    "categories",
    JSON.stringify(categories)
  );
}

function refresh(){
  workspace.updateToolbox(buildToolbox());
  saveWorkspace();
}

function addCategory(){
  const name = document.getElementById("catName").value;
  const colour = document.getElementById("catColor").value || 180;
  if(!name) return;

  categories.push({
    name:name,
    colour:colour,
    blocks:[]
  });

  refresh();
}

function addBlock(){
  const type = document.getElementById("blockType").value;
  const text = document.getElementById("blockText").value;
  if(!type || !text) return;

  Blockly.defineBlocksWithJsonArray([{
    type:type,
    message0:text,
    args0:[{
      type:"field_input",
      name:"TEXT",
      text:"Hallo"
    }],
    previousStatement:null,
    nextStatement:null,
    colour:160
  }]);

  categories[categories.length-1].blocks.push(type);
  refresh();
}

function clearSave(){
  localStorage.clear();
  location.reload();
}

window.addEventListener("load", init);
