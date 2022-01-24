const API = {
  auth: [
    {
      method: 'POST',
      path: '/auth/login',
      secure: false,
      useBody: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        type: 'object',
        required: [ 'username', 'password' ],
        properties: {
          username: {
            type: 'string',
            minLength: 3
          },
          password: {
            type: 'string',
            minLength: 6
          }
        }
      },
      handler: 'login',
      roles: []
    },
    {
      method: 'GET',
      path: '/auth/logout/{{id}}',
      secure: true,
      useBody: false,
      headers: {
        Accept: 'application/json',
        Credentials: 'include'
      },
      schema: {
        // ...
      },
      handler: 'logout',
      roles: [ 'user' ]
    },
    {
      method: 'POST',
      path: '/auth/registrate',
      secure: false,
      useBody: true,
      schema: {
        // ...
      },
      handler: 'registrate',
      roles: []
    }
  ],
};

async function test() {
  const { Service } = require( './../service/service' );
  const { ResponseProcessor } = require( './../service/responseProcessor' );
  const { MimeParser } = require( '../service/mimeParser' );

  const mimeParserPairs = [
    [ 'application/json', ( data ) => console.log( 'app/json', data ) ]
  ];

  const mimeParser = new MimeParser( mimeParserPairs );
  const responseProcessor = new ResponseProcessor( mimeParser );

  const service = new Service( {
    apiModuleSchema: API.auth,
    responseProcessor,
    name: 'auth',
  } );

  const beforeRequestHook = ( requestArgs ) => {
    console.log( 'beforeRequestHook' );
    console.log( requestArgs );
    console.log( '\n\n\n' );
  };

  const beforeFetchHook =  ( requestParams ) => {
    console.log( 'beforeFetch' );
    console.log( requestParams );
    console.log( '\n\n\n' );
  };


  const responseHandledHook = ( handledResponse ) => {
    console.log( 'responseHandledHook' );
    console.log( handledResponse );
    console.log( '\n\n\n' );
  };

  service.onBeforeRequest( beforeRequestHook );
  service.onBeforeFetch( beforeFetchHook );
  service.onResponseHandled( responseHandledHook );

  service.addHandler( {
    handlerName: API.auth[ 0 ].handler,
    dataSchema: API.auth[ 0 ].schema
  } );

  const request = await service.login( {
    username: 'cybirgpl',
    password: 'jeppka22',
  } );
}


module.exports.test = async function() {
  const { fetchPolyfill } = await import( './../fetch-polyfill.js' );
  await fetchPolyfill();

  test();
};
