export class UserFavoriteMusic {
  private readonly id: number
  private favorite_music_id: number
  private user_id: number

  constructor(id: number, favorite_music_id: number, user_id: number) {
    this.id = id
    this.favorite_music_id = favorite_music_id
    this.user_id = user_id
  }
}