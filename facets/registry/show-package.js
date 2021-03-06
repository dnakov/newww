var Hapi = require('hapi'),
    presentPackage = require('./presenters/package'),
    log = require('bole')('registry-package'),
    uuid = require('node-uuid');


module.exports = function (request, reply) {
  var getPackageFromCouch = request.server.methods.getPackageFromCouch,
      getBrowseData = request.server.methods.getBrowseData,
      addMetric = request.server.methods.addMetric;

  if (request.params.version) {
    reply.redirect('/package/' + request.params.package)
  }

  var opts = {
    user: request.auth.credentials,
    hiring: request.server.methods.getRandomWhosHiring()
  }

  opts.name = request.params.package

  if (opts.name !== encodeURIComponent(opts.name)) {
    opts.errorType = 'invalid';
    opts.errId = uuid.v1();

    log.error(opts.errId + ' ' + Hapi.error.badRequest('Invalid Package Name'), opts.name);

    return reply.view('error', opts).code(400)
  }

  var timer = { start: Date.now() };
  getPackageFromCouch(opts.name, function (er, pkg) {
    timer.end = Date.now();
    addMetric({
      name: 'latency',
      value: timer.end - timer.start,
      type: 'couchdb',
      package: opts.name
    });

    if (er || pkg.error) {
      opts.errorType = 'notFound';
      opts.errId = uuid.v1();

      log.error(opts.errId + ' ' + Hapi.error.notFound('Package Not Found ' + opts.name), er || pkg.error);

      return reply.view('error', opts).code(404)
    }

    if (pkg.time && pkg.time.unpublished) {
      // reply with unpublished package page
      var t = pkg.time.unpublished.time
      pkg.unpubFromNow = require('moment')(t).format('ddd MMM DD YYYY HH:mm:ss Z');

      opts.package = pkg;

      addMetric({ name: 'showPackage', package: request.params.package });
      return reply.view('unpublished-package-page', opts);
    }

    timer.start = Date.now();
    getBrowseData('depended', opts.name, 0, 1000, function (er, dependents) {
      timer.end = Date.now();
      addMetric({
        name: 'latency',
        value: timer.end - timer.start,
        type: 'couchdb',
        browse: ['depended', opts.name, 0, 1000].join(', ')
      });

      if (er) {
        opts.errId = uuid.v1();
        opts.errorType = 'internal';
        log.error(opts.errId + ' ' + Hapi.error.internal('Unable to get depended data from couch for ' + opts.name), er);

        return reply.view('error', opts).code(500);
      }

      pkg.dependents = dependents;

      presentPackage(pkg, function (er, pkg) {
        if (er) {
          opts.errId = uuid.v1();
          opts.errorType = 'internal';
          log.error(opts.errId + ' ' + Hapi.error.internal('An error occurred with presenting package ' + opts.name), er);
          return reply.view('error', opts).code(500);
        }

        pkg.isStarred = opts.user && pkg.users[opts.user.name] || false;

        opts.package = pkg;
        opts.title = opts.name;

        addMetric({ name: 'showPackage', package: request.params.package });
        reply.view('package-page', opts);
      })
    })
  })
}