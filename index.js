function generateLua(input, indentation) {
    if (indentation === void 0) { indentation = 0; }
    var code = "";
    for (var i = 0; i < input.length; i++) {
        var obj = input[i];
        code += " ".repeat(indentation);
        // comment logic
        if (obj[0] === "comment") {
            code += "-- ".concat(obj[1], "\n");
        }
        // block logic (it's the comment logic but different)
        if (obj[0] === "bComment") {
            code += "-- ###".concat("=".repeat(obj[1].length + 2), "###\n");
            code += "-- ### ".concat(obj[1], " ###\n");
            code += "-- ###".concat("=".repeat(obj[1].length + 2), "###\n");
        }
        // gap logic
        if (obj[0] === "gap") {
            code += "\n";
        }
        // if logic
        if (obj[0] === "if") {
            code += "if ".concat(obj[1], " then\n");
            code += "".concat(generateLua(obj[2], indentation + 2));
            code += "end\n";
        }
        // forDo logic
        if (obj[0] === "forDo") {
            code += "for ".concat(obj[1], " do\n");
            code += "".concat(generateLua(obj[2], indentation + 2));
            code += "end\n";
        }
        // unkFunc logic
        if (obj[0] === "unkFunc") {
            code += "".concat(obj[1], "\n");
        }
        // back2menu logic
        if (obj[0] === "backToMenu") {
            code += "backToSongWheel(\"".concat(obj[1], "\")\n");
        }
        // returnVoid logic
        if (obj[0] === "returnVoid") {
            code += "return\n";
        }
        // ease logic
        if (obj[0] === "ease") {
            code += "ease {".concat(obj[1][0], ", ").concat(obj[1][1], ", ").concat(obj[2], ", ");
            for (var j = 0; j < obj[3].length; j++) {
                var easeObj = obj[3][j];
                code +=
                    "".concat(easeObj[0], ", \"").concat(easeObj[1], "\"") +
                        (j < obj[3].length - 1 ? ", " : "");
            }
            code += "}\n";
        }
        // add logic
        if (obj[0] === "add") {
            code += "add {".concat(obj[1][0], ", ").concat(obj[1][1], ", ").concat(obj[2], ", ");
            for (var j = 0; j < obj[3].length; j++) {
                var addObj = obj[3][j];
                code +=
                    "".concat(addObj[0], ", \"").concat(addObj[1], "\"") + (j < obj[3].length - 1 ? ", " : "");
            }
            code += "}\n";
        }
        // set logic
        if (obj[0] === "set") {
            code += "set {".concat(obj[1], ", ");
            for (var j = 0; j < obj[2].length; j++) {
                var setObj = obj[2][j];
                code +=
                    "".concat(setObj[0], ", \"").concat(setObj[1], "\"") + (j < obj[2].length - 1 ? ", " : "");
            }
            code += "}\n";
        }
        // setDefault logic
        if (obj[0] === "setDefault") {
            code += "setDefault {";
            for (var j = 0; j < obj[1].length; j++) {
                var defObj = obj[1][j];
                code +=
                    "".concat(defObj[0], ", \"").concat(defObj[1], "\"") + (j < obj[1].length - 1 ? ", " : "");
            }
            code += "}\n";
        }
        // reset logic
        if (obj[0] === "reset") {
            code += "reset {".concat(obj[1][0], ", ").concat(obj[1][1], ", ").concat(obj[2]);
            if (obj[3]) {
                code += ", exclude = {";
                for (var j = 0; j < obj[3].length; j++) {
                    code += "\"".concat(obj[3][j], "\"") + (j < obj[3].length - 1 ? ", " : "");
                }
                code += "}";
            }
            code += "}\n";
        }
    }
    return code;
}
var objects = [
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
