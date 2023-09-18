import MusicEntity from "../entities/MusicEntity";
import { executeQuery } from "./connection";
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

        try {
            console.log('entrou no model getMusics')

            const query = search ? 'SELECT * FROM musics WHERE name LIKE $1 LIMIT $2 OFFSET $3' : 'SELECT * FROM musics LIMIT $1 OFFSET $2'

            const values = []

            if (search) {
                values.push(`%${search}%`)
            }

            values.push(limit, offset)

            console.log('query', query)

            const response = await executeQuery<MusicEntity[]>(query, values)
            return response
        } catch (error) {
            console.log('falha', error)
            return [];
        }
    }

    //faça uma função que adicione várias músicas no banco de dados
    static async addMusics(musics: MusicEntity[]) {
        const response = [] as MusicEntity[]

        musics.map(async (music: MusicEntity) => {
            const query = "INSERT INTO musics(name, singer, logo) VALUES($1, $2, $3)"
            const values = [music.name, music.singer, music.logo]
            const result = await executeQuery(query, values) as MusicEntity[]

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

        for (let i = 0; i < musics_ids.length; i++) {
            const query = "INSERT INTO music_playlist(playlist_id, music_id) VALUES($1, $2)"
            const values = [playlist_id, musics_ids[i]]
            response.push(await executeQuery(query, values))
        }

        return response
    }

    static async likeOrDeslike(user_id: number, music_id: number) {
        try {
            const query = "SELECT * FROM user_favorite_musics WHERE user_id = $1 AND favorite_music_id = $2";
            const queryResult = await executeQuery(query, [user_id, music_id]) as FavoriteMusics[]

            if (queryResult.length > 0) {
                const query = "DELETE FROM user_favorite_musics WHERE id = $1";
                await executeQuery(query, [queryResult[0].id]);

                return;
            }


            const addLike = "INSERT INTO user_favorite_musics(favorite_music_id, user_id) VALUES ($1, $2)"
            await executeQuery(addLike, [music_id, user_id])
        } catch (error) {
            console.log(error)
        }

    }

    static async getLikedMusics(user_id: number) {
        try {
            const query = "SELECT * FROM user_favorite_musics WHERE user_id = $1";
            const queryResult = await executeQuery(query, [user_id]) as FavoriteMusics[]

            const musics = [] as MusicEntity[]

            for (let i = 0; i < queryResult.length; i++) {
                const query = "SELECT * FROM musics WHERE id = $1";
                const queryResultMusic = await executeQuery(query, [queryResult[i].favorite_music_id]) as MusicEntity[]

                musics.push(queryResultMusic[0])
            }

            return musics
        }
        catch (error) {
            console.log(error)
        }
    }
}