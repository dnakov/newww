var path = require('path');
var internals = {};

exports.register = function Regsitry (facet, options, next) {

  facet.views({
    engines: { hbs: require('handlebars') },
    path: path.resolve(__dirname, 'templates')
  });

  facet.route({
    path: "/package/{package}/{version?}",
    method: "GET",
    handler: require('./show-package')
  });

  facet.route({
    path: "/browse/{p*}",
    method: "GET",
    handler: require('./show-browse')
  })

  facet.route({
    path: "/keyword/{kw}",
    method: "GET",
    handler: function (request, reply) {
      return reply.redirect('/browse/keyword/' + request.params.kw).code(301);
    }
  });

  facet.route({
    path: "/star",
    method: "POST",
    config: {
      handler: require('./show-star'),
      payload: { parse: false }
    }
  });

  facet.route({
    path: "/star",
    method: "GET",
    config: {
      handler: require('./show-star'),
      auth: {
        mode: 'required'
      },
      plugins: { 'hapi-auth-cookie': {
        redirectTo: '/login'
      }}
    }
  });

  facet.route({
    path: "/search",
    method: "GET",
    handler: require('./show-search')(options)
  });

  facet.route({
    method: '*',
    path: '/{p*}',
    handler: fallbackHandler
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};

// ======= functions ========

function fallbackHandler (request, reply) {
  var name = request.params.p,
      opts = {
        user: request.auth.credentials
      }

  request.server.methods.getPackageFromCouch(name, function (err, package) {

    if (package && !package.error) {
      reply.redirect('/package/' + package._id);
    }

    opts.url = request.server.info.uri + request.url.path;

    request.server.methods.addMetric({name: '404', url: opts.url});
    reply.view('notfound', opts).code(404);
  });
};