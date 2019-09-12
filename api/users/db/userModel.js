const mongoose = require( 'mongoose' )
const { Schema } = mongoose;

const model = new Schema( {
    name: { type: 'string' },
    password: { type: 'string', required: true },
    email: { type: 'string', required: true },
    isBlocked: { type: 'boolean', default: false }
} )

const loginModel = new Schema( {
    email: { type: 'string', required: true },
    password: { type: 'string', required: true }
} )

module.exports = {
    userModel: mongoose.model( 'userStore', model, 'userStores' ),
    loginModel: mongoose.model( 'loginModel', loginModel, 'userStores' )
}