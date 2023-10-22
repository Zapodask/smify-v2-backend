import pg from "pg"

import { Music } from "../../../../domain/entities/music.entity"
import { ICreateMusicModel } from "../../../../domain/models/createMusic.model"
import { IPaginationModel } from "../../../../domain/models/pagination.model"
import { IMusicRepository } from "../../../../domain/repositories/music.repository"


export class MusicRepository implements IMusicRepository {
  constructor (
    private readonly connection: pg.Client
  ) {}

  async listMusics (search: string, pagination: IPaginationModel): Promise<Array<Music>> {
    try {
      const query = search
        ? "SELECT * FROM musics WHERE name LIKE $1 LIMIT $2 OFFSET $3"
        : "SELECT * FROM musics LIMIT $1 OFFSET $2"

      const values = []

      if (search) {
        values.push(`%${search}%`)
      }

      values.push(pagination.limit, pagination.offset)

      const { rows } = await this.connection.query(query, values)
      return rows
    } catch (error) {
      console.log("falha", error)
      return []
    }
  }

  async getMusicById (id: number): Promise<Music> {
    const query = "SELECT * FROM musics WHERE id = $1"
    const { rows } = await this.connection.query(query, [id])

    return rows[0]
  }

  async createMusic (music: ICreateMusicModel): Promise<Music> {
    const query = "INSERT INTO musics(name, singer, logo) VALUES($1, $2, $3)"
    const values = [music.name, music.singer, music.logo]
    
    const { rows } = await this.connection.query(query, values)

    return rows[0]
  }
}
