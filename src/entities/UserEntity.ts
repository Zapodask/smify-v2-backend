import MusicEntity from "./MusicEntity"
import PlaylistEntity from "./PlaylistEntity"

export default interface UserEntity {
  id: number
  icon_name?: string
  name: string
  email: string
  password: string
  playlists: PlaylistEntity[]
  favorite_musics: MusicEntity[]
}

export interface UserFavoriteMusicsEntity {
  id: number
  favorite_music_id: number
  user_id: number
}
