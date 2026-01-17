function generateLua(input: Array<any>, indentation: number = 0): string {
  let code = "";
  for (let i = 0; i < input.length; i++) {
    let obj = input[i];
    code += " ".repeat(indentation);
    // comment logic
    if (obj[0] === "comment") {
      code += `-- ${obj[1]}\n`;
    }
    // block logic (it's the comment logic but different)
    if (obj[0] === "bComment") {
      code += `-- ###${"=".repeat(obj[1].length + 2)}###\n`;
      code += `-- ### ${obj[1]} ###\n`;
      code += `-- ###${"=".repeat(obj[1].length + 2)}###\n`;
    }
    // gap logic
    if (obj[0] === "gap") {
      code += `\n`;
    }
    // if logic
    if (obj[0] === "if") {
      code += `if ${obj[1]} then\n`;
      code += `${generateLua(obj[2], indentation + 2)}`;
      code += `end\n`;
    }
    // forDo logic
    if (obj[0] === "forDo") {
      code += `for ${obj[1]} do\n`;
      code += `${generateLua(obj[2], indentation + 2)}`;
      code += `end\n`;
    }
    // unkFunc logic
    if (obj[0] === "unkFunc") {
      code += `${obj[1]}\n`;
    }
    // back2menu logic
    if (obj[0] === "backToMenu") {
      code += `backToSongWheel("${obj[1]}")\n`;
    }
    // returnVoid logic
    if (obj[0] === "returnVoid") {
      code += `return\n`;
    }
    // ease logic
    if (obj[0] === "ease") {
      code += `ease {${obj[1][0]}, ${obj[1][1]}, ${obj[2]}, `;
      for (let j = 0; j < obj[3].length; j++) {
        let easeObj = obj[3][j];
        code +=
          `${easeObj[0]}, "${easeObj[1]}"` +
          (j < obj[3].length - 1 ? ", " : "");
      }
      code += `}\n`;
    }
    // add logic
    if (obj[0] === "add") {
      code += `add {${obj[1][0]}, ${obj[1][1]}, ${obj[2]}, `;
      for (let j = 0; j < obj[3].length; j++) {
        let addObj = obj[3][j];
        code +=
          `${addObj[0]}, "${addObj[1]}"` + (j < obj[3].length - 1 ? ", " : "");
      }
      code += `}\n`;
    }
    // set logic
    if (obj[0] === "set") {
      code += `set {${obj[1]}, `;
      for (let j = 0; j < obj[2].length; j++) {
        let setObj = obj[2][j];
        code +=
          `${setObj[0]}, "${setObj[1]}"` + (j < obj[2].length - 1 ? ", " : "");
      }
      code += `}\n`;
    }
    // setDefault logic
    if (obj[0] === "setDefault") {
      code += `setDefault {`;
      for (let j = 0; j < obj[1].length; j++) {
        let defObj = obj[1][j];
        code +=
          `${defObj[0]}, "${defObj[1]}"` + (j < obj[1].length - 1 ? ", " : "");
      }
      code += `}\n`;
    }
    // reset logic
    if (obj[0] === "reset") {
      code += `reset {${obj[1][0]}, ${obj[1][1]}, ${obj[2]}`;
      if (obj[3]) {
        code += `, exclude = {`;
        for (let j = 0; j < obj[3].length; j++) {
          code += `"${obj[3][j]}"` + (j < obj[3].length - 1 ? ", " : "");
        }
        code += `}`;
      }
      code += `}\n`;
    }
  }
  return code;
}

// TODO: Add splines and UI

const objects: Array<any> = [
  // All should follow thy structure below
  ["bComment", "Playur thingis"],
  [
    "if",
    "not P1 or not P2",
    [["backToMenu", "Two players required"], ["returnVoid"]],
  ],
  [
    "forDo",
    "pn = 1, 2",
    [
      ["unkFunc", "setupJudgeProxy(PJ[pn], P[pn]:GetChild('Judgement'), pn)"],
      ["unkFunc", "setupJudgeProxy(PC[pn], P[pn]:GetChild('Combo'), pn)"],
    ],
  ],
  [
    "forDo",
    "pn = 1, #PP",
    [
      ["unkFunc", "PP[pn]:SetTarget(P[pn])"],
      ["unkFunc", "P[pn]:hidden(1)"],
    ],
  ],
  ["gap"],
  ["bComment", "My cool modchart!"],
  [
    "setDefault",
    [
      [1.5, "xmod"],
      [30, "Boost"],
    ],
  ],
  [
    "ease",
    [2, 2],
    "linear",
    [
      [100, "Drunk"],
      [-50, "Tornado"],
    ],
  ],
  ["gap"],
  ["comment", "yo how's it going?"],
  ["ease", [4, 3], "linear", [[0, "Drunk"]]],
  [
    "ease",
    [7, 4],
    "linear",
    [
      [100, "Drunk"],
      [30, "Tornado"],
    ],
  ],
  [
    "ease",
    [11, 5],
    "linear",
    [
      [-20, "Drunk"],
      [0, "Tornado"],
    ],
  ],
  ["add", [16, 2], "linear", [[20, "Drunk"]]],
  ["set", 20, [[-40, "Tornado"]]],
  ["reset", [25, 3], "linear", ["Drink", "xmod"]],
];

console.log(generateLua(objects));

/* Expected Output:
-- ###================###
-- ### Playur thingis ###
-- ###================###
if not P1 or not P2 then
  backToSongWheel("Two players required")
  return
end
for pn = 1, 2 do
  setupJudgeProxy(PJ[pn], P[pn]:GetChild('Judgement'), pn)
  setupJudgeProxy(PC[pn], P[pn]:GetChild('Combo'), pn)
end
for pn = 1, #PP do
  PP[pn]:SetTarget(P[pn])
  P[pn]:hidden(1)
end

-- ###===================###
-- ### My cool modchart! ###
-- ###===================###
setDefault {1.5, "xmod", 30, "Boost"}
ease {2, 2, linear, 100, "Drunk", -50, "Tornado"}

-- yo how's it going?
ease {4, 3, linear, 0, "Drunk"}
ease {7, 4, linear, 100, "Drunk", 30, "Tornado"}
ease {11, 5, linear, -20, "Drunk", 0, "Tornado"}
add {16, 2, linear, 20, "Drunk"}
set {20, -40, "Tornado"}
reset {25, 3, linear, exclude = {"Drunk"}
*/
