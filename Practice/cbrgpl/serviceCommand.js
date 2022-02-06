import { InternalClientLogicError, CommandExecutionError } from '@errors'

export default class ServiceCommand {
  constructor ( services ) {
    this.services = services

    this.promisesQueue = []
  }

  async execute () {
    throw new InternalClientLogicError( 'execute method is not implemented in ServiceCommand descendant' )
  }

  async makeRequests ( requestArray ) {
    this.fulfilRequests( requestArray )

    const promiseResults = await Promise.allSettled( this.promisesQueue )
    const promiseResultsValidation = this.isPromiseResultsValid( promiseResults )

    if ( promiseResultsValidation.isValid ) {
      return promiseResults
    } else {
      throw promiseResultsValidation.reason
    }
  }

  fulfilRequests ( requestArray ) {
    for ( const request of requestArray ) {
      const requestWrapper = this.getRequestPromiseWrapper( request() )
      this.promisesQueue.push( requestWrapper() )
    }
  }

  isPromiseResultsValid ( promiseResults ) {
    for ( const result of promiseResults ) {
      if ( result.status === 'rejected' ) {
        return {
          isValid: false,
          reason: result.reason
        }
      }
    }

    return {
      isValid: true,
    }
  }

  getRequestPromiseWrapper ( requestPromise ) {
    return async () => {
      const request = await requestPromise
      if ( request.httpResponse.status !== 200 ) {
        throw new CommandExecutionError( this.constructor.name, request.httpResponse )
      }

      return request
    }
  }
}
