const bookDb = require( './db/bookModel' );
const BooksApi = ( app, router ) => {

    router.get( '/', ( rq, rs ) => {
        bookDb.find().skip( 30 ).limit( 2 ).exec( ( er, data ) => {
            rs.json( data );
        } );
    } );

    app.use( '/api/books', router );
}
module.exports = BooksApi;



// const mongoose = require( 'mongoose' );

// const con = mongoose.connection;
// con.on( 'error', er => console.log( er ) );
// con.on( 'open', () => console.log( 'connected successfully....' ) );
// const db = mongoose.connect( 'mongodb://127.0.0.1/bookAPI' )

// const Book = require( './../model/bookModel' )

// module.exports = ( app ) => {

//     app.get( "/api/student/:id", ( req, res, next ) => {
//         let id = req.params.id;
//         if ( id && Number.isInteger( id ) ) {
//             let st = {
//                 id: id,
//                 name: `Student ${id}`,
//             }
//             res.json( st );
//         }
//         next()
//     } );

//     app.get( "/api/student", ( req, res ) => {

//         Book.find( ( er, books ) => {
//             if ( er ) {
//                 return res.send( er );
//             }
//             return res.json( books );
//         } );
//         //res.send( "All Students" );
//     } );
// }