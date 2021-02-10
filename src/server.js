const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    let parsedData = {};
    try {
      parsedData = JSON.parse(data)
    } catch {
      console.log('Error to parse data:', data);
    }

    if (parsedData.auth === '228') {
      ws.send(JSON.stringify({ status: 'ok' }));
      ws.isAuth = true;
      return;
    }

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN && client.isAuth) {
        client.send(data);
      }
    })
  })
})

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`)
})