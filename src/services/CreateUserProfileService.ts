import UserEntity from "../entities/UserEntity"
import UsersModel from "../models/usersModel"

export default class CreateUserProfileService {
  constructor(protected readonly userId: number) {}

  public async createUserProfile() {
    console.log("[CreateUserProfileService]  Buscando dados do usuario")
    const user: UserEntity = await UsersModel.getUser(this.userId)

    console.log("[CreateUserProfileService] Busando playlists do usuario")
    const userPlaylists: UserEntity["playlists"] =
      await UsersModel.getUserPlaylists(this.userId)

    console.log("[CreateUserProfileService] Montando perfil do usuario")

    const userProfile: Partial<UserEntity> = {
      id: user.id,
      icon_name: user.icon_name,
      email: user.email,
      name: user.name,
      playlists: userPlaylists,
    }

    return userProfile
  }
}
