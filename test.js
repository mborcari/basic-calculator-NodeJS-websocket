var assert = require('assert');

// Testes automatizados das funções
const {calcBasic} = require("./websocket_server/calcBasicPuc");

const testSum1 = calcBasic("+", 1, 1);
const testSum2 = calcBasic("+", -123, 123123);
const testMult1 = calcBasic("*", 8, 0);
const testMult2 = calcBasic("*", 1239123, 12313);
const testDiv1 = calcBasic("/", 123, -12);
const testDiv2 = calcBasic("/", 313123, -0);


assert(testSum1 === 2, "Resultado igual a 2");
assert(testSum2 === 123000, "Resultado igual a 123000");
assert(testMult1 === 0, "Resultado igual a 0");
assert(testMult2 === 15257321499, "Resultado igual a 15257321499");
assert(testDiv1 === -10.25, "Resultado igual a -10.25");
assert(testDiv2 === "Não é possível dividir um número por zero",
        "Resultado igual a 'Não é possível dividir um número por zero'");

console.log("Testes realizados com sucesso");