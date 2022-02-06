import { GetUserServiceCommand } from '@services/command'

// Типа сервис
const userService = {
    async getUser() {
     // ...
    },
    async getUserTickets() {
        // ...
    }
}

const getUserCommand = new GetUserServiceCommand( { userService } )
const userData = await getUserCommand.execute()

