import { Playlist } from "../entities/playlist.entity";
import { User } from "../entities/user.entity";
import { ICreateUserModel } from "../models/createUser.model";

export interface IUserRepository {
  listUsers: () => Promise<Array<User>>
  getUserById: (id: number) => Promise<User>
  getUserByEmail: (email: string) => Promise<User>
  createUser: (user: ICreateUserModel) => Promise<User>
  getUserPlaylists: (userId: number) => Promise<Array<Playlist>>
}