const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10

const schema = mongoose.Schema({
    login: { type: String, unique: true},
    password: String
})

schema.pre('save', function (next) {
    const user = this

    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
})

schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const registerSchema = (connection) => {
    return { name: 'User', model: connection.model('users', schema) }
}

module.exports = registerSchema