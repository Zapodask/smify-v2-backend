import bcryptjs from 'bcryptjs';
import PlaylistEntity from "../entities/PlaylistEntity";
import UserEntity from "../entities/UserEntity";
import { executeQuery } from "./connection";
import MusicEntity from '../entities/MusicEntity';

interface IUserModelEntity {
    id: number;
    playlist_id: number;
    user_id: number;
}

export default class UsersModel {

    static async listUsers() {
        const query = "SELECT * FROM users"
        const response = await executeQuery(query)

        return response as UserEntity[]
    }
    
    static async getUserPlaylists(user_id: number) {
        const playlists = await executeQuery(`
        SELECT P.* FROM playlists AS P 
        INNER JOIN user_playlists AS UP ON UP.playlist_id = P.id 
        WHERE UP.user_id = ?
        `, [user_id]) as PlaylistEntity[];

        return playlists

    }

    static async createUsers(user: UserEntity): Promise<UserEntity[]> {
        console.log('user', user)
        const hashPassword = bcryptjs.hashSync(user.password, 10)

        const query = "INSERT INTO users(name, icon_name, email, password) VALUES(?,?,?,?)"
        const values = [user.name, user.icon_name, user.email, hashPassword]
        const response = await executeQuery(query, values)

        return response as UserEntity[]
    }

    static async LoginUsers(user: UserEntity): Promise<UserEntity[]> {

        const query = "SELECT * FROM users WHERE email = ?"
        const values = [user.email]
        const response = await executeQuery(query, values)

        return response as UserEntity[]
    }


    static async getUserProfile(userId: number) {
        const user = await executeQuery("SELECT * FROM users AS U WHERE id = ?", [userId]) as UserEntity[];

        const userPlaylists = await executeQuery(`
        SELECT P.* FROM playlists AS P 
        INNER JOIN user_playlists AS UP ON UP.playlist_id = P.id 
        WHERE UP.user_id = ?
        `, [userId]) as PlaylistEntity[];


        const profile: Partial<UserEntity> = {
            id: user[0].id,
            icon_name: user[0].icon_name,
            email: user[0].email,
            name: user[0].name,
            playlists: userPlaylists,
        };

        return profile;
    }

    static async getFavoriteMusics(user_id: number) {
        const query = "SELECT * FROM user_favorite_musics WHERE user_id = ?"
        const values = [user_id]
        const response = await executeQuery(query, values)

        return response as MusicEntity[]
    }


}