const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8888;

http.createServer( (request, response) => {
  switch(request.url){
    case '/play':
      console.log('Rock!');
      break;

    default:
      returnFile(request.url);
  }
}).listen(port);


function returnFile(url){
  let filePath = `.${url}`;
  if(filePath.endsWith('/')){
     filePath += 'index.html'
  }

  const fileExtension = path.extname(filePath).toLowerCase();
  console.log(fileExtension);
}
