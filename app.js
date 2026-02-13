let categories = [
  {
    name: "Start",
    colour: 210,
    blocks: ["controls_if", "logic_compare"]
  }
];

let workspace;

function buildToolbox() {
  let xml = "<xml>";

  categories.forEach(cat => {
    xml += `<category name="${cat.name}" colour="${cat.colour}">`;

    cat.blocks.forEach(block => {
      xml += `<block type="${block}"></block>`;
    });

    xml += "</category>";
  });

  xml += "</xml>";
  return xml;
}

function init() {
  workspace = Blockly.inject("blocklyDiv", {
    toolbox: buildToolbox(),
    trashcan: true
  });

  workspace.addChangeListener(saveWorkspace);

  loadWorkspace();
}

function refreshToolbox() {
  workspace.updateToolbox(buildToolbox());
  saveWorkspace();
}

function addCategory() {
  const name = document.getElementById("catName").value;
  const colour = document.getElementById("catColor").value || 180;

  if (!name) return;

  categories.push({
    name: name,
    colour: colour,
    blocks: []
  });

  refreshToolbox();
}

function addBlock() {
  const type = document.getElementById("blockType").value;
  const text = document.getElementById("blockText").value;

  if (!type || !text) return;

  Blockly.defineBlocksWithJsonArray([
    {
      type: type,
      message0: text,
      args0: [
        {
          type: "field_input",
          name: "TEXT",
          text: "Hallo"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160
    }
  ]);

  categories[categories.length - 1].blocks.push(type);

  refreshToolbox();
}

function saveWorkspace() {
  const xml = Blockly.Xml.workspaceToDom(workspace);
  const text = Blockly.Xml.domToText(xml);
  localStorage.setItem("workspace", text);
  localStorage.setItem("categories", JSON.stringify(categories));
}

function loadWorkspace() {
  const savedWs = localStorage.getItem("workspace");
  const savedCats = localStorage.getItem("categories");

  if (savedCats) {
    categories = JSON.parse(savedCats);
  }

  if (savedWs) {
    const xml = Blockly.Xml.textToDom(savedWs);
    Blockly.Xml.domToWorkspace(xml, workspace);
  }

  refreshToolbox();
}

window.addEventListener("load", init);
