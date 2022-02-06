import ServiceCommand from './serviceCommand'

export default class GetUserServiceCommand extends ServiceCommand {
  async execute () {
    const userService = this.services.userService
    const requestArray = [
      () => userService.getUser(),
      () => userService.getUserTickets()
    ]

    const requestResults = await this.makeRequests( requestArray )
    console.log( requestResults )

    return {
      getUserResponse: requestResults[ 0 ],
      getUserTicketsResponse: requestResults[ 1 ]
    }
  }
}
