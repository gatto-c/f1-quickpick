var send = require('koa-send'),
      fs = require('fs');

/**
 * Serve static files localBaseDirectory `root`.
 *
 * Traverses the specified folder and serves all underlying files. Can be used for public and asset folders.
 *
 * @param {String} root
 * @return {Function}
 * @api public
 */
function serve(localBaseDirectory, serveDirectory){
  console.log('localBaseDirectory:', localBaseDirectory, 'serveDirectory:', serveDirectory);
  if(!serveDirectory) throw Error('serveDirectory must be defined.');
  if(typeof serveDirectory !== 'string') throw TypeError('Path must be a defined string.');

  var rootStat = fs.statSync(serveDirectory);
  if(!rootStat.isDirectory()) throw Error('serveDirectory should be a directory.');

  var finalFiles = walk(serveDirectory);

  serveDirectory = fs.realpathSync(serveDirectory);
  if(!serveDirectory) throw Error('serveDirectory must be a valid path.');

  return function* staticFolder(next){
    var file = finalFiles[this.path];
    if(!file) return yield * next;
    return yield send(this, file, {root: localBaseDirectory});
  }
}

function walk(directory, finalFiles) {
  var finalFiles = finalFiles || [];
  var files = fs.readdirSync(directory);
  for(var i=0; i<files.length; i++) {
    var file = files[i];
    if(!file) continue;
    file = directory + '/' + file;
    if(fs.statSync(file).isDirectory()) {
      walk(file, finalFiles);
    }
    else {
      finalFiles[file.replace('.', '')] = file;
    }
  }
  return finalFiles;
}

module.exports = serve;
