let workspace;

const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Text",
      colour: 210,
      contents: [
        {
          kind: "block",
          type: "text_block"
        }
      ]
    }
  ]
};

Blockly.Blocks["text_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Text")
      .appendField(new Blockly.FieldTextInput("Hallo"), "TEXT");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
  }
};

workspace = Blockly.inject("blocklyDiv", { toolbox });

workspace.addChangeListener(() => {
  const blocks = workspace.getAllBlocks(false);
  let result = "";

  blocks.forEach(b => {
    if (b.getFieldValue("TEXT"))
      result += b.getFieldValue("TEXT") + " ";
  });

  document.getElementById("preview").value = result.trim();
});

// 🌙 Theme System
document.getElementById("themeSelect").addEventListener("change", (e) => {
  const theme = e.target.value;

  if (theme === "dark") {
    document.body.style.background = "#1e1e1e";
    document.body.style.color = "white";
  }

  if (theme === "light") {
    document.body.style.background = "#f2f2f2";
    document.body.style.color = "black";
  }

  if (theme === "neon") {
    document.body.style.background = "#000000";
    document.body.style.color = "#00ffcc";
  }

  localStorage.setItem("theme", theme);
});

// Theme laden
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.getElementById("themeSelect").value = savedTheme;
  document.getElementById("themeSelect").dispatchEvent(new Event("change"));
}