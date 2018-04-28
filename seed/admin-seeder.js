var User = require('../models/user');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', {
  useMongoClient: true,
  /* other options */
});

var users = [
    new User({
        email: 'admin@admin.com',
        password: '$2a$05$ga9c3Igf8KZO4Ycv6KfKTeQMgp99DER0UbCytgFPtNN09KB5Jx6sm',
        admin: 1
    })
];

var done = 0;
for (var i = 0; i < users.length; i++) {
    users[i].save(function(err, result) {
        done++;
        if (done === users.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}