import { UserFavoriteMusicsEntity } from "../entities/UserEntity"
import { MusicRepository } from "../repositories/music.repository"
import { UserRepository } from "../repositories/user.repository"

export default class AddlikeOrDeslikeService {
  constructor(
    protected readonly user_id: number,
    protected readonly music_id: number,
  ) {}

  public async addlikeOrDeslike() {
    try {
      const userFavoriteMusics: UserFavoriteMusicsEntity[] =
        await UserRepository.getUserFavoriteMusics(this.user_id, this.music_id)

      if (userFavoriteMusics.length > 0) {
        await MusicRepository.deslikeMusic(userFavoriteMusics[0].id)
        return
      }

      await MusicRepository.likeMusic(this.music_id, this.user_id)
    } catch (error) {
      console.log(error)
    }
  }
}
