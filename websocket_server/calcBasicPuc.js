function calcBasic(operator, firstNumber, secondNumber) {
    switch(operator) {
        case "+":
            return sumNumbers(firstNumber, secondNumber);
        case "-":
            return subNumbers(firstNumber, secondNumber);
        case "*":
            return multNumbers(firstNumber, secondNumber);
        case "/":
            return divNumbers(firstNumber, secondNumber);
        default:
            return "Favor informar somente uns dos operadores validos: '+', '-', '/', '*'"
    };
};


function checkArgsFromBodyToCalcBase(body) {
    // Para requisições http POST
    // Verifica se os argumentos estão presentes no body da requisição http.
    return  (body.operator && body.firstNumber && body.secondNumber);
  };


function removeStartSignalToTest(stringToCalc) {
    // remove possíveis sinais no inicio da string para demais validações
    let re_start_signal = /^[\+, \-, \*, \/]/g;
    return stringToCalc.replace(re_start_signal, "");
};


function checkOperatorRegex(stringToCalc) {
    // Retorna o resultado de uma máscara regex.
    // Identifica a primeira ocorrência.
    stringToCalc = removeStartSignalToTest(stringToCalc)
    let re = /[\+, \-, \*, \/]/g;
    return stringToCalc.search(re);
};


function checkSingleOperator(stringToCalc) {
    
    stringToCalc = removeStartSignalToTest(stringToCalc)

    // Resolve o problema de sinal negativo em um número no meio ou inicio do texto.
    let re_double_signal = /[\+, \-, \*, \/][\-]/g;
    let count_double_signal_re = stringToCalc.match(re_double_signal);
   
    let re = /[\+, \-, \*, \/]/g;
    let result_re =  stringToCalc.match(re);

    // Verifica se existe mais de um operator na string.
    if (count_double_signal_re) {
        return (!!result_re) ? result_re.length - 1 : 0;
    }
    else {
        return (!!result_re) ? result_re.length : 0;
    };
};


function checkOperatorFromString(operatorString) {
    // Para requisições websocket
    // Verifica se o operador está presente na string.
    // Retornar um boolean.
    return (checkOperatorRegex(operatorString) > -1 && checkSingleOperator(operatorString) == 1)
};


function splitValuesFromString(stringToCalc) {

    // Busca o operador e valores númericos de um string.
    // Para identificar
    let operator = removeStartSignalToTest(stringToCalc).charAt(checkOperatorRegex(stringToCalc));
    let result_split = stringToCalc.split(operator, 3);
    let result_final = {"operator" : operator, "firstNumber" : parseFloat(result_split[0]), "secondNumber" : parseFloat(result_split[1]) };
    return result_final;
};


function sumNumbers(firstNumber, secondNumber){
    // Addition two numbers
    if (checkArgsEqualNumber(firstNumber, secondNumber)){
        return  firstNumber + secondNumber;
    } else {
        return errorIsNotNumbers();
    };
};


function subNumbers(firstNumber, secondNumber){
    // Subtraction two numbers

    if (checkArgsEqualNumber(firstNumber, secondNumber)){
        return  firstNumber - secondNumber;
    } else {
        return errorIsNotNumbers();
    };
};


function multNumbers(firstNumber, secondNumber){
    //multiplication two nunbers
    if (checkArgsEqualNumber(firstNumber, secondNumber)){
        return  firstNumber * secondNumber;
    } else {
        return errorIsNotNumbers();
    };
};


function divNumbers(firstNumber, secondNumber){
    // division two numbers
    if (checkArgsEqualNumber(firstNumber, secondNumber)){
        return (checkArgsEnableDivision(secondNumber)) ? firstNumber / secondNumber : "Não é possível dividir um número por zero";
    } else {
        return errorIsNotNumbers();
    };
};


function checkArgsEqualNumber(firstNumber, secondNumber) {
   return  (!isNaN(firstNumber) && !isNaN(secondNumber));
};


function checkArgsEnableDivision(divisor) {
    return (divisor != 0);
};


function errorIsNotNumbers() {
    return "Favor informar somente números para a operação";
};


module.exports = {calcBasic, checkArgsFromBodyToCalcBase, checkOperatorFromString, splitValuesFromString};