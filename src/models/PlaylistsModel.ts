import AssignPlaylistMusicsDTO from "../dto/AssignPlaylistMusicsDTO"
import CreatePlaylistDTO from "../dto/CreatePlaylistDTO"
import MusicEntity from "../entities/MusicEntity"
import PlaylistEntity from "../entities/PlaylistEntity"
import { executeQuery } from "./connection"

export default class PlaylistsModel {
  static async getPlaylists() {
    const query = "SELECT * FROM playlists"
    const response = await executeQuery(query)

    return response as PlaylistEntity[]
  }

  static async getPlaylist(id: number) {
    const query = "SELECT * FROM playlists WHERE id = $1"
    const values = [id]
    const response = await executeQuery<PlaylistEntity[]>(query, values)

    return response[0]
  }

  static async createPlaylist(dto: CreatePlaylistDTO) {
    const playlistIds = await executeQuery<
      {
        id: number
      }[]
    >("INSERT INTO playlists (playlist_name) VALUES ($1) RETURNING id", [
      dto.playlist_name,
    ])

    const playlistId = playlistIds[0].id

    await executeQuery<number>(
      "INSERT INTO user_playlists(user_id, playlist_id) VALUES($1, $2) RETURNING id",
      [dto.user_id, playlistId],
    )
    return playlistId
  }

  static async getPlaylistsMusics(playlist_id: number) {
    const query =
      "SELECT m.* FROM music_playlist as mp INNER JOIN musics as m ON m.id = mp.music_id WHERE mp.playlist_id = $1"

    const values = [playlist_id]
    const response = await executeQuery(query, values)

    return response as MusicEntity[]
  }

  static async updatedPlaylistStatus(playlist_name: string, id: number) {
    const query = "UPDATE playlists SET playlist_name = $1 WHERE id = $2"

    const values = [playlist_name, id]
    const response = await executeQuery(query, values)

    return response
  }

  static async deletePlaylist(playlist_id: number) {
    const values = [playlist_id]

    const deleteFromMusicPlaylist = await executeQuery(
      "DELETE FROM music_playlist WHERE playlist_id = $1",
      values,
    )
    const deleteFromPlaylists = await executeQuery(
      "DELETE FROM playlists WHERE id = $1",
      values,
    )

    return {
      deleteFromMusicPlaylist,
      deleteFromPlaylists,
    }
  }

  static async deleteMusicToPlaylist(playlist_id: number, music_id: number) {
    const query =
      "DELETE FROM music_playlist WHERE playlist_id = $1 AND music_id = $2"
    const values = [playlist_id, music_id]
    const response = await executeQuery(query, values)

    return response
  }

  static async assignPlaylistMusics(dto: AssignPlaylistMusicsDTO) {
    const insertQuery = "INSERT INTO music_playlist (playlist_id, music_id) "
    const valuesQuery = dto.music_ids
      .reduce((acc: string[], _, index) => {
        acc.push(`($${index * 2 + 1}, $${index * 2 + 2})`)
        return acc
      }, [])
      .join(", ")

    const query = insertQuery + "VALUES " + valuesQuery + " RETURNING id"

    const values = dto.music_ids.reduce((acc: number[], music_id) => {
      acc.push(dto.playlist_id)
      acc.push(music_id)
      return acc
    }, [])

    const response = await executeQuery(query, values)

    return response
  }
}
