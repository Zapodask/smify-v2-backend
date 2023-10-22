import pg from "pg"
import bcryptjs from "bcryptjs"

import { Playlist } from "../../../../domain/entities/playlist.entity"
import { User } from "../../../../domain/entities/user.entity"
import { ICreateUserModel } from "../../../../domain/models/createUser.model"
import { IUserRepository } from "../../../../domain/repositories/user.repository"

export class UserRepository implements IUserRepository {
  constructor (
    private readonly connection: pg.Client
  ) {}

  async listUsers (): Promise<User[]> {
    const query = "SELECT * FROM users"
    const { rows } = await this.connection.query(query)

    return rows
  }

  async getUserById (id: number): Promise<User> {
    const query = "SELECT * FROM users WHERE id = $1"
    const { rows } = await this.connection.query(query, [id])

    return rows[0]
  }

  async getUserByEmail (email: string): Promise<User> {
    const query = "SELECT * FROM users WHERE email = $1"
    const { rows } = await this.connection.query(query, [email])

    return rows[0]
  }

  async createUser (user: ICreateUserModel): Promise<User> {
    try {
      const hashPassword = bcryptjs.hashSync(user.password, 10)

      const query = "INSERT INTO users(name, icon_name, email, password) VALUES($1,$2,$3,$4)"
      const values = [user.name, user.icon_name, user.email, hashPassword]
      const { rows } = await this.connection.query(query, values)

      return rows[0]
    } catch (error) {
      console.log(error)
      throw new Error("Email já existente")
    }
  }

  async getUserPlaylists (userId: number): Promise<Playlist[]> {
    const query = `
      SELECT P.* FROM playlists AS P 
      INNER JOIN user_playlists AS UP ON UP.playlist_id = P.id 
      WHERE UP.user_id = $1
      `

    const { rows } = await this.connection.query(query, [userId])

    return rows
  }
}
