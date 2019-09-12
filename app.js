    const express = require( "express" );
    const fs = require( 'fs' );
    const nPath = require( 'path' );
    const bParser = require( 'body-parser' );
    const app = express();
    const port = 8090;
    const MongoDbConnection = require( './api/MongoDbConnection' );

    function importJsFiles ( path, succReg ) {
        try {


            let isDir = fs.statSync( path ).isDirectory();
            if ( isDir ) {
                fs.readdirSync( path ).forEach( childName => {
                    importJsFiles( nPath.join( path, childName ), succReg );
                } );
            } else {
                if ( path.toLowerCase().endsWith( 'api.js' ) ) {
                    require( path )( app, express.Router() );
                    succReg.push( path.replace( __dirname, '.' ) );
                }
                // else {
                //     console.log( `[registerApi] register files named as 'XXXXXXApi.js' under directory. Invalid file = [${path.replace( __dirname, '.' )}] <<< SKIPPING >>>` );
                // }
            }
        } catch ( ex ) {
            console.error( ex );
        }
    }

    module.exports = () => {
        return {
            instance: app,
            registerApi: ( ...filePaths ) => {
                const succReg = [];
                filePaths.forEach( p => {
                    let dJoin = nPath.join( __dirname, p );
                    try {
                        importJsFiles( dJoin, succReg );
                    } catch ( err ) {
                        console.log( `[registerApi] accepts only directory path/exact file path. Invalid path = [${p}] <<< SKIPPING >>>` );
                    }

                    console.log( `Register successfully = [${succReg.join(', ')}]` );
                } );
            },
            start: function () {
                app.listen( port, () => console.log( `listening on port ${port}` ) );
                MongoDbConnection.startup();
                app.use( bParser.json() );
                app.use( bParser( {} ) );
                app.get( '/form', ( rq, rs ) => {
                    rs.sendfile( './z.html' );
                } )
            }
        }
    };