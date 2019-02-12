const static = require('node-static');
const path = require('path');
const file = new static.Server(path.resolve(__dirname, '../dist'));

const port = process.env.PORT;

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}).listen(port, () => {
  console.log(`Server start listen on port: ${port}`);
});
