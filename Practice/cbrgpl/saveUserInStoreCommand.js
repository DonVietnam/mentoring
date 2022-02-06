import StoreCommand from './base_commands/storeCommand'

class SaveUserInStoreCommand extends StoreCommand {
  execute () {
    this.store.commit( 'user/setUserData', this.data.userData )
  }
}

export default SaveUserInStoreCommand
