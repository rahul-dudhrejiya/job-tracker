const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String, //must be text
        required: [true, 'Name is required'], //mandotary
        trim: true //remove extra spaces before and after
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, //not two users can have same email
        lowercase: true, //always save email in lowercase
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false //never send password back in response
    },
},
    {
        timestamps: true   // auto adds createdAt, updatedAt
    }
);

// Hash password before saving
// This runs automatically before every .save()
UserSchema.pre('save', async function () {
    //in this before it code i make mistake to add next() but it cause error because next is not needed in async function and it will automatically wait for the async code to finish before moving on to the next middleware or route handler. So I remove next() and now it works fine without any error.
    // If password not changed → skip hashing
    if (!this.isModified('password')) return

    // Generate salt (random extra security string)
    const salt = await bcrypt.genSalt(10);

    // Hash the password with salt
    this.password = await bcrypt.hash(this.password, salt)

})

// Method to check password at login
UserSchema.methods.matchPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)