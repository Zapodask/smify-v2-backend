import { UserFavoriteMusicsEntity } from "../entities/UserEntity"
import MusicsModel from "../models/MusicsModel"
import UsersModel from "../models/usersModel"

export default class AddlikeOrDeslikeService {
  constructor(
    protected readonly user_id: number,
    protected readonly music_id: number,
  ) {}

  public async addlikeOrDeslike() {
    try {
      const userFavoriteMusics: UserFavoriteMusicsEntity[] =
        await UsersModel.getUserFavoriteMusics(this.user_id, this.music_id)

      if (userFavoriteMusics.length > 0) {
        await MusicsModel.deslikeMusic(userFavoriteMusics[0].id)
        return
      }

      await MusicsModel.likeMusic(this.music_id, this.user_id)
    } catch (error) {
      console.log(error)
    }
  }
}
