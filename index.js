var Hapi = require('hapi'),
    config = require('./config.js')

var server = new Hapi.Server(config.host, config.port, config.server)

server.route({
  path: '/static/{path*}',
  method: 'GET',
  handler: {
    directory: {
      path: './static',
      listing: false,
      index: false
    }
  }
});

server.pack.require({'./facets/company': null, './facets/registry': null, './servers/hapi-couchdb': config.couch}, function(err) {
    if (err) throw err;
    server.start(function() {
        console.log('Hapi server started @ ' + server.info.uri);
    });
});
