const net = require('net');

var body = JSON.stringify({
  action: 'get',
  table: 'users',
  key: 'email',
  value: 'andreas@n49.com'

});

// body.item = {
//   email: 'andreas@n49.com',
//   name: 'andreas olsson',
//   age: 322,
//   homeless: false,
//   friends: [{name:'anders'}, {name:'jens'}]
// }

// req.write(body);
// req.end();

var tcpOptions = {
  port: 80,
  host: 'localhost',
  keepAlive: true
}
const socket = new net.Socket();
socket.connect(tcpOptions);

const repl = require('repl');

var replServer = repl.start({prompt: '> '});
replServer.defineCommand('write', {
  help: 'Say hello',
  action: function(name) {
    var that = this;
    console.time('tcp')
    socket.write(body)
    socket.on('data', (chunk) => {
      console.timeEnd('tcp')
      console.log(chunk.toString());
      socket.removeAllListeners();
      that.displayPrompt();
    })
    // this.lineParser.reset();
    // this.bufferedCommand = '';
    // console.log(`Hello, ${name}!`);
    // this.displayPrompt();
  }
});
replServer.defineCommand('exit', function() {
  console.log('Goodbye!');
  this.close();
});

console.time('req')
