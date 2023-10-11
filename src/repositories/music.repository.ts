import MusicEntity from "../entities/MusicEntity"
import { UserFavoriteMusicsEntity } from "../entities/UserEntity"
import { executeQuery } from "../models/connection"

interface Search {
  search: string
  limit: number
  offset: number
}

export class MusicRepository {
  static async getMusics({ search, limit, offset }: Search) {
    try {
      console.log("entrou no model getMusics")

      const query = search
        ? "SELECT * FROM musics WHERE name LIKE $1 LIMIT $2 OFFSET $3"
        : "SELECT * FROM musics LIMIT $1 OFFSET $2"

      const values = []

      if (search) {
        values.push(`%${search}%`)
      }

      values.push(limit, offset)

      console.log("query", query)

      const response = await executeQuery<MusicEntity[]>(query, values)
      return response
    } catch (error) {
      console.log("falha", error)
      return []
    }
  }

  static async addMusics(musics: MusicEntity[]) {
    const response = [] as MusicEntity[]

    musics.map(async (music: MusicEntity) => {
      const query = "INSERT INTO musics(name, singer, logo) VALUES($1, $2, $3)"
      const values = [music.name, music.singer, music.logo]
      const result = (await executeQuery(query, values)) as MusicEntity[]

      response.push(result[0])
    })

    return response as MusicEntity[]
  }

  static async getMusicToId(id: number) {
    const query = "SELECT * FROM musics WHERE id = $1"
    const values = [id]
    const response = await executeQuery<MusicEntity[]>(query, values)

    return response
  }

  static async addMusicToPlaylist(musics_ids: number[], playlist_id: number) {
    const response = []
    const findMusicsToPlaylist = (await executeQuery(
      "SELECT music_id FROM music_playlist WHERE playlist_id = $1",
      [playlist_id],
    )) as { music_id: number }[]

    for (let i = 0; i < findMusicsToPlaylist.length; i++) {
      const musicId = findMusicsToPlaylist[i].music_id

      if (musics_ids.includes(musicId)) return
    }

    for (let i = 0; i < musics_ids.length; i++) {
      const query =
        "INSERT INTO music_playlist(playlist_id, music_id) VALUES($1, $2)"
      const values = [playlist_id, musics_ids[i]]
      response.push(await executeQuery(query, values))
    }

    return response
  }

  static async likeMusic(music_id: number, user_id: number) {
    const query =
      "INSERT INTO user_favorite_musics(favorite_music_id, user_id) VALUES ($1, $2)"
    await executeQuery(query, [music_id, user_id])
  }

  static async deslikeMusic(music_id: number) {
    const query = "DELETE FROM user_favorite_musics WHERE id = $1"
    await executeQuery(query, [music_id])
  }

  static async getLikedMusics(user_id: number) {
    try {
      const query = "SELECT * FROM user_favorite_musics WHERE user_id = $1"
      const queryResult: UserFavoriteMusicsEntity[] = await executeQuery(
        query,
        [user_id],
      )

      const musics = [] as MusicEntity[]

      for (let i = 0; i < queryResult.length; i++) {
        const query = "SELECT * FROM musics WHERE id = $1"
        const queryResultMusic = (await executeQuery(query, [
          queryResult[i].favorite_music_id,
        ])) as MusicEntity[]

        musics.push(queryResultMusic[0])
      }

      return musics
    } catch (error) {
      console.log(error)
    }
  }
}
