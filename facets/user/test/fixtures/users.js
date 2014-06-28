exports.fakeuser = {
   "_id": "org.couchdb.user:fakeuser",
   "_rev": "4-ee6a224abd5503882ac5150f9e8f5a7a",
   "name": "fakeuser",
   "type": "user",
   "salt": "b6da1cbb4e1e0a3a4903afc92ed73c11293848485d057f34c8ab3c6093ba",
   "date": "2014-04-16T18:16:44.025Z",
   "email": "b@fakeuser.com",
   "avatar": "https://secure.gravatar.com/avatar/81668436195664f28a376e0407dbfbd3?s=50&d=retro",
   "avatarMedium": "https://secure.gravatar.com/avatar/81668436195664f28a376e0407dbfbd3?s=100&d=retro",
   "avatarLarge": "https://secure.gravatar.com/avatar/81668436195664f28a376e0407dbfbd3?s=496&d=retro",
   "fields": [
       {
           "name": "fullname",
           "value": "Boom",
           "title": "Full Name",
           "show": "Boom"
       },
       {
           "name": "email",
           "value": "b@fakeuser.com",
           "title": "Email",
           "show": "<a href=\"mailto:b@fakeuser.com\">b@fakeuser.com</a>"
       },
       {
           "name": "github",
           "value": "abcde",
           "title": "GitHub",
           "show": "<a rel=\"me\" href=\"https://github.com/abcde\">abcde</a>"
       },
       {
           "name": "twitter",
           "value": "",
           "title": "Twitter",
           "show": ""
       },
       {
           "name": "appdotnet",
           "value": "",
           "title": "App.net",
           "show": ""
       },
       {
           "name": "homepage",
           "value": "",
           "title": "Homepage",
           "show": ""
       },
       {
           "name": "freenode",
           "value": "",
           "title": "IRC Handle",
           "show": ""
       }
   ],
   "fullname": "Boom",
   "github": "abcde",
   "twitter": "",
   "appdotnet": "",
   "homepage": "",
   "freenode": "",
   "roles": [],
   "mustChangePass": false,
   "derived_key": "a7a5bcffa127d44e214fbb0c3148b89c23100c9a",
   "password_scheme": "pbkdf2",
   "iterations": 10
}

exports.fakeuserNewProfile = {
  _id: 'org.couchdb.user:fakeuser',
  name: 'fakeuser',
  fullname: 'Fake User',
  github: 'fakeuser',
  twitter: 'fakeuser',
  appdotnet: '',
  homepage: '',
  freenode: ''
}

exports.fakeuserChangePassword = {
  current: '12345',
  new: 'abcde',
  verify: 'abcde'
}

exports.fakeusercli = {
   "_id": "org.couchdb.user:fakeusercli",
   "_rev": "1-dadbd134b001443c5fe120e4444b2b0e",
   "password_scheme": "pbkdf2",
   "iterations": 10,
   "name": "fakeusercli",
   "email": "f@fakeuser.me",
   "type": "user",
   "roles": [],
   "date": "2014-04-26T00:54:43.315Z",
   "derived_key": "1b3bf7b17b4d1363f07e2701bf6ed7e220ebaaf3",
   "salt": "67bbd97d32e397ded845e279fb371ea7",
   "mustChangePass": true
}

exports.fakeuserCliFields = [
  { name: 'fullname', value: '', title: 'Full Name', show: '' },
  { name: 'email',
    value: 'f@fakeuser.me',
    title: 'Email',
    show: '<a href="mailto:f@fakeuser.me">f@fakeuser.me</a>' },
  { name: 'github', value: '', title: 'GitHub', show: '' },
  { name: 'twitter', value: '', title: 'Twitter', show: '' },
  { name: 'appdotnet', value: '', title: 'App.net', show: '' },
  { name: 'homepage', value: '', title: 'Homepage', show: '' },
  { name: 'freenode', value: '', title: 'IRC Handle', show: '' }
]

exports.fakeusernoemail = {
   "_id": "org.couchdb.user:fakeusernoemail",
   "_rev": "1-dadbd134b001443c5fe120e4444b2b0e",
   "password_scheme": "pbkdf2",
   "iterations": 10,
   "name": "fakeusernoemail",
   "email": "",
   "type": "user",
   "roles": [],
   "date": "2014-04-26T00:54:43.315Z",
   "derived_key": "1b3bf7b17b4d1363f07e2701bf6ed7e220ebaaf3",
   "salt": "67bbd97d32e397ded845e279fb371ea7"
}

exports.fakeuserbademail = {
   "_id": "org.couchdb.user:fakeuserbademail",
   "_rev": "1-dadbd134b001443c5fe120e4444b2b0e",
   "password_scheme": "pbkdf2",
   "iterations": 10,
   "name": "fakeuserbademail",
   "email": "fake@bademail",
   "type": "user",
   "roles": [],
   "date": "2014-04-26T00:54:43.315Z",
   "derived_key": "1b3bf7b17b4d1363f07e2701bf6ed7e220ebaaf3",
   "salt": "67bbd97d32e397ded845e279fb371ea7"
}
