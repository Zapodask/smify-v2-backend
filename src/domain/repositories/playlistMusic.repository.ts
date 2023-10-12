import { Music } from "../entities/music.entity"
import { PlaylistMusic } from "../entities/playlistMusic.entity"

export interface IPlaylistMusicRepository {
  listPlaylistMusics: (playlistId: number) => Promise<Array<Music>>
  getPlaylistMusic: (playlistId: number, musicId: number) => Promise<Music>
  createPlaylistMusic: (playlistId: number, musicId: number) => Promise<PlaylistMusic>
  deletePlaylistMusic: (id: number) => Promise<void>
}
