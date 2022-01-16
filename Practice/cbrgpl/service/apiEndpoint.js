const { NO_CONTENT_TYPE } = require( './../helper/consts' );

const queryIdTempalate = '{{id}}';

module.exports.ApiEndpoint = class {
  constructor( endpointMetadata ) {
    this.endpointMetadata = endpointMetadata;
  }


  getRequestParams( data, id ) {
    const requestParams = {
      url: null,
      fetchParams: {
        body: null,
        method: this.endpointMetadata.method,
        headers: this.endpointMetadata.headers,
      },
      requestMetadata: {
        secure: this.endpointMetadata.secure,
        roles: this.endpointMetadata.roles,
      }
    };

    const path = this.getUrl( id );
    const { url, body } = this.bindDataToRequest( path, data );

    requestParams.fetchParams.body = body;
    requestParams.url = url;

    if( body === NO_CONTENT_TYPE ) {
      delete requestParams.fetchParams.body;
    }

    return requestParams;
  }

  getUrl( id ) {
    return this.endpointMetadata.path.replace( queryIdTempalate, id );
  }

  bindDataToRequest( path, data ) {
    if( this.endpointMetadata.useBody ) {
      return {
        url: path,
        body: data,
      };
    }

    return {
      url: this.insertQueryParams( path, data ),
      body: NO_CONTENT_TYPE,
    };
  }

  insertQueryParams( path, queryParams ) {
    let url = path + '?';

    for( const param in queryParams ) {
      url += `${ param }=${ queryParams[ param ] }&`;
    }

    return url.slice( 0, -1 );
  }

};
