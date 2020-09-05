//
// Tratamento de Eventos WEBSockets no Servidor.
//
const express = require('express');
const app = express();
const path = require('path');
//
// Criando uma Conexão (servidor) HTTP e a expondo numa instância Express.
//
const http = require('http').createServer(app);
//
// Fazendo um Handshake (HTTP Atualização) na conexão (servidor) http criado anteriormente.
// Ou seja, promovendo-a para uma Websockets/wss.
//
const io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//
// Um Cliente conecta-se a um Servidor. Um Servidor conecta-se a N Clientes.
// Cada pedido de Conexão ao Servidor, ele gera, se aceitar a Conexão, um ID.
// ${socket.id} indica o ID gerado para a Conexão do Cliente.
// .on fica escutando o recebimento de um evento, no caso abaixo, o evento a tratar 
// é uma conexão http no Servidor Websocket, já promovido anteriormente.
//
var usuarios = 0;
//
io.on('connection', (socket) => {
    // 
    // Contando Clientes Conectados.
    //
    usuarios++;
    //
    socket.broadcast.emit('usuarioConetado', { quantidade: 'Um Usuário se Conectou. Total de Conectados: ' + usuarios});
    //
    socket.on('disconnect', function () {
        usuarios--;
        socket.broadcast.emit('usuarioConetado', { quantidade: 'Um Usuário se Desconectou. Total de Conectados: ' + usuarios});
        console.log(`Um Usuário Desconectado. Total de Conectados: ${usuarios}.`);
    });
    //
    //  Avisando a Console do Servidor quantos usuários conectados.
    //
    console.log(`Um Usuário Conectado. Total de Conectados: ${usuarios}.`);
    //
    // Identificando o Usuário com o ID da Sessão.
    //
    console.log(`Usuário Conectado com o Socket ID: ${socket.id}`);
    //
    // Emitindo mensagem do Servidor (String).
    //
    socket.emit('mensagemDoServidor', 'Bem-vindo à Página do Luciano Lima');
    //
    // Recebendo a Mensagem do Cliente (String).
    //
    socket.on('mensagemDoCliente', content => {
        console.log(`Mensagem do Cliente: ${content}`);
    })
    //
    // Recebendo a Mensagem do Cliente (Objeto).
    //
    socket.on('mensagemDoClienteObj', content => {
        console.log(`Mensagem do Cliente: ${JSON.stringify(content)}`);
    });
    //
    // Recebendo e Enviando em Broadcast mensagem recebida de um cliente
    //    
    socket.on('MSGCliente', content => {
        socket.broadcast.emit('grupoMSG', content);
    })
})
//
app.get('/', (req, res) => {
    res.render('index');
})
//
http.listen(3000, () => {
    console.log('Listening on port 3000');
})
