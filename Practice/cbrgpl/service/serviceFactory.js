const { Service } = require( './service' );

module.exports.ServiceFactory = class  {
  constructor( { ServiceClass = Service, mimeParserPairs } ) {
    if( ServiceClass !== Service && !( ServiceClass.prototype instanceof Service ) ) {
      throw TypeError( 'ServiceClass must extend Service class' );
    }

    this.ServiceClass = ServiceClass;
    this.mimeParserPairs = mimeParserPairs;
  }

  generateServices( apiModules ) {
    const services = {};

    for( const moduleName in apiModules ) {
      const service = this.generateService( moduleName, apiModules[ moduleName ], this.mimeParserPairs );
      services[ service.name ] = service;
    }

    return services;
  }


  generateService( moduleName, apiModule, mimeParserPairs ) {
    const service = new this.ServiceClass( {
      name: moduleName,
      moduleScheme: apiModule,
      mimeParserPairs,
    } );

    for( const endpointMetadata of apiModule ) {
      const handlerName = endpointMetadata.handler;
      service.addHandler( {
        handlerName,
        dataScheme: endpointMetadata.scheme,
        useBody: endpointMetadata.useBody,
      } );
    }

    return service;
  }
};
