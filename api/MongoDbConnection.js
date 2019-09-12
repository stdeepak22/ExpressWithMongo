const mongoose = require( 'mongoose' );

module.exports = {
    startup: ( serverName = "localhost", dbName = "TryExpressDb" ) => {
        mongoose.connect( `mongodb://${serverName}/${dbName}` );
        mongoose.connection.on( 'error', er => console.error( er ) );
        mongoose.connection.on( 'open', () => console.log( `Mongo DB Connected successfully to db[${dbName}]` ) );
    }
}