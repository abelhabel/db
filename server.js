const net = require('net');
const extend = require('util')._extend;
const port = 7684;
const tcpPort = 80;

const actions = require('./actions');
const tables = require('./tables');

function parse(body) {
  var action =body.action;
  var table = tables[body.table]
  var key = body.key;
  var value = body.value;
  var newItem = body.item;
  // console.log(action, table, key, value);
  if(action === 'get') {
    console.time('get data')
    var item = table.db[value];

    // var item = table[action](body.key, body.value, body.item);
    // console.log('item', item)
    item = JSON.stringify(item);
    console.timeEnd('get data')
    return item;
  } else
  if(action === 'set') {
    if(table.db[value]) return 'Item already set, use update instead'
    table.db[value] = newItem;

    var toWrite = JSON.stringify(table.db);
    require('fs').writeFile(__dirname + '/tables/files/' + table.name + '.json', toWrite, (err, data) => {

    })
    return JSON.stringify(newItem)
  }else
  if(action === 'update') {
    var item = table.db[value];
    if(item) {
      var keys = Object.keys(newItem);
      var length = keys.length;
      for(var i = 0; i < length; i++) {
        item[keys[i]] = newItem[keys[i]];
      }
      var toWrite = JSON.stringify(table.db);
      require('fs').writeFile(__dirname + '/tables/files/' + table.name + '.json', toWrite, (err, data) => {

      })
    }
    return JSON.stringify(item);
  }
  return '';
}

var tcp = net.createServer((socket) => {
  var message;
  socket.on('data', (chunk) => {
    message = JSON.parse(chunk.toString());
    var item = parse(message);
    socket.write(item);
  });
}).on('error', (err) => {
  // handle errors here
  throw err;
});

// grab a random port.
tcp.listen({port: tcpPort, host: 'localhost'}, () => {
  console.log('opened server on', tcp.address());
});

// server.listen(7684);
