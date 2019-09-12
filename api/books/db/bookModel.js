const mongoose = require( 'mongoose' );

const { Schema } = mongoose;

const model = new Schema( {
    isbn: { type: 'string' },
    title: { type: 'string' },
    subtitle: { type: 'string' },
    author: { type: 'string' },
    published: { type: 'string' },
    publisher: { type: 'string' },
    pages: { type: 'string' },
    description: { type: 'string' },
    website: { type: 'string' }
} );

module.exports = mongoose.model( 'bookModel', model, 'bookStore' );