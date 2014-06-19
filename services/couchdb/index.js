var CouchLogin = require('couch-login'),
    Hapi = require('hapi'),
    SECOND = 1000;

var adminCouch, anonCouch;

exports.register = function Couch (service, options, next) {

  if (options.couchAuth) {
    var ca = options.couchAuth.split(':'),
        name = ca.shift(),
        password = ca.join(':'),
        auth = { name: name, password: password };

    // the admin couch uses basic auth, or couchdb freaks out eventually
    adminCouch = new CouchLogin(options.registryCouch, 'basic');
    adminCouch.strictSSL = false;
    adminCouch.login(auth, function (er, cr, data) {
      if (er) throw er;
    });
  }

  anonCouch = new CouchLogin(options.registryCouch, NaN);

  service.method('getPackageFromCouch', getPackageFromCouch, {
    cache: { expiresIn: 60 * SECOND, segment: '##package' }
  });

  service.method('getUserFromCouch', getUserFromCouch, {
    cache: { expiresIn: 60 * SECOND, segment: '##user' }
  });

  service.method('getBrowseData', require('./browse')(anonCouch), {
    cache: { expiresIn: 60 * SECOND, segment: '##browse' }
  });

  service.method('loginUser', require('./login')(service, anonCouch));

  service.method('signupUser', signupUser);

  service.method('saveProfile', saveProfile);

  service.method('changePass', changePass);

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};

//========== functions ===========

function getPackageFromCouch (package, next) {
  anonCouch.get('/registry/' + package, function (er, cr, data) {
    next(er, data);
  });
}

function getUserFromCouch (name, next) {
  anonCouch.get('/_users/org.couchdb.user:' + name, function (er, cr, data) {
    if (er || cr && cr.statusCode !== 200 || !data || data.error) {
      return next(Hapi.error.notFound(name))
    }

    return next(null, data)
  })
}

function signupUser (acct, next) {
  anonCouch.signup(acct, function (er, cr, data) {
    if (er || cr && cr.statusCode >= 400 || data && data.error) {
        var error = "Failed creating account.  CouchDB said: "
                  + ((er && er.message) || (data && data.error))

      return next(new Error(error));
    }

    return next(null, data);
  });
}

function saveProfile (user, next) {
  adminCouch.post('/_users/_design/scratch/_update/profile/' + user._id, user, function (er, cr, data) {
    if (er || cr && cr.statusCode !== 201 || !data || data.error) {
      return next(Hapi.error.internal(er || data.error));
    }

    return next(null, data);
  });
}

function changePass (auth, next) {
  adminCouch.changePass(auth, function (er, cr, data) {
    if (er || cr.statusCode >= 400) {
      return next(er && er.message || data && data.message)
    }

    return next(null, data);
  });
}