const userModels = require( './db/userModel' );
const userDb = userModels.userModel;
const loginModel = userModels.loginModel;
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const token_secure_key = "120af-d343$7-89@h@-$&*%@12an-";
const UserApi = ( app, router ) => {

    function validateLoggedIn ( rq, rs, next ) {
        let auth = rq.header( 'Authorization' );
        if ( auth && auth.split( ' ' ).length == 2 && auth.split( ' ' )[ 0 ].toLowerCase() === 'bearer' ) {
            auth = auth.split( ' ' )[ 1 ];
            try {
                rq.token_data = jwt.verify( auth, token_secure_key );
                next();
            } catch ( ex ) {
                rs.status( 401 ).json( { error: 'Invalid token' } );
            }
        } else {
            rs.status( 401 ).json( { error: 'No bearer Token found.' } );
        }
    }

    function getUsers ( rq, rs, enabled ) {
        let filter = {};
        if ( enabled != undefined ) {
            filter.isBlocked = !enabled
        }
        userDb.find( filter ).sort( { _id: -1 } ).exec( ( er, data ) => {
            rs.json( data );
        } );
    }

    router
        .get( '/', validateLoggedIn, ( rq, rs ) => {
            getUsers( rq, rs )
        } )
        .get( '/enabled', validateLoggedIn, ( rq, rs ) => {
            getUsers( rq, rs, true );
        } )
        .get( '/disabled', validateLoggedIn, ( rq, rs ) => {
            getUsers( rq, rs, false );
        } )
        .post( '/login', ( rq, rs ) => {
            var model = loginModel( rq.body );
            var err = model.validateSync();
            if ( err ) {
                return rs.json( err );
            }

            loginModel.findOne( { email: model.email }, ( er, usr ) => {
                if ( usr ) {
                    if ( bcrypt.compareSync( model.password, usr.password ) ) {
                        let token = jwt.sign( { name: usr.name, email: usr.email }, token_secure_key );
                        return rs.status( 200 ).json( { token: token } );
                    }
                } else if ( er ) {
                    return rs.status( 400 ).json( er );
                }

                rs.status( 401 ).json( { error: 'Cann\'t find such account. Check email/password.' } );
            } );
        } )
        .post( '/', ( rq, rs ) => {
            let obj = new userDb( rq.body );
            let err = obj.validateSync()
            if ( err ) {
                return rs.status( 400 ).json( err );
            }

            if ( obj.password ) {
                obj.password = bcrypt.hashSync( obj.password, bcrypt.genSaltSync() );
            }
            userDb.create( obj, er => {
                if ( !!er ) {
                    rs.status( 400 ).json( er );
                } else {
                    console.log( obj );
                    rs.status( 201 ).send();
                }
            } )

        } )

    app.use( '/api/users', router );
}
module.exports = UserApi;