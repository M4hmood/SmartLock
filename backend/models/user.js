require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthdate: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'non-binary']},
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
}); 

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: '7d'});
};

const User = mongoose.model('User', userSchema);

const validateSignup = (data) => {
    const schema = joi.object({
        firstName: joi.string().required().label("First Name"),
        lastName: joi.string().required().label("Last Name"),
        username: joi.string().alphanum().min(5).max(15).required().label("Username"),
        email: joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        //confirmPassword: joi.ref('password').label("confirm Password"),
        birthdate: joi.date().raw().required().label("Birthdate"),
        gender: joi.string().valid('male', 'female', 'non-binary').label("Gender"),
        role: joi.string().valid('admin', 'user').label("Role"),
    });
    return schema.validate(data);
};

const validateLogin = data => {
    const schema = joi.object({
        username: joi.string().alphanum().min(5).max(15).required().label("Username"),
        password: joi.string().required().label("Password")
    });
    return schema.validate(data);
};

module.exports = {User, validateSignup, validateLogin};