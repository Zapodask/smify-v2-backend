import { Playlist } from "../entities/playlist.entity"
import { ICreatePlaylistModel } from "../models/createPlaylist.model"

export interface IPlaylistRepository {
  listPlaylists: () => Promise<Array<Playlist>>
  getPlaylistById: (id: number) => Promise<Playlist>
  createPlaylist: (playlist: ICreatePlaylistModel) => Promise<Playlist>
  updatePlaylistStatus: (playlistId: number, playlistName: string) => Promise<void>
  deletePlaylist: (playlistId: number) => Promise<void>
}
