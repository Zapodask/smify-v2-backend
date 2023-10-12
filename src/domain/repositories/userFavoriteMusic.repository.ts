import { Music } from "../entities/music.entity";
import { UserFavoriteMusic } from "../entities/userFavoriteMusic.entity";

export interface IUserFavoriteMusicRepository {
  listUserFavoriteMusics: (userId: number) => Promise<Array<UserFavoriteMusic>>
  getUserFavoriteMusic: (userId: number, music_id: number) => Promise<Music>
  createUserFavoriteMusic: (userId: number, musicId: number) => Promise<UserFavoriteMusic>
  deleteUserFavoriteMusic: (id: number) => Promise<void>
}
