const { O_DIRECT } = require("constants");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const {calcBasic, checkArgsFromBodyToCalcBase, checkOperatorFromString, splitValuesFromString} = require("./calcBasicPuc")

const app = express();

// Middleware para json no POST via HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// para logar a requisição
app.use((req, res, next) => {
    console.log("Recebi uma requisição no endpoint: ", req.url, "do tipo: ", req.method);
    next()
})
// Publica arquivos staticos.
app.use(express.static(__dirname + '/static'))

// Entrega arquivo index.html
app.get('/', function(req, res){
    console.log(__dirname)
    // save html files in the `views` folder..
    res.sendFile(path.join(__dirname, "index.html"));
});


app.post('/', (req, res) => {

    if (req.body != {}) {
      // Verificar se body contem argumentos necessários
       if(checkArgsFromBodyToCalcBase(req.body)) {

          const operator = req.body.operator;
          const firstNumber = parseFloat(req.body.firstNumber);
          const secondNumber = parseFloat(req.body.secondNumber);
          // As validações como operatordor válidos e números são feitos dentros da própria função calcBasic.
          let result = calcBasic(operator, firstNumber, secondNumber);

          res.send({
                  "resposta" : result
                });

        } else {
          res.status(400);
          res.send("Argumentos necessários: Operator, firstNumber e secondNumber");
        };

    } else {
      res.status(400);
      res.send("Requisição sem body.");
    }
});


//Inicializa um servidor HTTP orquestrado pelo express
const server = http.createServer(app);

//Inicializa um instancia de servidor websocket a partir do servidor http
const wss = new WebSocket.Server({ server });

// Função responsável por manusear a conexão websocket
wss.on("connection", (ws) => {
  // Função que trata as mensagens recebidas pelo servidor
  ws.on("message", (message) => {
    console.log("Mensagem recebida: ", message);
    let result;

    // remove caracteres especiais básicos.
    message = message.replace(/[\s, \., \t, \r, \n]/g, '');

    // Verifica se um dos operadores válidos para operação está presente na mensagem.
    if (checkOperatorFromString(message)) {
      // realiza o split dos operador e valores, armazena em um diconário.
      let values = splitValuesFromString(message);
      result = "Resultado: " + calcBasic(values["operator"], values["firstNumber"], values["secondNumber"]);
    } else {
      result = "Para realizar operações matemáticas básicas, é necessário informar um operador válido: '+, -, /, *, entre dois números.\n\
                Informe somente um operador, mais que um não será calculado."
    };

    ws.send(result);

  });
});

//Inicia o servidor
server.listen(process.env.PORT || 9898, () => {
  console.log("Servidor conectado na porta:", server.address().port);
});
