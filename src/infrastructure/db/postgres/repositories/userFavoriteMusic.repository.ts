import pg from "pg"

import { UserFavoriteMusic } from "../../../../domain/entities/userFavoriteMusic.entity"
import { IUserFavoriteMusicRepository } from "../../../../domain/repositories/userFavoriteMusic.repository"

export class UserFavoriteMusicRepository implements IUserFavoriteMusicRepository {
  constructor (
    private readonly connection: pg.Client
  ) {}
  
  async listUserFavoriteMusics (userId: number): Promise<Array<UserFavoriteMusic>> {
    const query = "SELECT * FROM user_favorite_musics WHERE user_id = $1"
    const { rows } = await this.connection.query(
      query,
      [userId],
    )

    return rows
  }

  async getUserFavoriteMusic (userId: number, music_id: number): Promise<UserFavoriteMusic> {
    const query = "SELECT * FROM user_favorite_musics WHERE user_id = $1 AND favorite_music_id = $2"
    const { rows } = await this.connection.query(
      query,
      [userId, music_id],
    )

    return rows[0]
  }

  async createUserFavoriteMusic (userId: number, musicId: number): Promise<void> {
    const query = "INSERT INTO user_favorite_musics(favorite_music_id, user_id) VALUES ($1, $2)"
    await this.connection.query(query, [musicId, userId])
  }

  async deleteUserFavoriteMusic (id: number): Promise<void> {
    const query = "DELETE FROM user_favorite_musics WHERE id = $1"
    await this.connection.query(query, [id])
  }
}
