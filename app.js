let workspace;
let currentUser = null;
let categories = [];

function login(){
  const name = document.getElementById("username").value;
  if(!name) return;

  currentUser = name;

  categories = JSON.parse(localStorage.getItem("cats_"+name)) || [
    {
      name:"Logic",
      colour:210,
      blocks:["controls_if","logic_compare"]
    }
  ];

  initWorkspace();
}

function initWorkspace(){

  if(workspace) workspace.dispose();

  workspace = Blockly.inject('blocklyDiv',{
    toolbox: buildToolbox(),
    trashcan:true
  });

  const saved = localStorage.getItem("ws_"+currentUser);
  if(saved){
    Blockly.Xml.domToWorkspace(
      Blockly.Xml.textToDom(saved),
      workspace
    );
  }

  workspace.addChangeListener(saveAll);
}

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

function saveAll(){
  if(!currentUser) return;

  localStorage.setItem(
    "cats_"+currentUser,
    JSON.stringify(categories)
  );

  const xml = Blockly.Xml.workspaceToDom(workspace);
  localStorage.setItem(
    "ws_"+currentUser,
    Blockly.Xml.domToText(xml)
  );
}

function addCategory(){
  if(!currentUser) return alert("Erst Login!");

  const name = document.getElementById("catName").value;
  if(!name) return;

  categories.push({
    name:name,
    colour:180,
    blocks:[]
  });

  refresh();
}

function addBlock(){
  if(!currentUser) return alert("Erst Login!");

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

function refresh(){
  workspace.updateToolbox(buildToolbox());
  saveAll();
}

function resetAll(){
  localStorage.clear();
  location.reload();
}
