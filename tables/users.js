function Table(o) {
  var local;
  try {
    local = require('./files/' + o.name + '.json');
  } catch (err) {
    console.log('no such db', err);
  }
  this.name = o.name;
  this.indexes = o.indexes || {id: 'primary'};
  this.db = o.db || local || {};
  this.sdb = {};
}

Table.prototype.get = function(key, val) {
  console.time('get')
  var item = this.db[val];

  if(item) {
    console.timeEnd('get');
    return '{"name": "andreas"}';
    if(item[key] = val) return '{"name": "andreas"}';//JSON.stringify();
    return null;
  }
  return null;
};

Table.prototype.set = function(key, val, item) {
  this.db[val] = item;
  this.sdb[val] = JSON.stringify(item);
  this.backup();
  return item;
};

Table.prototype.backup = function() {
  var toWrite = JSON.stringify(this.db);
  require('fs').writeFile(__dirname + '/files/' + this.name + '.json', toWrite, (err, data) => {
    console.log('wrote file', err, data);
  })
}
module.exports = new Table({name: 'users', email: 'primary'});
