import { UserFavoriteMusic } from "../entities/userFavoriteMusic.entity";

export interface IUserFavoriteMusicRepository {
  listUserFavoriteMusics: (userId: number) => Promise<Array<UserFavoriteMusic>>
  getUserFavoriteMusic: (userId: number, music_id: number) => Promise<UserFavoriteMusic>
  createUserFavoriteMusic: (userId: number, musicId: number) => Promise<void>
  deleteUserFavoriteMusic: (id: number) => Promise<void>
}
