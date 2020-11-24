import http from 'http';
import fs from 'fs';
import path from 'path';
import Dice from './www/modules/dice.mjs';
const port = 8888;
const webroot = './www';

let mimeTypes = new Map();
mimeTypes.set('.html', 'text/html');
mimeTypes.set('.mjs', 'text/javascript');
mimeTypes.set('.json', 'application/json');
mimeTypes.set('.png', 'image/png');

const server = http.createServer( (request, response) => {
  switch(request.url){
    case '/play':
      handlePlayRequest(request, response);
      break;

    default:
      handleFileRequest(request, response);
  }
});

server.listen(port);
server.on('listening', (event) => { 
  console.log('Web Server is running:'); 
  console.log(`http://${server.address().address}:${server.address().port}`);
});


/**
 * Returns a file for a HTTP request
 */
function handleFileRequest(request, response){
  let filePath = webroot + request.url;
  if(filePath.endsWith('/')){
     filePath += 'index.html'
  }
  
  fs.readFile(filePath, (error, content) => {
    if(error){
      if(error.code === 'ENOENT'){
        response.writeHead(404);
        response.end('File not found');
      } else{
        response.writeHead(500);
        response.end(`Server error: ${error.code}`);
      }
    }else{
      const fileExtension = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes.get(fileExtension);
      response.writeHead(200, {'Content-Type': contentType});
      response.end(content);
    }
  });
}

/**
 * Returns a JSON object that contains 'Rock', 'Paper', or 'Scissors'
 */
function handlePlayRequest(request, response){
  const results = ['', 'rock', 'paper', 'scissors'];
  const dice = new Dice(3);
  const result = results[dice.roll()];

  let content = {
    play: result,
    player1: `/img/${result}-left.png`,
    player2: `/img/${result}-right.png`
  };
  const contentType = mimeTypes.get('.json');
  response.writeHead(200, {'Content-Type': contentType});
  response.end(JSON.stringify(content));
}
