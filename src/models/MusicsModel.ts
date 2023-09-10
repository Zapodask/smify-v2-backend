import { query } from "express";
import MusicEntity from "../entities/MusicEntity"
import { executeQuery } from "./connection"



interface Search {
    search: string;
    limit: number;
    offset: number;
}

interface FavoriteMusics {
    id: number,
    favorite_music_id: number,
    user_id: number
}

export default class MusicsModel {
    static async getMusics({ search, limit, offset }: Search) {

        const searchVerification = search ? 'WHERE name LIKE ?' : ''

        const query = `SELECT * FROM musics ${searchVerification} LIMIT ? OFFSET ?`

        let values = []

        if (search) {
            values.push(`%${search}%`)
        }

        values.push(limit, offset)

        const response = await executeQuery<MusicEntity[]>(query, values)

        return response
    }

    static async getMusicToId(id: number) {
        const query = "SELECT * FROM musics WHERE id = ?"
        const values = [id]
        const response = await executeQuery<MusicEntity[]>(query, values)

        return response
    }

    static async addMusicToPlaylist(musics_ids: number[], playlist_id: number) {
        const response = []

        for (let i = 0; i < musics_ids.length; i++) {
            const query = "INSERT INTO music_playlist(playlist_id, music_id) VALUES(?, ?)"
            const values = [playlist_id, musics_ids[i]]
            response.push(await executeQuery(query, values))
        }

        return response
    }

    static async likeOrDeslike(user_id: number, music_id: number) {
        const query = "SELECT * FROM user_favorite_musics WHERE user_id = ? AND favorite_music_id = ?";
        const queryResult = await executeQuery(query, [user_id, music_id]) as FavoriteMusics[]

        const firstObject = queryResult[0];

        if (queryResult.length > 0) {
            const query = "DELETE FROM user_favorite_musics WHERE id = ?";
            await executeQuery(query, firstObject.id);

            return;
        }


        const addLike = "INSERT INTO user_favorite_musics(favorite_music_id, user_id) VALUES (?, ?)"
        await executeQuery(addLike, [music_id, user_id])

    }
}