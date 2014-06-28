var Hapi = require('hapi'),
    log = require('bole')('couchdb-login'),
    uuid = require('node-uuid');

module.exports = function (service, anonCouch) {
  return function (loginDetails, next) {
    anonCouch.login(loginDetails, function (er, cr, couchSession) {
      if (er) {
        log.error(uuid.v1() + ' ' + Hapi.error.internal('Unable to log in user ' + loginDetails.name), er);

        return next(Hapi.error.internal('Unable to log in user ' + loginDetails.name));
      }

      if (cr.statusCode !== 200) {
        log.error(uuid.v1() + ' ' + Hapi.error.forbidden('Invalid login credentials for ' + loginDetails.name), er);

        return next(Hapi.error.forbidden('Username and/or Password is wrong'));
      }

      service.methods.getUserFromCouch(loginDetails.name, function (err, data) {
        if (err) {
          log.error(uuid.v1() + ' ' + Hapi.error.internal('Unable to get user ' + loginDetails.name + ' from couch'), er);
        }

        return next(err, data);
      });
    });

  };
};